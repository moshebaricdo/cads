const u = 800;
function i(e) {
  if (e == null) return 800;
  if (typeof e == "number") return e;
  const r = e.trim();
  return /^-?\d+(\.\d+)?$/.test(r) ? Number(r) : r;
}
function c(e, r) {
  return (n, t) => {
    !e && (t === "backdropClick" || t === "escapeKeyDown") || r == null || r();
  };
}
export {
  u as DEFAULT_OVERLAY_MAX_WIDTH,
  c as overlayDismissHandler,
  i as resolveOverlayMaxWidth
};
//# sourceMappingURL=overlaySurface.js.map
