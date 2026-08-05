/**
 * Pre-variable DSCO Styles (OLD—DO NOT USE) → CADS semantic color rewrites.
 *
 * Library `lk-0f0d386a…` — Material-style fill ramps named
 * `Light|Dark / Family / Step` (not semantic paths). Harvested 2026-08-04
 * via Figma `search_design_system` + `importStyleByKeyAsync`.
 *
 * Light/Dark in the style name is the old dual-theme style set; CADS targets
 * are mode-aware variables, so the theme prefix is ignored when rewriting.
 * Family + step pick a semantic role; the matcher further scopes by usage
 * surface (fill → background, text fill → text, stroke → border).
 *
 * Unlisted / non-DSCO paint styles fall through to hex + surface matching.
 */

export interface DscoPaintStyle {
  key: string;
  name: string;
  hex: string;
}

/** Known published FILL styles from DSCO Styles (OLD—DO NOT USE). */
export const dscoPaintStyles: DscoPaintStyle[] = [
  { key: "08035d4008b1417496c39231bda7ce780f45357d", name: "Light/White", hex: "#ffffff" },
  { key: "e742710de7923cdc51df0f874cffac06db2caa49", name: "Light/Black", hex: "#292f36" },
  { key: "81875aa1769d7a03793f5b2f330c67a6d76cbf02", name: "Dark/White", hex: "#ffffff" },
  { key: "df62e55d4038b25921088027ede05c774d2377fd", name: "Dark/Black", hex: "#121212" },
  { key: "6c638f1204df403d9f2662a9982a654ef3d63a5c", name: "Light/Gray/50", hex: "#f7f8fa" },
  { key: "8bdf2e3931cd29caaf956f0db070c5bbf5a80006", name: "Light/Gray/100", hex: "#eaecef" },
  { key: "2a30b37bf095681098ce8c160719cacc2c1276c9", name: "Light/Gray/200", hex: "#d1d4d8" },
  { key: "09f05bc681b3b866e29be8fd4c6c19328747aaae", name: "Light/Gray/300", hex: "#bec2c7" },
  { key: "f6f51e3f0b9c0fac98057293c275ff9d9993e106", name: "Light/Gray/400", hex: "#abb0b6" },
  { key: "8c4e8be3568173ac35a9109261e7f1cc88eaa1e2", name: "Light/Gray/500", hex: "#989ea5" },
  { key: "fff9a0b7d1e5093bf81dee452d4ff5bf686741de", name: "Light/Gray/600", hex: "#858c94" },
  { key: "c6f6f7bffa989ef1c1d8e72708f4de1d55b95a14", name: "Light/Gray/700", hex: "#727a83" },
  { key: "5b74c246606b91b9a3195769e53b1f456661ca9a", name: "Light/Gray/800", hex: "#5f6872" },
  { key: "6d39dbf0e12eb5d4bd2d5d8ff8529609f3b5dee0", name: "Light/Gray/900", hex: "#4c5661" },
  { key: "048fec879fe45856025ba4d225abdd38fc11d4a6", name: "Light/Gray/950", hex: "#394450" },
  { key: "6e05361c1c4fdcb515f3828bebc4c8fb4b8415f8", name: "Dark/Gray/50", hex: "#f7f8fa" },
  { key: "b9cf8017192b2888b3f1b064533b704d4ecce4d5", name: "Dark/Gray/100", hex: "#d4d5d7" },
  { key: "289be8b2ab0346b034988adde322a51e2623f38d", name: "Dark/Gray/200", hex: "#bfc1c3" },
  { key: "994b856a3c57d702a88acf083b27b1cad47e359c", name: "Dark/Gray/300", hex: "#a9acaf" },
  { key: "8e6535cc7658464ee312d2a1d836aeeaab9aeade", name: "Dark/Gray/400", hex: "#94979b" },
  { key: "cb90f8c4eeb65cb02d5be0282c9eeaef0a1e9e47", name: "Dark/Gray/500", hex: "#7f8286" },
  { key: "4326a0fedb4b5063efe221ebcc69dbfc43343f43", name: "Dark/Gray/600", hex: "#6a6e73" },
  { key: "005a04ba6b51acfe4955625ae06427593d3e1349", name: "Dark/Gray/700", hex: "#54595e" },
  { key: "d842ed426634d0ca942ed29d8376cec55cb2c877", name: "Dark/Gray/800", hex: "#3f444b" },
  { key: "f5982d1fc71a87a083f797396056de6c8cc7bed7", name: "Dark/Gray/900", hex: "#292f36" },
  { key: "437ca3aa63fa15ddef840f912467e1bbbf3f670b", name: "Light/Aqua/100", hex: "#cefffd" },
  { key: "cfb3bbdaac15902236201cc4fa6637631ca000a1", name: "Light/Aqua/500", hex: "#3cfff8" },
  { key: "96c135b51baa4be8eb4a8b2c93ccd3c197fe2c2c", name: "Light/Aqua/700", hex: "#30ccc6" },
  { key: "3890d0de429721a98d554a3608e5a8b6704c10f3", name: "Light/Orange/100", hex: "#ffedcc" },
  { key: "93fd2477f351ccfb01ebcf9e8ab6dce967021dce", name: "Light/Orange/500", hex: "#ffa400" },
  { key: "e916e98ce5cac75a24234f03fca040feb32e86b3", name: "Light/Orange/700", hex: "#cc8300" },
  { key: "06d732741853cbf421750b9a40f5cf07f0c523d4", name: "Light/Affirmative/100", hex: "#e2f1e2" },
  { key: "e816dc0cbe1a8e1d527474b2469c89b690bcf532", name: "Light/Affirmative/500", hex: "#3ea33e" },
  { key: "6cad8cc7865980a05443aec0f1cd74d55f8c092f", name: "Light/Affirmative/700", hex: "#2d742d" },
  { key: "b777427daa979625b6b0412da4748ed097d3a64f", name: "Dark/Affirmative/100", hex: "#ecf6ec" },
  { key: "6b3a33e60503af8aebdb29e0676dde90bed4a91e", name: "Dark/Affirmative/500", hex: "#3ea33e" },
  { key: "f2982bf58123e0c88ba8a9846b588e9115d71ec9", name: "Light/Caution/100", hex: "#fef7df" },
  { key: "e7c1559b64dbabb359aca4a0e2fe5f7ab5163411", name: "Light/Caution/500", hex: "#f9cb28" },
  { key: "0a5475cc1a5654a0a26290bd639911c911d28102", name: "Light/Caution/700", hex: "#c7a220" },
  { key: "7972c471211c7e00df778ed6d0c51950acf49d27", name: "Dark/Caution/100", hex: "#fef7df" },
  { key: "a920706bfe1e6334c1803989f3e6cf8c241f14a2", name: "Dark/Caution/500", hex: "#f9cb28" },
  { key: "5d6fda59872abc94191c42ce78ce5922626d3385", name: "Light/Info/100", hex: "#dceffb" },
  { key: "3bf8021af6b80d142190d659d66f2354e3223cd7", name: "Light/Info/500", hex: "#1892e3" },
  { key: "37e14757543a5a6dfccc072420f79a1e6968dbf8", name: "Light/Info/700", hex: "#1375b6" },
  { key: "bc0b47d08b46c7a1a532cc7c6030757c948388d6", name: "Dark/Info/100", hex: "#dceffb" },
  { key: "1b2a6718af79c2efc5a5d63cb9fcea989d5deb4a", name: "Dark/Info/500", hex: "#1892e3" },
];

const BY_KEY = new Map(dscoPaintStyles.map((s) => [s.key, s]));
const BY_NAME = new Map(
  dscoPaintStyles.map((s) => [s.name.toLowerCase(), s]),
);

export function findDscoPaintStyle(
  nameOrKey: string,
): DscoPaintStyle | undefined {
  const trimmed = nameOrKey.trim();
  if (!trimmed) return undefined;
  return BY_KEY.get(trimmed) ?? BY_NAME.get(trimmed.toLowerCase());
}

type StyleSurface = "background" | "text" | "border";

function sentimentRole(
  surface: StyleSurface,
  family: "success" | "warning" | "info",
  step: number,
): string {
  const prefix =
    surface === "border" ? "border" : surface === "text" ? "text" : "background";
  if (step <= 100) {
    if (surface === "text") return `text/${family}/primary`;
    return `${prefix}/${family}/light`;
  }
  if (step >= 700) {
    if (surface === "text") return `text/${family}/secondary`;
    return `${prefix}/${family}/strong`;
  }
  if (surface === "text") return `text/${family}/primary`;
  return `${prefix}/${family}/primary`;
}

function grayRole(surface: StyleSurface, step: number): string {
  if (surface === "text") {
    if (step >= 900) return "text/neutral/primary";
    if (step >= 700) return "text/neutral/secondary";
    if (step >= 500) return "text/neutral/tertiary";
    return "text/neutral/quaternary";
  }
  if (surface === "border") {
    if (step <= 200) return "border/neutral/primary";
    if (step <= 500) return "border/neutral/primary";
    return "border/neutral/secondary";
  }
  // background
  if (step <= 50) return "background/neutral/primary";
  if (step <= 100) return "background/neutral/secondary";
  if (step <= 200) return "background/neutral/tertiary";
  if (step <= 300) return "background/neutral/quaternary";
  if (step <= 400) return "background/neutral/quinary";
  if (step <= 500) return "background/neutral/senary";
  if (step <= 700) return "background/neutral/septenary";
  if (step <= 800) return "background/neutral/octonary";
  return "background/neutral/primary-inverse";
}

function brandRole(surface: StyleSurface, step: number): string {
  const prefix =
    surface === "border" ? "border" : surface === "text" ? "text" : "background";
  if (step <= 100) {
    if (surface === "text") return "text/brand/primary";
    return `${prefix}/brand/light`;
  }
  if (step >= 700) {
    if (surface === "text") return "text/brand/secondary";
    return `${prefix}/brand/strong`;
  }
  if (surface === "text") return "text/brand/primary";
  return `${prefix}/brand/primary`;
}

function orangeRole(surface: StyleSurface, step: number): string {
  const prefix =
    surface === "border" ? "border" : surface === "text" ? "text" : "background";
  if (step <= 100) {
    if (surface === "text") return "text/accent/orange/primary";
    return `${prefix}/accent/orange/light`;
  }
  if (step >= 700) {
    if (surface === "text") return "text/accent/orange/secondary";
    return `${prefix}/accent/orange/strong`;
  }
  if (surface === "text") return "text/accent/orange/primary";
  return `${prefix}/accent/orange/primary`;
}

/**
 * DSCO Styles paint-style name → CADS semantic variable path for a usage surface.
 * Returns null when the name isn't a known DSCO Styles pattern.
 */
export function dscoStyleToCadsColorName(
  styleName: string,
  surface: StyleSurface,
): string | null {
  const parts = styleName
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;

  const theme = parts[0].toLowerCase();
  if (theme !== "light" && theme !== "dark") return null;

  const family = parts[1].toLowerCase();
  const stepRaw = parts[2];
  const step = stepRaw ? Number.parseInt(stepRaw, 10) : NaN;

  if (family === "white" || family === "black") {
    // Caller supplies useFixed from backdrop (chromatic primary fill → fixed).
    return null;
  }

  if (!Number.isFinite(step)) return null;

  if (family === "gray") return grayRole(surface, step);
  if (family === "aqua") return brandRole(surface, step);
  if (family === "orange") return orangeRole(surface, step);
  if (family === "affirmative") return sentimentRole(surface, "success", step);
  if (family === "caution") return sentimentRole(surface, "warning", step);
  if (family === "info") return sentimentRole(surface, "info", step);

  return null;
}
