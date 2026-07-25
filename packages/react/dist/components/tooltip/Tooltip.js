import { jsx as i, jsxs as v } from "react/jsx-runtime";
import A from "@mui/material/Tooltip";
import I from "@mui/material/Box";
import { FaIcon as M } from "../../icons/FaIcon.js";
import { useExperimentalMotion as R, readSurfaceDurationMs as _ } from "../../theme/experimentalMotion.js";
import s from "./tooltip.module.scss.js";
const S = 6, u = Math.round(S * 0.71), l = 12;
function k(e) {
  const t = String(e);
  return t === "bottom-start" || t === "top-start" ? { axis: "horizontal", side: "start" } : t === "bottom-end" || t === "top-end" ? { axis: "horizontal", side: "end" } : t === "left-start" || t === "right-start" ? { axis: "vertical", side: "start" } : t === "left-end" || t === "right-end" ? { axis: "vertical", side: "end" } : null;
}
function D(e) {
  return {
    name: "cadsArrowEdge",
    enabled: !!e,
    phase: "write",
    requires: ["arrow"],
    fn({ state: t }) {
      if (!e) return;
      const r = t.elements.arrow;
      if (r) {
        if (e.axis === "horizontal") {
          r.style.setProperty("right", "auto", "important"), r.style.setProperty("transform", "none", "important"), e.side === "start" ? r.style.setProperty(
            "left",
            `${l}px`,
            "important"
          ) : (r.style.setProperty("left", "auto", "important"), r.style.setProperty(
            "right",
            `${l}px`,
            "important"
          ));
          return;
        }
        r.style.setProperty("bottom", "auto", "important"), r.style.setProperty("transform", "none", "important"), e.side === "start" ? r.style.setProperty(
          "top",
          `${l}px`,
          "important"
        ) : (r.style.setProperty("top", "auto", "important"), r.style.setProperty(
          "bottom",
          `${l}px`,
          "important"
        ));
      }
    }
  };
}
function C(e) {
  const t = String(e);
  return t.startsWith("top") ? "bottom" : t.startsWith("left") ? "right" : t.startsWith("right") ? "left" : "top";
}
function H(e) {
  const t = String(e);
  return t.endsWith("-start") ? "start" : t.endsWith("-end") ? "end" : "center";
}
function w(e) {
  const t = String(e);
  return t.startsWith("top") ? "bottom center" : t.startsWith("bottom") ? "top center" : t.startsWith("left") ? "center right" : t.startsWith("right") ? "center left" : "center";
}
function P({
  title: e,
  iconName: t
}) {
  return /* @__PURE__ */ v("span", { className: s.label, children: [
    t ? /* @__PURE__ */ i("span", { className: s.labelIcon, "aria-hidden": !0, children: /* @__PURE__ */ i(
      M,
      {
        name: t,
        fontSize: "14px",
        style: {
          width: 14,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }
    ) }) : null,
    /* @__PURE__ */ i("span", { className: s.labelText, children: e })
  ] });
}
function g({
  side: e,
  align: t
}) {
  const r = e === "top" || e === "bottom", a = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center", o = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center";
  return /* @__PURE__ */ i(
    I,
    {
      "aria-hidden": !0,
      className: s.caretWrap,
      sx: {
        ...r ? {
          width: "100%",
          justifyContent: a,
          ...t === "start" ? { pl: `${l}px` } : t === "end" ? { pr: `${l}px` } : null,
          ...e === "top" ? { mb: `-${u}px` } : { mt: `-${u}px` }
        } : {
          alignSelf: "stretch",
          alignItems: o,
          ...t === "start" ? { pt: `${l}px` } : t === "end" ? { pb: `${l}px` } : null,
          ...e === "left" ? { mr: `-${u}px` } : { ml: `-${u}px` }
        }
      },
      children: /* @__PURE__ */ i("span", { className: s.caretDiamond })
    }
  );
}
const B = {
  backgroundColor: "var(--background-neutral-primary-inverse)",
  color: "var(--text-neutral-primary-inverse)",
  borderRadius: "var(--shape-sm)",
  fontFamily: "var(--font-family-main)",
  fontSize: "var(--text-body-sm)",
  lineHeight: "var(--leading-body-sm)",
  padding: "4px 12px",
  maxWidth: 256,
  width: "max-content",
  boxSizing: "border-box",
  boxShadow: "var(--shadow-md)",
  textAlign: "left",
  whiteSpace: "normal"
};
function X({
  title: e,
  hasCaret: t,
  iconName: r,
  placement: a
}) {
  const o = C(a), m = H(a), d = o === "top" || o === "bottom", x = /* @__PURE__ */ i(
    "span",
    {
      className: `${s.bubble} cads-tooltip-surface`,
      style: {
        display: "inline-block",
        position: "relative",
        zIndex: 0,
        "--cads-surface-origin": w(a)
      },
      children: /* @__PURE__ */ i(P, { title: e, iconName: r })
    }
  );
  return /* @__PURE__ */ v(
    "div",
    {
      "data-cads-component": "Tooltip",
      role: "tooltip",
      className: `${s.surfaceWrap} ${d ? s.horizontal : s.vertical}`,
      children: [
        (o === "top" || o === "left") && t ? /* @__PURE__ */ i(g, { side: o, align: m }) : null,
        x,
        (o === "bottom" || o === "right") && t ? /* @__PURE__ */ i(g, { side: o, align: m }) : null
      ]
    }
  );
}
function K({
  children: e,
  title: t,
  hasCaret: r = !0,
  iconName: a,
  placement: o = "bottom",
  surfaceOnly: m = !1,
  slotProps: d,
  enterDelay: x,
  leaveDelay: W,
  ...$
}) {
  const j = r ? 4 + u : 6, N = k(o ?? "bottom"), y = a ? a || "face-smile" : null, b = R(), h = _();
  if (m)
    return /* @__PURE__ */ i(
      X,
      {
        title: t,
        hasCaret: r,
        iconName: y,
        placement: o ?? "bottom"
      }
    );
  const T = /* @__PURE__ */ i(P, { title: t, iconName: y }), {
    popper: p,
    tooltip: n,
    arrow: c,
    transition: z,
    ...E
  } = d ?? {}, f = p && typeof p == "object" && "popperOptions" in p && p.popperOptions && typeof p.popperOptions == "object" ? p.popperOptions : null, O = f && "modifiers" in f && Array.isArray(f.modifiers) ? f.modifiers : [];
  return /* @__PURE__ */ i(
    A,
    {
      ...$,
      title: T,
      arrow: r,
      placement: o,
      enterDelay: x ?? (b ? 300 : void 0),
      leaveDelay: W ?? (b ? 0 : void 0),
      slotProps: {
        ...E,
        transition: {
          ...z,
          ...b ? { timeout: { enter: h, exit: h } } : null
        },
        popper: {
          ...p,
          popperOptions: {
            ...f,
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, j]
                }
              },
              D(N),
              ...O
            ]
          }
        },
        tooltip: {
          ...n,
          className: [
            "cads-tooltip-surface",
            n && typeof n == "object" && "className" in n && n.className ? String(n.className) : ""
          ].filter(Boolean).join(" "),
          sx: {
            ...B,
            margin: "0 !important",
            "--cads-surface-origin": w(
              o ?? "bottom"
            ),
            ...n && typeof n == "object" && "sx" in n && n.sx && typeof n.sx == "object" ? n.sx : null
          }
        },
        arrow: {
          ...c,
          sx: {
            color: "var(--background-neutral-primary-inverse)",
            fontSize: S,
            "&::before": {
              backgroundColor: "var(--background-neutral-primary-inverse)"
            },
            ...c && typeof c == "object" && "sx" in c && c.sx && typeof c.sx == "object" ? c.sx : null
          }
        }
      },
      children: e
    }
  );
}
export {
  K as Tooltip
};
//# sourceMappingURL=Tooltip.js.map
