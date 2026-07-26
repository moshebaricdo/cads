export const THEME_STORAGE_KEY = "cads-docs-theme";
/** @deprecated Prefer {@link THEME_STORAGE_KEY}. Kept for one-time migration. */
export const LEGACY_DARK_STORAGE_KEY = "cads-docs-dark";

export type DocsThemePreference = "light" | "dark" | "system";

export function isDocsThemePreference(value: string | null): value is DocsThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readDocsThemePreference(): DocsThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isDocsThemePreference(stored)) return stored;

    const legacy = window.localStorage.getItem(LEGACY_DARK_STORAGE_KEY);
    if (legacy === "1") return "dark";
    if (legacy === "0") return "light";
  } catch {
    /* storage unavailable */
  }
  return "system";
}

export function resolveDocsDark(preference: DocsThemePreference): boolean {
  if (preference === "dark") return true;
  if (preference === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function writeDocsThemePreference(preference: DocsThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    window.localStorage.removeItem(LEGACY_DARK_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** Inline boot script — apply `.dark` before paint to avoid FOUC. */
export function getThemeBootScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var legacy=${JSON.stringify(LEGACY_DARK_STORAGE_KEY)};var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="system"){var l=localStorage.getItem(legacy);p=l==="1"?"dark":l==="0"?"light":"system";}var dark=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;
}
