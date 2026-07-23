const BRAND = {
  background: "var(--background-brand-light)",
  border: "var(--border-brand-mid)",
  borderPrimary: "var(--border-brand-primary)",
  icon: "var(--text-brand-primary-fixed)",
  label: "var(--text-brand-secondary)"
};
const PINK = {
  background: "var(--background-accent-pink-light)",
  border: "var(--border-accent-pink-mid)",
  borderPrimary: "var(--border-accent-pink-primary)",
  icon: "var(--text-accent-pink-primary-fixed)",
  label: "var(--text-accent-pink-secondary)"
};
const ORANGE = {
  background: "var(--background-accent-orange-light)",
  border: "var(--border-accent-orange-mid)",
  borderPrimary: "var(--border-accent-orange-primary)",
  icon: "var(--text-accent-orange-primary-fixed)",
  label: "var(--text-accent-orange-secondary)"
};
const SUCCESS = {
  background: "var(--background-success-light)",
  border: "var(--border-success-mid)",
  borderPrimary: "var(--border-success-primary)",
  icon: "var(--text-success-primary-fixed)",
  label: "var(--text-success-secondary)"
};
const ERROR = {
  background: "var(--background-error-light)",
  border: "var(--border-error-mid)",
  borderPrimary: "var(--border-error-primary)",
  icon: "var(--text-error-primary-fixed)",
  label: "var(--text-error-secondary)"
};
const WARNING = {
  background: "var(--background-warning-light)",
  border: "var(--border-warning-mid)",
  borderPrimary: "var(--border-warning-primary)",
  icon: "var(--text-warning-primary-fixed)",
  label: "var(--text-warning-secondary)"
};
const INFO = {
  background: "var(--background-info-light)",
  border: "var(--border-info-mid)",
  borderPrimary: "var(--border-info-primary)",
  icon: "var(--text-info-primary-fixed)",
  label: "var(--text-info-secondary)"
};
const NEUTRAL = {
  background: "var(--background-neutral-tertiary)",
  border: "var(--border-neutral-secondary)",
  borderPrimary: "var(--border-neutral-secondary)",
  icon: "var(--text-neutral-primary)",
  label: "var(--text-neutral-secondary)"
};
function messagingChrome(sentiment) {
  switch (sentiment) {
    case "primary":
    case "brand":
      return BRAND;
    case "pink":
      return PINK;
    case "orange":
      return ORANGE;
    case "success":
      return SUCCESS;
    case "error":
      return ERROR;
    case "warning":
      return WARNING;
    case "info":
      return INFO;
    case "neutral":
      return NEUTRAL;
  }
}
function defaultStatusIcon(sentiment) {
  switch (sentiment) {
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
function resolveMessagingIconName(name, fallback = "face-smile") {
  if (!name || name === "smile") return fallback;
  if (name === "check-circle") return "circle-check";
  if (name === "exclamation-circle") return "circle-exclamation";
  return name;
}

export { defaultStatusIcon, messagingChrome, resolveMessagingIconName };
//# sourceMappingURL=messagingSentiment.js.map
//# sourceMappingURL=messagingSentiment.js.map