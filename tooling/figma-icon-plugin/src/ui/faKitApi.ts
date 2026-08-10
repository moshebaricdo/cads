/**
 * Font Awesome GraphQL helpers for optional kit catalog sync.
 * Runs in the plugin UI iframe (needs networkAccess → api.fontawesome.com).
 *
 * Official family-styles use kit-level `iconVariantsPaginated` (pageSize 500)
 * cached per kit so style toggles after the first warm are local/instant.
 * Custom uploads use `iconUploads` (also session-cached).
 */

const FA_API = "https://api.fontawesome.com";
const FA_TOKEN = "https://api.fontawesome.com/token";

export interface FaKitSummary {
  token: string;
  name: string;
}

/** One importable face from a kit (official style or custom uploads). */
export interface FaKitFace {
  kitToken: string;
  kitName: string;
  /** FA GraphQL family, e.g. classic | sharp | kit | kit-duotone */
  family: string;
  /** FA GraphQL style, e.g. solid | regular | custom */
  style: string;
  /** Human label for checklists */
  label: string;
  /** Kit FA version string, e.g. "7.x" / "6.7.2" */
  version: string;
  kind: "official" | "custom";
}

interface FaIconUpload {
  name: string;
  unicodeHex: string;
  pathData: string[];
}

export class FaKitApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FaKitApiError";
  }
}

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  scopes?: string[];
  message?: string;
}

interface GraphQlError {
  message?: string;
}

interface FamilyStyleRef {
  family?: string;
  style?: string;
  label?: string;
}

interface KitsQueryData {
  me?: {
    kits?: Array<{ token?: string; name?: string } | null> | null;
  } | null;
}

interface KitCatalogQueryData {
  me?: {
    kit?: {
      token?: string;
      name?: string;
      version?: string;
      iconUploads?: Array<{
        name?: string | null;
        unicodeHex?: string;
        pathData?: string[];
      } | null> | null;
      familyStylesPaginated?: {
        totalPageCount?: number;
        familyStyles?: Array<{
          familyStyle?: FamilyStyleRef | null;
        } | null> | null;
      } | null;
    } | null;
  } | null;
}

interface KitVariantsPageQueryData {
  me?: {
    kit?: {
      iconVariantsPaginated?: {
        totalPageCount?: number;
        iconVariants?: Array<{
          name?: string | null;
          unicodeHex?: string | null;
          familyStyle?: { family?: string | null; style?: string | null } | null;
        } | null> | null;
      } | null;
    } | null;
  } | null;
}

/** Cache: kitToken → "family|style" → name→hex (official faces only). */
const kitOfficialGlyphCache = new Map<
  string,
  Map<string, Record<string, string>>
>();
/** Deduplicate concurrent warm-ups for the same kit. */
const kitOfficialGlyphInflight = new Map<
  string,
  Promise<Map<string, Record<string, string>>>
>();

const uploadCache = new Map<string, FaIconUpload[]>();
/** Bumped on full cache invalidation — drops zombie writes from in-flight warms. */
let glyphCacheEpoch = 0;
/** Per-kit epoch so invalidating one kit doesn't accept a stale warm for it. */
const kitGlyphEpochs = new Map<string, number>();

interface CachedAccessToken {
  apiToken: string;
  accessToken: string;
  /** epoch ms */
  expiresAt: number;
}

let cachedAccessToken: CachedAccessToken | null = null;

/** Drop the exchanged bearer token (call when the account API token is cleared). */
export function clearFaAccessTokenCache(): void {
  cachedAccessToken = null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function faceKey(kitToken: string, family: string, style: string): string {
  // Normalize so checklist matching is stable across API casing / legacy saves.
  return `${kitToken.trim()}|${family.trim().toLowerCase()}|${style.trim().toLowerCase()}`;
}

export function parseFaceKey(
  key: string,
): { kitToken: string; family: string; style: string } | null {
  const parts = key.split("|");
  if (parts.length !== 3) return null;
  const [kitToken, family, style] = parts;
  if (!kitToken || !family || !style) return null;
  return {
    kitToken,
    family: family.toLowerCase(),
    style: style.toLowerCase(),
  };
}

export function isKitGlyphsCached(kitToken: string): boolean {
  return kitOfficialGlyphCache.has(kitToken);
}

export function invalidateKitGlyphCache(kitToken?: string): void {
  if (kitToken) {
    kitOfficialGlyphCache.delete(kitToken);
    kitOfficialGlyphInflight.delete(kitToken);
    uploadCache.delete(kitToken);
    kitGlyphEpochs.set(kitToken, (kitGlyphEpochs.get(kitToken) ?? 0) + 1);
    return;
  }
  glyphCacheEpoch += 1;
  kitOfficialGlyphCache.clear();
  kitOfficialGlyphInflight.clear();
  uploadCache.clear();
  kitGlyphEpochs.clear();
}

/** Snapshot official glyph caches for persistence (selected kits only). */
export function exportOfficialGlyphCache(
  kitTokens?: string[],
): Record<string, Record<string, Record<string, string>>> {
  const out: Record<string, Record<string, Record<string, string>>> = {};
  const tokens = kitTokens ?? [...kitOfficialGlyphCache.keys()];
  for (const kitToken of tokens) {
    const byFace = kitOfficialGlyphCache.get(kitToken);
    if (!byFace) continue;
    const faces: Record<string, Record<string, string>> = {};
    for (const [faceKey, glyphs] of byFace) {
      faces[faceKey] = { ...glyphs };
    }
    out[kitToken] = faces;
  }
  return out;
}

/** Hydrate official glyph caches from persisted storage. */
export function importOfficialGlyphCache(
  kits: Record<string, Record<string, Record<string, string>>>,
): void {
  for (const [kitToken, faces] of Object.entries(kits)) {
    if (!faces || typeof faces !== "object") continue;
    const byFace = new Map<string, Record<string, string>>();
    for (const [faceKey, glyphs] of Object.entries(faces)) {
      if (!glyphs || typeof glyphs !== "object") continue;
      byFace.set(faceKey, { ...glyphs });
    }
    if (byFace.size > 0) kitOfficialGlyphCache.set(kitToken, byFace);
  }
}

async function exchangeAccessToken(apiToken: string): Promise<string> {
  const trimmed = apiToken.trim();
  if (!trimmed) {
    throw new FaKitApiError("Paste a Font Awesome account API token first.");
  }

  const now = Date.now();
  if (
    cachedAccessToken &&
    cachedAccessToken.apiToken === trimmed &&
    cachedAccessToken.expiresAt > now + 60_000
  ) {
    return cachedAccessToken.accessToken;
  }

  let response: Response;
  try {
    response = await fetch(FA_TOKEN, {
      method: "POST",
      headers: { Authorization: `Bearer ${trimmed}` },
    });
  } catch {
    throw new FaKitApiError(
      "Couldn’t reach api.fontawesome.com — check your network connection.",
    );
  }

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 2000;
    await sleep(waitMs);
    return exchangeAccessToken(apiToken);
  }

  let body: TokenResponse = {};
  try {
    body = (await response.json()) as TokenResponse;
  } catch {
    // fall through
  }

  if (!response.ok || !body.access_token) {
    if (response.status === 401 || response.status === 403) {
      throw new FaKitApiError(
        "API token was rejected. Use an account token with Read Kits Data (kits_read).",
      );
    }
    throw new FaKitApiError(
      body.message ||
        `Token exchange failed (HTTP ${response.status}). Check the API token.`,
    );
  }

  const scopes = body.scopes ?? [];
  if (scopes.length > 0 && !scopes.includes("kits_read")) {
    throw new FaKitApiError(
      "This API token lacks kits_read. Enable Read Kits Data on fontawesome.com/account.",
    );
  }

  const expiresInSec = Math.max(60, body.expires_in ?? 3600);
  cachedAccessToken = {
    apiToken: trimmed,
    accessToken: body.access_token,
    expiresAt: now + expiresInSec * 1000,
  };
  return body.access_token;
}

async function graphql<T>(
  accessToken: string | null,
  query: string,
  variables?: Record<string, unknown>,
  attempt = 0,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(FA_API, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new FaKitApiError(
      "Couldn’t reach api.fontawesome.com — check your network connection.",
    );
  }

  // FA often returns HTML/plain bodies on 429 — handle before JSON parse.
  if (response.status === 429 && attempt < 6) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    const waitMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(16_000, 500 * 2 ** attempt);
    await sleep(waitMs);
    return graphql(accessToken, query, variables, attempt + 1);
  }

  let payload: { data?: T; errors?: GraphQlError[] } = {};
  let parsedOk = false;
  try {
    payload = (await response.json()) as { data?: T; errors?: GraphQlError[] };
    parsedOk = true;
  } catch {
    if (response.status === 429 && attempt < 6) {
      await sleep(Math.min(16_000, 500 * 2 ** attempt));
      return graphql(accessToken, query, variables, attempt + 1);
    }
    throw new FaKitApiError(
      `Font Awesome API returned a non-JSON response (HTTP ${response.status}).`,
    );
  }

  if (!parsedOk) {
    throw new FaKitApiError("Font Awesome API returned no data.");
  }

  if (!response.ok || (payload.errors && payload.errors.length > 0)) {
    const detail =
      payload.errors?.map((error) => error.message).filter(Boolean).join("; ") ||
      `HTTP ${response.status}`;
    if (/unauthor|forbidden|kits_read|scope/i.test(detail)) {
      throw new FaKitApiError(
        "Not authorized to read kits. Use an account API token with kits_read.",
      );
    }
    if (/too complex/i.test(detail)) {
      throw new FaKitApiError(
        "Font Awesome API rejected the request as too large. Try loading fewer styles at once, or sync again.",
      );
    }
    // Some gateways surface rate limits as GraphQL errors.
    if (/rate.?limit|too many requests|429/i.test(detail) && attempt < 6) {
      await sleep(Math.min(16_000, 500 * 2 ** attempt));
      return graphql(accessToken, query, variables, attempt + 1);
    }
    throw new FaKitApiError(`Font Awesome API error: ${detail}`);
  }

  if (!payload.data) {
    throw new FaKitApiError("Font Awesome API returned no data.");
  }
  return payload.data;
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function faceLabel(family: string, style: string, apiLabel?: string): string {
  if (apiLabel?.trim()) return apiLabel.trim();
  if (family === "kit") return "Custom Kit";
  if (family === "kit-duotone") return "Custom Kit Duotone";
  if (family === "classic" && style === "brands") return "Brands";
  if (family === "classic") return titleCase(style);
  return `${titleCase(family)} ${titleCase(style)}`.trim();
}

async function fetchFamilyStylesPage(
  accessToken: string,
  kitToken: string,
  page: number,
): Promise<KitCatalogQueryData> {
  return graphql<KitCatalogQueryData>(
    accessToken,
    `query($kit: String!, $page: Int!) {
      me {
        kit(token: $kit) {
          token
          name
          version
          iconUploads {
            name
            unicodeHex
            pathData
          }
          familyStylesPaginated(page: $page, pageSize: 50) {
            totalPageCount
            familyStyles {
              familyStyle {
                family
                style
                label
              }
            }
          }
        }
      }
    }`,
    { kit: kitToken, page },
  );
}

async function loadKitCatalog(
  accessToken: string,
  kit: FaKitSummary,
): Promise<FaKitFace[]> {
  let page = 1;
  let totalPages = 1;
  let version = "7.x";
  let kitName = kit.name;
  let uploads: FaIconUpload[] = [];
  const seen = new Set<string>();
  const faces: FaKitFace[] = [];

  while (page <= totalPages) {
    const data = await fetchFamilyStylesPage(accessToken, kit.token, page);
    const node = data.me?.kit;
    if (!node?.token) {
      throw new FaKitApiError(
        `Kit “${kit.token}” wasn’t found on this account.`,
      );
    }
    kitName = node.name?.trim() || kitName;
    version = node.version?.trim() || version;
    if (page === 1) {
      uploads = [];
      for (const upload of node.iconUploads ?? []) {
        if (!upload?.name || !upload.unicodeHex) continue;
        uploads.push({
          name: upload.name,
          unicodeHex: upload.unicodeHex.replace(/^0x/i, "").toLowerCase(),
          pathData: Array.isArray(upload.pathData) ? upload.pathData : [],
        });
      }
    }
    totalPages = Math.max(1, node.familyStylesPaginated?.totalPageCount ?? 1);
    for (const entry of node.familyStylesPaginated?.familyStyles ?? []) {
      const fs = entry?.familyStyle;
      if (!fs?.family || !fs.style) continue;
      const family = fs.family.trim().toLowerCase();
      const style = fs.style.trim().toLowerCase();
      const key = `${family}|${style}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const kind =
        family === "kit" || family === "kit-duotone" ? "custom" : "official";
      faces.push({
        kitToken: kit.token,
        kitName,
        family,
        style,
        label: faceLabel(family, style, fs.label),
        version,
        kind,
      });
    }
    page += 1;
  }

  // Ensure custom upload faces appear even if familyStyles omit them.
  const hasMono = uploads.some((u) => u.pathData.length < 2);
  const hasDuo = uploads.some((u) => u.pathData.length >= 2);
  if (hasMono && !seen.has("kit|custom")) {
    faces.push({
      kitToken: kit.token,
      kitName,
      family: "kit",
      style: "custom",
      label: "Custom Kit",
      version,
      kind: "custom",
    });
  }
  if (hasDuo && !seen.has("kit-duotone|custom")) {
    faces.push({
      kitToken: kit.token,
      kitName,
      family: "kit-duotone",
      style: "custom",
      label: "Custom Kit Duotone",
      version,
      kind: "custom",
    });
  }

  uploadCache.set(kit.token, uploads);
  return faces;
}

/** All importable faces across every kit on the account. */
export async function fetchAccountFaces(apiToken: string): Promise<FaKitFace[]> {
  const accessToken = await exchangeAccessToken(apiToken);
  const kitsData = await graphql<KitsQueryData>(
    accessToken,
    `query {
      me {
        kits {
          token
          name
        }
      }
    }`,
  );
  const kits = (kitsData.me?.kits ?? [])
    .filter((kit): kit is { token: string; name?: string } => Boolean(kit?.token))
    .map((kit) => ({
      token: kit.token,
      name: kit.name?.trim() || kit.token,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Load kit catalogs with modest parallelism (avoids 429 while cutting wait).
  const faces: FaKitFace[] = [];
  const concurrency = 2;
  for (let i = 0; i < kits.length; i += concurrency) {
    const batch = kits.slice(i, i + concurrency);
    const batchFaces = await Promise.all(
      batch.map((kit) => loadKitCatalog(accessToken, kit)),
    );
    for (const list of batchFaces) faces.push(...list);
  }

  faces.sort((a, b) => {
    const byKit = a.kitName.localeCompare(b.kitName);
    if (byKit !== 0) return byKit;
    return a.label.localeCompare(b.label);
  });
  return faces;
}

async function ensureUploads(
  apiToken: string,
  kitToken: string,
): Promise<FaIconUpload[]> {
  const cached = uploadCache.get(kitToken);
  if (cached) return cached;
  const globalEpoch = glyphCacheEpoch;
  const kitEpoch = kitGlyphEpochs.get(kitToken) ?? 0;
  const accessToken = await exchangeAccessToken(apiToken);
  const data = await fetchFamilyStylesPage(accessToken, kitToken, 1);
  const uploads: FaIconUpload[] = [];
  for (const upload of data.me?.kit?.iconUploads ?? []) {
    if (!upload?.name || !upload.unicodeHex) continue;
    uploads.push({
      name: upload.name,
      unicodeHex: upload.unicodeHex.replace(/^0x/i, "").toLowerCase(),
      pathData: Array.isArray(upload.pathData) ? upload.pathData : [],
    });
  }
  // Invalidated while in flight — return data but don't re-poison the cache.
  if (
    globalEpoch !== glyphCacheEpoch ||
    (kitGlyphEpochs.get(kitToken) ?? 0) !== kitEpoch
  ) {
    return uploads;
  }
  uploadCache.set(kitToken, uploads);
  return uploads;
}

const KIT_VARIANTS_PAGE_SIZE = 500;
const KIT_VARIANTS_QUERY = `query($kit: String!, $page: Int!) {
  me {
    kit(token: $kit) {
      iconVariantsPaginated(page: $page, pageSize: ${KIT_VARIANTS_PAGE_SIZE}) {
        totalPageCount
        iconVariants {
          name
          unicodeHex
          familyStyle { family style }
        }
      }
    }
  }
}`;

function ingestVariantPage(
  byFace: Map<string, Record<string, string>>,
  pageData: NonNullable<
    NonNullable<KitVariantsPageQueryData["me"]>["kit"]
  >["iconVariantsPaginated"],
) {
  for (const variant of pageData?.iconVariants ?? []) {
    if (!variant?.name || !variant.unicodeHex) continue;
    const family = variant.familyStyle?.family?.trim().toLowerCase();
    const style = variant.familyStyle?.style?.trim().toLowerCase();
    if (!family || !style) continue;
    const key = `${family}|${style}`;
    let glyphs = byFace.get(key);
    if (!glyphs) {
      glyphs = {};
      byFace.set(key, glyphs);
    }
    glyphs[variant.name] = variant.unicodeHex.replace(/^0x/i, "").toLowerCase();
  }
}

function isGlyphWarmCurrent(
  kitToken: string,
  globalEpoch: number,
  kitEpoch: number,
): boolean {
  return (
    globalEpoch === glyphCacheEpoch &&
    (kitGlyphEpochs.get(kitToken) ?? 0) === kitEpoch
  );
}

async function loadKitOfficialGlyphs(
  apiToken: string,
  kitToken: string,
): Promise<Map<string, Record<string, string>>> {
  const globalEpoch = glyphCacheEpoch;
  const kitEpoch = kitGlyphEpochs.get(kitToken) ?? 0;
  const accessToken = await exchangeAccessToken(apiToken);
  const byFace = new Map<string, Record<string, string>>();

  const first = await graphql<KitVariantsPageQueryData>(
    accessToken,
    KIT_VARIANTS_QUERY,
    { kit: kitToken, page: 1 },
  );
  if (!isGlyphWarmCurrent(kitToken, globalEpoch, kitEpoch)) return byFace;

  const firstPage = first.me?.kit?.iconVariantsPaginated;
  if (!firstPage) {
    if (isGlyphWarmCurrent(kitToken, globalEpoch, kitEpoch)) {
      kitOfficialGlyphCache.set(kitToken, byFace);
    }
    return byFace;
  }
  ingestVariantPage(byFace, firstPage);

  const totalPages = Math.max(1, firstPage.totalPageCount ?? 1);
  // Modest parallelism + 429 retry keeps large kits fast without tripping FA.
  const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const batchSize = 3;
  for (let i = 0; i < remaining.length; i += batchSize) {
    if (!isGlyphWarmCurrent(kitToken, globalEpoch, kitEpoch)) return byFace;
    const batch = remaining.slice(i, i + batchSize);
    const pages = await Promise.all(
      batch.map((page) =>
        graphql<KitVariantsPageQueryData>(accessToken, KIT_VARIANTS_QUERY, {
          kit: kitToken,
          page,
        }),
      ),
    );
    for (const data of pages) {
      ingestVariantPage(byFace, data.me?.kit?.iconVariantsPaginated);
    }
  }

  if (isGlyphWarmCurrent(kitToken, globalEpoch, kitEpoch)) {
    kitOfficialGlyphCache.set(kitToken, byFace);
  }
  return byFace;
}

/**
 * Load all official icon variants for a kit once (pageSize 500), then split by
 * family/style. Concurrent callers share one in-flight promise.
 */
async function ensureKitOfficialGlyphs(
  apiToken: string,
  kitToken: string,
): Promise<Map<string, Record<string, string>>> {
  const hit = kitOfficialGlyphCache.get(kitToken);
  if (hit) return hit;

  const inflight = kitOfficialGlyphInflight.get(kitToken);
  if (inflight) return inflight;

  const promise = loadKitOfficialGlyphs(apiToken, kitToken).then(
    (result) => {
      kitOfficialGlyphInflight.delete(kitToken);
      return result;
    },
    (error) => {
      kitOfficialGlyphInflight.delete(kitToken);
      throw error;
    },
  );
  kitOfficialGlyphInflight.set(kitToken, promise);
  return promise;
}

/**
 * Sequentially warm official glyph caches for kits (prioritize earlier tokens).
 * Safe to fire-and-forget after the kit list loads.
 */
export async function prefetchAccountKitGlyphs(
  apiToken: string,
  kitTokens: string[],
  onProgress?: (done: number, total: number, kitToken: string) => void,
): Promise<void> {
  const unique = [...new Set(kitTokens.filter(Boolean))];
  let done = 0;
  for (const kitToken of unique) {
    if (kitOfficialGlyphCache.has(kitToken)) {
      done += 1;
      onProgress?.(done, unique.length, kitToken);
      continue;
    }
    try {
      await ensureKitOfficialGlyphs(apiToken, kitToken);
    } catch {
      // Leave cold — import path retries with backoff.
    }
    done += 1;
    onProgress?.(done, unique.length, kitToken);
  }
}

/** Resolve name→hex glyphs for one kit face. */
export async function fetchFaceGlyphs(
  apiToken: string,
  face: FaKitFace,
): Promise<Record<string, string>> {
  if (face.kind === "custom" || face.family === "kit" || face.family === "kit-duotone") {
    const uploads = await ensureUploads(apiToken, face.kitToken);
    const glyphs: Record<string, string> = {};
    const wantDuo = face.family === "kit-duotone";
    for (const upload of uploads) {
      const isDuo = upload.pathData.length >= 2;
      if (isDuo !== wantDuo) continue;
      glyphs[upload.name] = upload.unicodeHex;
    }
    return glyphs;
  }

  const byFace = await ensureKitOfficialGlyphs(apiToken, face.kitToken);
  return {
    ...(byFace.get(`${face.family}|${face.style}`) ?? {}),
  };
}

/** Warm caches for the kits touched by these faces (official + custom uploads). */
export async function warmFacesGlyphCache(
  apiToken: string,
  faces: FaKitFace[],
): Promise<void> {
  const officialKits = new Set<string>();
  const customKits = new Set<string>();
  for (const face of faces) {
    if (face.kind === "custom" || face.family === "kit" || face.family === "kit-duotone") {
      customKits.add(face.kitToken);
    } else {
      officialKits.add(face.kitToken);
    }
  }
  await Promise.all([
    ...[...officialKits].map((kitToken) =>
      ensureKitOfficialGlyphs(apiToken, kitToken),
    ),
    ...[...customKits].map((kitToken) => ensureUploads(apiToken, kitToken)),
  ]);
}
