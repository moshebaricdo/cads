import { jsx as o, jsxs as M } from "react/jsx-runtime";
import ge from "@mui/material/ClickAwayListener";
import Ce from "@mui/material/Popper";
import { forwardRef as ze, useId as Oe, useState as F, useRef as $e, useCallback as pe, useMemo as G, useLayoutEffect as Ue, useEffect as Ve, isValidElement as _e, cloneElement as qe } from "react";
import { Button as oe } from "../button/Button.js";
import { FieldWrapper as je } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as ee } from "../../icons/FaIcon.js";
import { CONTROL_HEIGHT as Y, TEXT_INPUT_SIZE as Fe, BUTTON_SIZE as Ge } from "../../shared/controlSize.js";
import { useExperimentalMotion as Ke, useSurfacePresence as Ze, surfaceMotionStateAttrs as Pe, experimentalMotionHostAttrs as Xe } from "../../theme/experimentalMotion.js";
import s from "./dropdown.module.scss.js";
function Z(...t) {
  return t.filter(Boolean).join(" ");
}
function le(t) {
  return t.type !== "separator" && t.type !== "group";
}
function K(t) {
  return le(t) && !t.disabled;
}
function Je(t = "hug") {
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
function Qe(t = "hug", n) {
  if (t === "trigger") {
    const l = Math.max(0, n);
    return { width: l, minWidth: l };
  }
  if (typeof t == "number")
    return { width: "max-content", minWidth: Math.max(t, n) };
  if (t.endsWith("%")) {
    const l = Number.parseFloat(t) / 100, d = Math.max(0, n * l);
    return { width: d, minWidth: d };
  }
  return {
    width: "max-content",
    minWidth: Math.max(0, n) || "max-content"
  };
}
function Ye(t) {
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
function et(t) {
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
function tt(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), l = t.offsetWidth, d = t.offsetHeight, u = n.left - (l - n.width) / 2, v = n.top - (d - n.height) / 2;
      return new DOMRect(u, v, l, d);
    }
  };
}
function be(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const ye = {
  // Gaps / padding / iconPx match Figma `896:3791` (icon = body textSize).
  large: {
    height: Y.large,
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
    height: Y.medium,
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
    height: Y.small,
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
    height: Y.extraSmall,
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
}, rt = {
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
function nt(t, n, l, d) {
  return l ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : d || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function at({
  label: t,
  hugCandidates: n
}) {
  const l = /* @__PURE__ */ o(
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
  return n != null && n.length ? /* @__PURE__ */ M(
    "span",
    {
      style: {
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0
      },
      children: [
        n.map((d, u) => /* @__PURE__ */ o(
          "span",
          {
            "aria-hidden": !0,
            style: {
              gridArea: "1 / 1",
              visibility: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            },
            children: d
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
            children: l
          }
        )
      ]
    }
  ) : l;
}
function it({
  size: t,
  color: n,
  labelStyle: l,
  label: d,
  hugCandidates: u,
  startIconName: v,
  open: $,
  disabled: W,
  readOnly: p,
  error: U,
  required: x,
  onClick: b,
  buttonRef: w,
  id: R,
  listedBy: L,
  ariaLabel: D,
  ariaHasPopup: h,
  triggerWidth: f
}) {
  const c = Fe[t], g = Ge[t], P = nt(n, U, W, p), k = !!(u != null && u.length), S = {
    "--dd-height": c.height,
    // Match Button / Figma Dropdown Button padding 16 / 14 / 12 / 8
    "--dd-px": g.paddingInline,
    "--dd-py": c.paddingBlock,
    "--dd-gap": g.gap,
    "--dd-font-size": c.fontSize,
    "--dd-line-height": c.lineHeight,
    "--dd-font-weight": String(l === "thin" ? 400 : 600),
    "--dd-border": P,
    "--dd-bg": p ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
    "--dd-fg": W ? "var(--text-disabled-neutral)" : p ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
    "--dd-cursor": W || p ? "default" : "pointer",
    "--dd-trigger-width": f
  };
  return /* @__PURE__ */ M(
    "button",
    {
      ref: w,
      type: "button",
      id: R,
      disabled: W || p,
      "aria-haspopup": h ?? (L ? "listbox" : "menu"),
      "aria-expanded": $,
      "aria-controls": L,
      "aria-required": x || void 0,
      "aria-label": D,
      onClick: b,
      "data-cads-dropdown-trigger": "input",
      ...k ? { "data-hug": "" } : {},
      className: s.trigger,
      style: S,
      children: [
        /* @__PURE__ */ M("span", { className: s.triggerContent, children: [
          v ? /* @__PURE__ */ o(ee, { name: v, fontSize: g.iconPx }) : null,
          /* @__PURE__ */ o(at, { label: d, hugCandidates: u })
        ] }),
        /* @__PURE__ */ o(ee, { name: "chevron-down", fontSize: g.iconPx })
      ]
    }
  );
}
function ot({
  option: t,
  size: n,
  selected: l,
  menuType: d,
  role: u,
  active: v,
  keyboardFocus: $,
  onSelect: W,
  onHighlight: p,
  id: U
}) {
  const x = ye[n], b = !!t.destructive && u === "action", w = d === "checklist", R = !w && !!t.iconName, L = !!t.disabled && !w, D = w || R, c = {
    "--dd-item-bg": L ? l ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : l ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": L ? b ? "var(--text-disabled-error)" : l ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : b ? "var(--text-error-primary)" : l ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && w ? 0.5 : 1),
    "--dd-item-height": x.height
  };
  return /* @__PURE__ */ o(
    "div",
    {
      id: U,
      role: u === "input" ? "option" : "menuitem",
      "aria-selected": u === "input" ? l : void 0,
      "aria-disabled": t.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": t.value,
      "data-destructive": b ? "true" : void 0,
      "data-active": v ? "true" : void 0,
      "data-keyboard-focus": $ ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (g) => {
        g.preventDefault();
      },
      onClick: (g) => {
        g.preventDefault(), !(g.metaKey || g.ctrlKey) && (g.stopPropagation(), t.disabled || W());
      },
      onMouseEnter: () => {
        t.disabled || p();
      },
      className: s.item,
      style: c,
      children: /* @__PURE__ */ M("span", { className: Z(s.itemInner, D && s.itemInnerGap), children: [
        d === "checklist" ? /* @__PURE__ */ o(
          "span",
          {
            "aria-hidden": !0,
            className: Z(
              s.checkbox,
              l && s.checkboxSelected
            ),
            children: l ? /* @__PURE__ */ o(
              ee,
              {
                name: "check",
                fontSize: n === "large" ? "0.875rem" : n === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : R ? /* @__PURE__ */ o("span", { "aria-hidden": !0, className: s.iconSlot, children: /* @__PURE__ */ o(ee, { name: t.iconName, fontSize: x.iconPx }) }) : null,
        /* @__PURE__ */ o("span", { className: s.itemLabel, children: t.label })
      ] })
    }
  );
}
function lt() {
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
function dt({ label: t }) {
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
const vt = ze(
  function(n, l) {
    const {
      size: d = "medium",
      menuType: u = "default",
      menuPlacement: v = "bottomLeft",
      menuWidth: $ = "hug",
      options: W,
      open: p,
      defaultOpen: U = !1,
      onOpenChange: x,
      disabled: b = !1,
      disablePortal: w = !1,
      className: R,
      style: L,
      "aria-label": D
    } = n, h = n.role === "input", f = n.menuType === "custom", c = W ?? [], g = f ? n.customContent : void 0, P = Oe(), k = `cads-dropdown-list-${P}`, S = `cads-dropdown-trigger-${P}`, [A, ve] = F(null), te = $e(null), V = pe((e) => {
      e && (te.current = e, ve((i) => i === e ? i : e));
    }, []), xe = G(
      () => A ? tt(A) : null,
      [A]
    ), [we, ke] = F(U), m = p ?? we, Se = Ke(), {
      mounted: Ie,
      exiting: Ne,
      entering: We
    } = Ze(m && !!A);
    Ue(() => {
      if (!m) return;
      const e = te.current ?? document.getElementById(S);
      e && V(e);
    }, [m, S, V]);
    const [re, E] = F(-1), [Le, H] = F(
      "pointer"
    ), B = pe(
      (e) => {
        p === void 0 && ke(e), x == null || x(e), e || (E(-1), H("pointer"));
      },
      [p, x]
    ), r = h ? n : null, I = h && (u === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [De, Me] = F(
      () => be(r == null ? void 0 : r.defaultValue)
    ), T = (r == null ? void 0 : r.value) !== void 0 ? be(r.value) : De, X = G(
      () => new Set(T),
      [T]
    ), C = G(() => c.filter(le), [c]), Re = G(() => {
      if (!h) return n.label ?? "Button";
      const e = (r == null ? void 0 : r.placeholder) ?? "Dropdown";
      if (T.length === 0) return e;
      const i = C.filter((a) => X.has(a.value)).map((a) => a.label);
      return i.length === 0 ? e : i.length === 1 ? i[0] : `${i.length} selected`;
    }, [
      h,
      n,
      r == null ? void 0 : r.placeholder,
      T,
      C,
      X
    ]), Ae = G(() => {
      if (!h) return;
      const e = C.map((i) => i.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), I && e.push(`${C.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [h, r == null ? void 0 : r.placeholder, C, I]), J = (e) => {
      var i;
      r && (r.value === void 0 && Me(e), (i = r.onChange) == null || i.call(r, I ? e : e[0] ?? ""));
    }, de = (e) => {
      var i;
      if (!e.disabled)
        if (h)
          if (I) {
            const a = X.has(e.value) ? T.filter((y) => y !== e.value) : [...T, e.value];
            J(a);
          } else
            J([e.value]), B(!1);
        else
          (i = n.onAction) == null || i.call(n, e.value), B(!1);
    }, Be = () => {
      J(
        C.filter((e) => !e.disabled).map((e) => e.value)
      );
    }, Ee = () => {
      J([]);
    }, ne = () => {
      b || h && (r != null && r.readOnly) || B(!m);
    };
    Ve(() => {
      m || (E(-1), H("pointer"));
    }, [m]);
    const Q = (e) => {
      H("keyboard"), E(e);
    }, ce = (e) => {
      H("keyboard"), E((i) => {
        let y = i < 0 ? e === 1 ? -1 : 0 : i;
        for (let j = 0; j < c.length; j++)
          if (y = e === 1 ? (y + 1) % c.length : (y - 1 + c.length) % c.length, K(c[y])) return y;
        return i;
      });
    }, ae = (e) => {
      var i;
      if (!m) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          if (e.preventDefault(), B(!0), f) return;
          if (e.key === "ArrowUp") {
            for (let a = c.length - 1; a >= 0; a--)
              if (K(c[a])) {
                Q(a);
                break;
              }
          } else {
            const a = c.findIndex(K);
            a >= 0 && Q(a);
          }
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), B(!1), (i = te.current) == null || i.focus();
        return;
      }
      if (!f) {
        if (e.key === "ArrowDown" && (e.preventDefault(), ce(1)), e.key === "ArrowUp" && (e.preventDefault(), ce(-1)), e.key === "Home") {
          e.preventDefault();
          const a = c.findIndex(K);
          a >= 0 && Q(a);
        }
        if (e.key === "End") {
          e.preventDefault();
          for (let a = c.length - 1; a >= 0; a--)
            if (K(c[a])) {
              Q(a);
              break;
            }
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const a = re >= 0 ? c[re] : void 0;
          a && le(a) && de(a);
        }
      }
    }, se = f ? "custom" : h && ((r == null ? void 0 : r.menuType) ?? u) === "checklist" ? "checklist" : "default", z = I ? { width: "max-content", minWidth: "max-content" } : Qe($, (A == null ? void 0 : A.offsetWidth) ?? 0), ue = typeof z.minWidth == "number" ? `${z.minWidth}px` : z.minWidth, me = typeof z.width == "number" ? `${z.width}px` : z.width, N = ye[d], _ = rt[d], He = {
      "--dd-panel-width": me,
      "--dd-panel-min-width": ue,
      "--dd-panel-py": f || I ? "0" : "4px",
      "--dd-list-py": I ? "4px" : "0",
      "--dd-item-pl": N.paddingLeft,
      "--dd-item-pr": N.paddingRight,
      "--dd-item-py": N.paddingBlock,
      "--dd-item-height": N.height,
      "--dd-item-gap": N.gap,
      "--dd-item-font-size": N.fontSize,
      "--dd-item-line-height": N.lineHeight,
      "--dd-item-icon-slot": N.iconSlot,
      "--dd-checkbox": `${N.checkbox}px`,
      "--dd-group-height": `${_.height}px`,
      "--dd-group-pl": _.paddingLeft,
      "--dd-group-pr": _.paddingRight,
      "--dd-group-font-size": _.fontSize,
      "--dd-group-line-height": _.lineHeight,
      "--dd-action-justify": d === "large" ? "space-between" : "flex-start",
      "--cads-surface-origin": et(v)
    }, he = /* @__PURE__ */ o(
      Ce,
      {
        open: Ie,
        anchorEl: xe,
        placement: Ye(v),
        disablePortal: w,
        style: {
          zIndex: "var(--z-dropdown)",
          width: me,
          minWidth: ue
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          ...w ? [
            { name: "flip", enabled: !1 },
            { name: "preventOverflow", enabled: !1 }
          ] : []
        ],
        children: /* @__PURE__ */ M(
          "div",
          {
            id: k,
            role: f ? "dialog" : h ? "listbox" : "menu",
            "aria-labelledby": S,
            "aria-multiselectable": I || void 0,
            "data-cads-dropdown-menu": "",
            "data-cads-surface": "",
            ...Xe(Se),
            ...Pe(We, Ne),
            "data-menu-type": se,
            onKeyDown: ae,
            className: Z(s.menuPanel, f && s.menuPanelCustom),
            style: He,
            children: [
              f ? /* @__PURE__ */ o("div", { className: s.customSlot, children: g }) : /* @__PURE__ */ o(
                "div",
                {
                  className: s.optionsList,
                  onMouseLeave: () => {
                    E(-1), H("pointer");
                  },
                  children: c.map((e, i) => {
                    if (e.type === "separator")
                      return /* @__PURE__ */ o(lt, {}, `${k}-sep-${i}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ o(
                        dt,
                        {
                          label: e.label
                        },
                        `${k}-group-${i}`
                      );
                    const a = i === re;
                    return /* @__PURE__ */ o(
                      ot,
                      {
                        id: `${k}-opt-${i}`,
                        option: e,
                        size: d,
                        selected: X.has(e.value),
                        menuType: se === "checklist" ? "checklist" : "default",
                        role: n.role,
                        active: a,
                        keyboardFocus: a && Le === "keyboard",
                        onSelect: () => de(e),
                        onHighlight: () => {
                          H("pointer"), E(i);
                        }
                      },
                      e.value
                    );
                  })
                }
              ),
              I ? /* @__PURE__ */ M(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  className: s.actionRow,
                  children: [
                    /* @__PURE__ */ o(
                      oe,
                      {
                        variant: "text",
                        color: "secondary",
                        size: d,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Be();
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ o(
                      oe,
                      {
                        variant: "text",
                        color: "secondary",
                        size: d,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Ee();
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
      const e = n, i = e.error ? "error" : e.sentiment ?? "default", a = e.width ?? "hug", y = Je(a), j = a === "hug";
      return /* @__PURE__ */ o(
        ge,
        {
          onClickAway: () => {
            m && B(!1);
          },
          children: /* @__PURE__ */ M(
            "div",
            {
              ref: l,
              className: Z(s.root, R),
              style: {
                width: y.rootWidth,
                maxWidth: y.maxWidth,
                ...L
              },
              "data-cads-dropdown": "input",
              "data-width": j ? "hug" : a === "full" ? "full" : "fixed",
              onKeyDown: ae,
              children: [
                /* @__PURE__ */ o(
                  je,
                  {
                    size: d,
                    sentiment: i,
                    label: e.label,
                    required: e.required,
                    helperText: e.helperText,
                    helperIconName: e.helperIconName,
                    showHelper: e.showHelper,
                    htmlFor: S,
                    disabled: b,
                    children: /* @__PURE__ */ o(
                      it,
                      {
                        size: d,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Re,
                        hugCandidates: j ? Ae : void 0,
                        startIconName: e.startIconName,
                        open: m,
                        disabled: b,
                        readOnly: !!e.readOnly,
                        error: !!e.error || i === "error",
                        required: !!e.required,
                        onClick: ne,
                        buttonRef: V,
                        id: S,
                        listedBy: m ? k : void 0,
                        ariaHasPopup: f ? "dialog" : "listbox",
                        triggerWidth: y.triggerWidth,
                        ariaLabel: typeof D == "string" ? D : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                he
              ]
            }
          )
        }
      );
    }
    const O = n, ie = !!O.iconOnly, q = O.trigger, fe = f ? "dialog" : "menu", Te = q && _e(q) ? qe(q, {
      ref: V,
      id: S,
      disabled: b,
      "data-cads-dropdown-trigger": "action",
      "aria-haspopup": fe,
      "aria-expanded": m,
      "aria-controls": m ? k : void 0,
      "aria-label": D ?? q.props["aria-label"],
      onClick: (e) => {
        var i, a;
        (a = (i = q.props).onClick) == null || a.call(i, e), ne();
      }
    }) : /* @__PURE__ */ o(
      oe,
      {
        ref: V,
        id: S,
        size: d,
        variant: O.buttonVariant ?? "contained",
        color: O.buttonColor ?? "primary",
        iconOnly: ie,
        startIconName: O.startIconName,
        endIconName: ie ? void 0 : "chevron-down",
        disabled: b,
        "data-cads-dropdown-trigger": "action",
        "aria-haspopup": fe,
        "aria-expanded": m,
        "aria-controls": m ? k : void 0,
        "aria-label": D,
        onClick: ne,
        children: ie ? void 0 : O.label ?? "Button"
      }
    );
    return /* @__PURE__ */ o(
      ge,
      {
        onClickAway: () => {
          m && B(!1);
        },
        children: /* @__PURE__ */ M(
          "div",
          {
            ref: l,
            className: Z(s.root, R),
            style: { display: "inline-flex", ...L },
            "data-cads-dropdown": "action",
            onKeyDown: ae,
            children: [
              Te,
              he
            ]
          }
        )
      }
    );
  }
);
export {
  vt as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
