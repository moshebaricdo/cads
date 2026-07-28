import { jsx as o, jsxs as L } from "react/jsx-runtime";
import se from "@mui/material/ClickAwayListener";
import Me from "@mui/material/Popper";
import { forwardRef as Re, useId as Ae, useState as U, useRef as Be, useCallback as ue, useMemo as V, useLayoutEffect as Ee, useEffect as He } from "react";
import { Button as te } from "../button/Button.js";
import { FieldWrapper as Te } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as X } from "../../icons/FaIcon.js";
import { CONTROL_HEIGHT as Z, TEXT_INPUT_SIZE as ze, BUTTON_SIZE as $e } from "../../shared/controlSize.js";
import { useExperimentalMotion as Ce, useSurfacePresence as Oe, surfaceMotionStateAttrs as Ue, experimentalMotionHostAttrs as Ve } from "../../theme/experimentalMotion.js";
import s from "./dropdown.module.scss.js";
function J(...t) {
  return t.filter(Boolean).join(" ");
}
function re(t) {
  return t.type !== "separator" && t.type !== "group";
}
function _(t) {
  return re(t) && !t.disabled;
}
function _e(t = "hug") {
  return t === "hug" ? {
    rootWidth: "max-content",
    triggerWidth: "auto",
    maxWidth: "100%"
  } : t === "full" ? { rootWidth: "100%", triggerWidth: "100%" } : {
    rootWidth: typeof t == "number" ? `${t}px` : t,
    triggerWidth: "100%",
    maxWidth: "100%"
  };
}
function qe(t = "hug", n) {
  if (t === "trigger") {
    const d = Math.max(0, n);
    return { width: d, minWidth: d };
  }
  if (typeof t == "number")
    return { width: "max-content", minWidth: Math.max(t, n) };
  if (t.endsWith("%")) {
    const d = Number.parseFloat(t) / 100, l = Math.max(0, n * d);
    return { width: l, minWidth: l };
  }
  return {
    width: "max-content",
    minWidth: Math.max(0, n) || "max-content"
  };
}
function je(t) {
  switch (t) {
    case "bottomRight":
      return "bottom-end";
    case "topLeft":
      return "top-start";
    case "topRight":
      return "top-end";
    case "bottomLeft":
    default:
      return "bottom-start";
  }
}
function Fe(t) {
  switch (t) {
    case "bottomRight":
      return "top right";
    case "topLeft":
      return "bottom left";
    case "topRight":
      return "bottom right";
    case "bottomLeft":
    default:
      return "top left";
  }
}
function Ge(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), d = t.offsetWidth, l = t.offsetHeight, u = n.left - (d - n.width) / 2, x = n.top - (l - n.height) / 2;
      return new DOMRect(u, x, d, l);
    }
  };
}
function me(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const he = {
  // Gaps / padding / iconPx match Figma `896:3791` (icon = body textSize).
  large: {
    height: Z.large,
    paddingLeft: "1rem",
    // 16
    paddingRight: "1.125rem",
    // 18
    paddingBlock: "0.625rem",
    // 10
    gap: "0.625rem",
    // 10
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.25rem",
    // 20
    iconPx: "1.125rem",
    // 18
    checkbox: 22
  },
  medium: {
    height: Z.medium,
    paddingLeft: "0.75rem",
    // 12
    paddingRight: "0.875rem",
    // 14
    paddingBlock: "0.5rem",
    // 8
    gap: "0.5rem",
    // 8
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.125rem",
    // 18
    iconPx: "1rem",
    // 16
    checkbox: 20
  },
  small: {
    height: Z.small,
    paddingLeft: "0.625rem",
    // 10
    paddingRight: "0.75rem",
    // 12
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.375rem",
    // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1rem",
    // 16
    iconPx: "0.875rem",
    // 14
    checkbox: 18
  },
  extraSmall: {
    height: Z.extraSmall,
    paddingLeft: "0.5rem",
    // 8
    paddingRight: "0.625rem",
    // 10
    paddingBlock: "0.125rem",
    // 2
    gap: "0.25rem",
    // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "0.875rem",
    // 14
    iconPx: "0.75rem",
    // 12
    checkbox: 16
  }
}, Ke = {
  large: {
    height: 32,
    paddingLeft: "1rem",
    paddingRight: "1.125rem",
    // 18 — match menu item
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  medium: {
    height: 28,
    paddingLeft: "0.75rem",
    paddingRight: "0.875rem",
    // 14 — match menu item
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  },
  small: {
    height: 24,
    paddingLeft: "0.625rem",
    paddingRight: "0.75rem",
    // 12 — match menu item
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  },
  extraSmall: {
    height: 20,
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    // 10 — match menu item
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  }
};
function Ze(t, n, d, l) {
  return d ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : l || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function Xe({
  label: t,
  hugCandidates: n
}) {
  const d = /* @__PURE__ */ o(
    "span",
    {
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0
      },
      children: t
    }
  );
  return n != null && n.length ? /* @__PURE__ */ L(
    "span",
    {
      style: {
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0
      },
      children: [
        n.map((l, u) => /* @__PURE__ */ o(
          "span",
          {
            "aria-hidden": !0,
            style: {
              gridArea: "1 / 1",
              visibility: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            },
            children: l
          },
          u
        )),
        /* @__PURE__ */ o(
          "span",
          {
            style: {
              gridArea: "1 / 1",
              minWidth: 0,
              maxWidth: "100%",
              display: "block"
            },
            children: d
          }
        )
      ]
    }
  ) : d;
}
function Je({
  size: t,
  color: n,
  labelStyle: d,
  label: l,
  hugCandidates: u,
  startIconName: x,
  open: z,
  disabled: c,
  readOnly: p,
  error: $,
  required: v,
  onClick: y,
  buttonRef: w,
  id: D,
  listedBy: N,
  ariaLabel: M,
  triggerWidth: h
}) {
  const W = ze[t], f = $e[t], m = Ze(n, $, c, p), k = !!(u != null && u.length), Q = {
    "--dd-height": W.height,
    // Match Button / Figma Dropdown Button padding 16 / 14 / 12 / 8
    "--dd-px": f.paddingInline,
    "--dd-py": W.paddingBlock,
    "--dd-gap": f.gap,
    "--dd-font-size": W.fontSize,
    "--dd-line-height": W.lineHeight,
    "--dd-font-weight": String(d === "thin" ? 400 : 600),
    "--dd-border": m,
    "--dd-bg": p ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
    "--dd-fg": c ? "var(--text-disabled-neutral)" : p ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
    "--dd-cursor": c || p ? "default" : "pointer",
    "--dd-trigger-width": h
  };
  return /* @__PURE__ */ L(
    "button",
    {
      ref: w,
      type: "button",
      id: D,
      disabled: c || p,
      "aria-haspopup": N ? "listbox" : "menu",
      "aria-expanded": z,
      "aria-controls": N,
      "aria-required": v || void 0,
      "aria-label": M,
      onClick: y,
      "data-cads-dropdown-trigger": "input",
      ...k ? { "data-hug": "" } : {},
      className: s.trigger,
      style: Q,
      children: [
        /* @__PURE__ */ L("span", { className: s.triggerContent, children: [
          x ? /* @__PURE__ */ o(X, { name: x, fontSize: f.iconPx }) : null,
          /* @__PURE__ */ o(Xe, { label: l, hugCandidates: u })
        ] }),
        /* @__PURE__ */ o(X, { name: "chevron-down", fontSize: f.iconPx })
      ]
    }
  );
}
function Qe({
  option: t,
  size: n,
  selected: d,
  menuType: l,
  role: u,
  active: x,
  keyboardFocus: z,
  onSelect: c,
  onHighlight: p,
  id: $
}) {
  const v = he[n], y = !!t.destructive && u === "action", w = l === "checklist", D = !w && !!t.iconName, N = !!t.disabled && !w, M = w || D, f = {
    "--dd-item-bg": N ? d ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : d ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": N ? y ? "var(--text-disabled-error)" : d ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : y ? "var(--text-error-primary)" : d ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && w ? 0.5 : 1),
    "--dd-item-height": v.height
  };
  return /* @__PURE__ */ o(
    "div",
    {
      id: $,
      role: u === "input" ? "option" : "menuitem",
      "aria-selected": u === "input" ? d : void 0,
      "aria-disabled": t.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": t.value,
      "data-destructive": y ? "true" : void 0,
      "data-active": x ? "true" : void 0,
      "data-keyboard-focus": z ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (m) => {
        m.preventDefault();
      },
      onClick: (m) => {
        m.preventDefault(), !(m.metaKey || m.ctrlKey) && (m.stopPropagation(), t.disabled || c());
      },
      onMouseEnter: () => {
        t.disabled || p();
      },
      className: s.item,
      style: f,
      children: /* @__PURE__ */ L("span", { className: J(s.itemInner, M && s.itemInnerGap), children: [
        l === "checklist" ? /* @__PURE__ */ o(
          "span",
          {
            "aria-hidden": !0,
            className: J(
              s.checkbox,
              d && s.checkboxSelected
            ),
            children: d ? /* @__PURE__ */ o(
              X,
              {
                name: "check",
                fontSize: n === "large" ? "0.875rem" : n === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : D ? /* @__PURE__ */ o("span", { "aria-hidden": !0, className: s.iconSlot, children: /* @__PURE__ */ o(X, { name: t.iconName, fontSize: v.iconPx }) }) : null,
        /* @__PURE__ */ o("span", { className: s.itemLabel, children: t.label })
      ] })
    }
  );
}
function Ye() {
  return /* @__PURE__ */ o(
    "div",
    {
      role: "separator",
      "aria-hidden": !0,
      "data-cads-dropdown-separator": "",
      className: s.separator,
      children: /* @__PURE__ */ o("div", { className: s.separatorLine })
    }
  );
}
function Pe({ label: t }) {
  return /* @__PURE__ */ o(
    "div",
    {
      role: "presentation",
      "data-cads-dropdown-group": "",
      className: s.group,
      children: /* @__PURE__ */ o("span", { className: s.groupLabel, children: t })
    }
  );
}
const st = Re(
  function(n, d) {
    const {
      size: l = "medium",
      menuType: u = "default",
      menuPlacement: x = "bottomLeft",
      menuWidth: z = "hug",
      options: c,
      open: p,
      defaultOpen: $ = !1,
      onOpenChange: v,
      disabled: y = !1,
      disablePortal: w = !1,
      className: D,
      style: N,
      "aria-label": M
    } = n, h = n.role === "input", W = Ae(), f = `cads-dropdown-list-${W}`, m = `cads-dropdown-trigger-${W}`, [k, Q] = U(null), Y = Be(null), q = ue((e) => {
      e && (Y.current = e, Q((i) => i === e ? i : e));
    }, []), fe = V(
      () => k ? Ge(k) : null,
      [k]
    ), [ge, pe] = U($), g = p ?? ge, be = Ce(), {
      mounted: ye,
      exiting: xe,
      entering: ve
    } = Oe(g && !!k);
    Ee(() => {
      if (!g) return;
      const e = Y.current ?? document.getElementById(m);
      e && q(e);
    }, [g, m, q]);
    const [P, A] = U(-1), [we, B] = U(
      "pointer"
    ), R = ue(
      (e) => {
        p === void 0 && pe(e), v == null || v(e), e || (A(-1), B("pointer"));
      },
      [p, v]
    ), r = h ? n : null, S = h && (u === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [ke, Se] = U(
      () => me(r == null ? void 0 : r.defaultValue)
    ), E = (r == null ? void 0 : r.value) !== void 0 ? me(r.value) : ke, j = V(
      () => new Set(E),
      [E]
    ), H = V(() => c.filter(re), [c]), Ie = V(() => {
      if (!h) return n.label ?? "Button";
      const e = (r == null ? void 0 : r.placeholder) ?? "Dropdown";
      if (E.length === 0) return e;
      const i = H.filter((a) => j.has(a.value)).map((a) => a.label);
      return i.length === 0 ? e : i.length === 1 ? i[0] : `${i.length} selected`;
    }, [
      h,
      n,
      r == null ? void 0 : r.placeholder,
      E,
      H,
      j
    ]), Ne = V(() => {
      if (!h) return;
      const e = H.map((i) => i.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), S && e.push(`${H.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [h, r == null ? void 0 : r.placeholder, H, S]), F = (e) => {
      var i;
      r && (r.value === void 0 && Se(e), (i = r.onChange) == null || i.call(r, S ? e : e[0] ?? ""));
    }, ne = (e) => {
      var i;
      if (!e.disabled)
        if (h)
          if (S) {
            const a = j.has(e.value) ? E.filter((b) => b !== e.value) : [...E, e.value];
            F(a);
          } else
            F([e.value]), R(!1);
        else
          (i = n.onAction) == null || i.call(n, e.value), R(!1);
    }, We = () => {
      F(
        H.filter((e) => !e.disabled).map((e) => e.value)
      );
    }, Le = () => {
      F([]);
    }, ae = () => {
      y || h && (r != null && r.readOnly) || R(!g);
    };
    He(() => {
      g || (A(-1), B("pointer"));
    }, [g]);
    const G = (e) => {
      B("keyboard"), A(e);
    }, ie = (e) => {
      B("keyboard"), A((i) => {
        let b = i < 0 ? e === 1 ? -1 : 0 : i;
        for (let O = 0; O < c.length; O++)
          if (b = e === 1 ? (b + 1) % c.length : (b - 1 + c.length) % c.length, _(c[b])) return b;
        return i;
      });
    }, ee = (e) => {
      var i;
      if (!g) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
          if (e.preventDefault(), R(!0), e.key === "ArrowUp") {
            for (let a = c.length - 1; a >= 0; a--)
              if (_(c[a])) {
                G(a);
                break;
              }
          } else {
            const a = c.findIndex(_);
            a >= 0 && G(a);
          }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), R(!1), (i = Y.current) == null || i.focus();
        return;
      }
      if (e.key === "ArrowDown" && (e.preventDefault(), ie(1)), e.key === "ArrowUp" && (e.preventDefault(), ie(-1)), e.key === "Home") {
        e.preventDefault();
        const a = c.findIndex(_);
        a >= 0 && G(a);
      }
      if (e.key === "End") {
        e.preventDefault();
        for (let a = c.length - 1; a >= 0; a--)
          if (_(c[a])) {
            G(a);
            break;
          }
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const a = P >= 0 ? c[P] : void 0;
        a && re(a) && ne(a);
      }
    }, oe = h && ((r == null ? void 0 : r.menuType) ?? u) === "checklist" ? "checklist" : "default", T = S ? { width: "max-content", minWidth: "max-content" } : qe(z, (k == null ? void 0 : k.offsetWidth) ?? 0), de = typeof T.minWidth == "number" ? `${T.minWidth}px` : T.minWidth, le = typeof T.width == "number" ? `${T.width}px` : T.width, I = he[l], C = Ke[l], De = {
      "--dd-panel-width": le,
      "--dd-panel-min-width": de,
      "--dd-panel-py": S ? "0" : "4px",
      "--dd-list-py": S ? "4px" : "0",
      "--dd-item-pl": I.paddingLeft,
      "--dd-item-pr": I.paddingRight,
      "--dd-item-py": I.paddingBlock,
      "--dd-item-height": I.height,
      "--dd-item-gap": I.gap,
      "--dd-item-font-size": I.fontSize,
      "--dd-item-line-height": I.lineHeight,
      "--dd-item-icon-slot": I.iconSlot,
      "--dd-checkbox": `${I.checkbox}px`,
      "--dd-group-height": `${C.height}px`,
      "--dd-group-pl": C.paddingLeft,
      "--dd-group-pr": C.paddingRight,
      "--dd-group-font-size": C.fontSize,
      "--dd-group-line-height": C.lineHeight,
      "--dd-action-justify": l === "large" ? "space-between" : "flex-start",
      "--cads-surface-origin": Fe(x)
    }, ce = /* @__PURE__ */ o(
      Me,
      {
        open: ye,
        anchorEl: fe,
        placement: je(x),
        disablePortal: w,
        style: {
          zIndex: "var(--z-dropdown)",
          width: le,
          minWidth: de
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          ...w ? [
            { name: "flip", enabled: !1 },
            { name: "preventOverflow", enabled: !1 }
          ] : []
        ],
        children: /* @__PURE__ */ L(
          "div",
          {
            id: f,
            role: h ? "listbox" : "menu",
            "aria-labelledby": m,
            "aria-multiselectable": S || void 0,
            "data-cads-dropdown-menu": "",
            "data-cads-surface": "",
            ...Ve(be),
            ...Ue(ve, xe),
            "data-menu-type": oe,
            onKeyDown: ee,
            className: s.menuPanel,
            style: De,
            children: [
              /* @__PURE__ */ o(
                "div",
                {
                  className: s.optionsList,
                  onMouseLeave: () => {
                    A(-1), B("pointer");
                  },
                  children: c.map((e, i) => {
                    if (e.type === "separator")
                      return /* @__PURE__ */ o(Ye, {}, `${f}-sep-${i}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ o(
                        Pe,
                        {
                          label: e.label
                        },
                        `${f}-group-${i}`
                      );
                    const a = i === P;
                    return /* @__PURE__ */ o(
                      Qe,
                      {
                        id: `${f}-opt-${i}`,
                        option: e,
                        size: l,
                        selected: j.has(e.value),
                        menuType: oe,
                        role: n.role,
                        active: a,
                        keyboardFocus: a && we === "keyboard",
                        onSelect: () => ne(e),
                        onHighlight: () => {
                          B("pointer"), A(i);
                        }
                      },
                      e.value
                    );
                  })
                }
              ),
              S ? /* @__PURE__ */ L(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  className: s.actionRow,
                  children: [
                    /* @__PURE__ */ o(
                      te,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), We();
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ o(
                      te,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Le();
                        },
                        children: "Clear all"
                      }
                    )
                  ]
                }
              ) : null
            ]
          }
        )
      }
    );
    if (h) {
      const e = n, i = e.error ? "error" : e.sentiment ?? "default", a = e.width ?? "hug", b = _e(a), O = a === "hug";
      return /* @__PURE__ */ o(
        se,
        {
          onClickAway: () => {
            g && R(!1);
          },
          children: /* @__PURE__ */ L(
            "div",
            {
              ref: d,
              className: J(s.root, D),
              style: {
                width: b.rootWidth,
                maxWidth: b.maxWidth,
                ...N
              },
              "data-cads-dropdown": "input",
              "data-width": O ? "hug" : a === "full" ? "full" : "fixed",
              onKeyDown: ee,
              children: [
                /* @__PURE__ */ o(
                  Te,
                  {
                    size: l,
                    sentiment: i,
                    label: e.label,
                    required: e.required,
                    helperText: e.helperText,
                    helperIconName: e.helperIconName,
                    showHelper: e.showHelper,
                    htmlFor: m,
                    disabled: y,
                    children: /* @__PURE__ */ o(
                      Je,
                      {
                        size: l,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Ie,
                        hugCandidates: O ? Ne : void 0,
                        startIconName: e.startIconName,
                        open: g,
                        disabled: y,
                        readOnly: !!e.readOnly,
                        error: !!e.error || i === "error",
                        required: !!e.required,
                        onClick: ae,
                        buttonRef: q,
                        id: m,
                        listedBy: g ? f : void 0,
                        triggerWidth: b.triggerWidth,
                        ariaLabel: typeof M == "string" ? M : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                ce
              ]
            }
          )
        }
      );
    }
    const K = n;
    return /* @__PURE__ */ o(
      se,
      {
        onClickAway: () => {
          g && R(!1);
        },
        children: /* @__PURE__ */ L(
          "div",
          {
            ref: d,
            className: J(s.root, D),
            style: { display: "inline-flex", ...N },
            "data-cads-dropdown": "action",
            onKeyDown: ee,
            children: [
              /* @__PURE__ */ o(
                te,
                {
                  ref: q,
                  id: m,
                  size: l,
                  variant: K.buttonVariant ?? "contained",
                  color: K.buttonColor ?? "primary",
                  startIconName: K.startIconName,
                  endIconName: "chevron-down",
                  disabled: y,
                  "data-cads-dropdown-trigger": "action",
                  "aria-haspopup": "menu",
                  "aria-expanded": g,
                  "aria-controls": g ? f : void 0,
                  "aria-label": M,
                  onClick: ae,
                  children: K.label ?? "Button"
                }
              ),
              ce
            ]
          }
        )
      }
    );
  }
);
export {
  st as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
