const a = {
  background: "var(--background-brand-light)",
  border: "var(--border-brand-mid)",
  borderPrimary: "var(--border-brand-primary)",
  icon: "var(--text-brand-primary-fixed)",
  label: "var(--text-brand-secondary)"
}, n = {
  background: "var(--background-accent-pink-light)",
  border: "var(--border-accent-pink-mid)",
  borderPrimary: "var(--border-accent-pink-primary)",
  icon: "var(--text-accent-pink-primary-fixed)",
  label: "var(--text-accent-pink-secondary)"
}, c = {
  background: "var(--background-accent-orange-light)",
  border: "var(--border-accent-orange-mid)",
  borderPrimary: "var(--border-accent-orange-primary)",
  icon: "var(--text-accent-orange-primary-fixed)",
  label: "var(--text-accent-orange-secondary)"
}, o = {
  background: "var(--background-success-light)",
  border: "var(--border-success-mid)",
  borderPrimary: "var(--border-success-primary)",
  icon: "var(--text-success-primary-fixed)",
  label: "var(--text-success-secondary)"
}, i = {
  background: "var(--background-error-light)",
  border: "var(--border-error-mid)",
  borderPrimary: "var(--border-error-primary)",
  icon: "var(--text-error-primary-fixed)",
  label: "var(--text-error-secondary)"
}, t = {
  background: "var(--background-warning-light)",
  border: "var(--border-warning-mid)",
  borderPrimary: "var(--border-warning-primary)",
  icon: "var(--text-warning-primary-fixed)",
  label: "var(--text-warning-secondary)"
}, d = {
  background: "var(--background-info-light)",
  border: "var(--border-info-mid)",
  borderPrimary: "var(--border-info-primary)",
  icon: "var(--text-info-primary-fixed)",
  label: "var(--text-info-secondary)"
}, b = {
  background: "var(--background-neutral-tertiary)",
  border: "var(--border-neutral-secondary)",
  borderPrimary: "var(--border-neutral-secondary)",
  icon: "var(--text-neutral-primary)",
  label: "var(--text-neutral-secondary)"
};
function s(r) {
  switch (r) {
    case "primary":
    case "brand":
      return a;
    case "pink":
      return n;
    case "orange":
      return c;
    case "success":
      return o;
    case "error":
      return i;
    case "warning":
      return t;
    case "info":
      return d;
    case "neutral":
      return b;
  }
}
function u(r) {
  switch (r) {
    case "success":
      return "circle-check";
    case "error":
      return "circle-xmark";
    case "warning":
      return "circle-exclamation";
    case "info":
      return "circle-info";
    default:
      return null;
  }
}
function l(r, e = "face-smile") {
  return !r || r === "smile" ? e : r === "check-circle" ? "circle-check" : r === "exclamation-circle" ? "circle-exclamation" : r;
}
export {
  u as defaultStatusIcon,
  s as messagingChrome,
  l as resolveMessagingIconName
};
//# sourceMappingURL=messagingSentiment.js.map
