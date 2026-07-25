/** Docs-wide experimental motion preview (`?motion=1` + session persistence). */

export const MOTION_FLAG_PARAM = "motion";
export const MOTION_FLAG_STORAGE_KEY = "cads-experimental-motion";
export const MOTION_FLAG_EVENT = "cads-experimental-motion";

export function parseMotionFlagParam(value: string | null): boolean | null {
  if (value == null) return null;
  const v = value.trim().toLowerCase();
  if (v === "0" || v === "off" || v === "false") return false;
  if (v === "1" || v === "on" || v === "true") return true;
  return null;
}

export function readMotionFlagFromSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(MOTION_FLAG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeMotionFlagToSession(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MOTION_FLAG_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // Ignore quota / private-mode failures.
  }
  window.dispatchEvent(new Event(MOTION_FLAG_EVENT));
}

/** URL param wins when present; otherwise session (default off). */
export function resolveMotionFlag(urlParam: string | null): boolean {
  const fromUrl = parseMotionFlagParam(urlParam);
  if (fromUrl != null) return fromUrl;
  return readMotionFlagFromSession();
}
