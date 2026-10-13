import { jsx as i, jsxs as x } from "react/jsx-runtime";
import ye from "@mui/material/ClickAwayListener";
import Ue from "@mui/material/Popper";
import { forwardRef as _e, useId as Ve, useState as j, useRef as qe, useCallback as ve, useMemo as G, useLayoutEffect as Fe, useEffect as Ze, isValidElement as je, cloneElement as Ge } from "react";
import { Button as de } from "../button/Button.js";
import { FieldWrapper as Ke } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as te } from "../../icons/FaIcon.js";
import { CONTROL_HEIGHT as ee, TEXT_INPUT_SIZE as Pe, BUTTON_SIZE as Xe } from "../../shared/controlSize.js";
import { useExperimentalMotion as Je, useSurfacePresence as Qe, surfaceMotionStateAttrs as Ye, experimentalMotionHostAttrs as et } from "../../theme/experimentalMotion.js";
import c from "./dropdown.module.scss.js";
function P(...t) {
  return t.filter(Boolean).join(" ");
}
function ce(t) {
  return t.type !== "separator" && t.type !== "group";
}
function K(t) {
  return ce(t) && !t.disabled;
}
function tt(t = "hug") {
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
function rt(t = "hug", n) {
  if (t === "trigger") {
    const o = Math.max(0, n);
    return { width: o, minWidth: o };
  }
  if (typeof t == "number")
    return { width: "max-content", minWidth: Math.max(t, n) };
  if (t.endsWith("%")) {
    const o = Number.parseFloat(t) / 100, d = Math.max(0, n * o);
    return { width: d, minWidth: d };
  }
  return {
    width: "max-content",
    minWidth: Math.max(0, n) || "max-content"
  };
}
function nt(t) {
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
function at(t) {
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
function it(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), o = t.offsetWidth, d = t.offsetHeight, m = n.left - (o - n.width) / 2, w = n.top - (d - n.height) / 2;
      return new DOMRect(m, w, o, d);
    }
  };
}
function xe(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const ke = {
  // Gaps / padding / iconPx match Figma `896:3791` (icon = body textSize).
  large: {
    height: ee.large,
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
    height: ee.medium,
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
    height: ee.small,
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
    height: ee.extraSmall,
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
}, we = {
  large: "medium",
  medium: "small",
  small: "extraSmall",
  extraSmall: "extraSmall"
}, ot = {
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
function lt(t, n, o, d) {
  return o ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : d || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function dt({
  label: t,
  hugCandidates: n
}) {
  const o = /* @__PURE__ */ i(
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
  return n != null && n.length ? /* @__PURE__ */ x(
    "span",
    {
      style: {
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0
      },
      children: [
        n.map((d, m) => /* @__PURE__ */ i(
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
          m
        )),
        /* @__PURE__ */ i(
          "span",
          {
            style: {
              gridArea: "1 / 1",
              minWidth: 0,
              maxWidth: "100%",
              display: "block"
            },
            children: o
          }
        )
      ]
    }
  ) : o;
}
function ct({
  size: t,
  color: n,
  labelStyle: o,
  label: d,
  hugCandidates: m,
  startIconName: w,
  open: _,
  disabled: W,
  readOnly: y,
  error: V,
  required: k,
  onClick: v,
  buttonRef: S,
  id: E,
  listedBy: R,
  ariaLabel: M,
  ariaHasPopup: g,
  triggerWidth: p
}) {
  const s = Pe[t], b = Xe[t], X = lt(n, V, W, y), I = !!(m != null && m.length), N = {
    "--dd-height": s.height,
    // Match Button / Figma Dropdown Button padding 16 / 14 / 12 / 8
    "--dd-px": b.paddingInline,
    "--dd-py": s.paddingBlock,
    "--dd-gap": b.gap,
    "--dd-font-size": s.fontSize,
    "--dd-line-height": s.lineHeight,
    "--dd-font-weight": String(o === "thin" ? 400 : 600),
    "--dd-border": X,
    "--dd-bg": y ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
    "--dd-fg": W ? "var(--text-disabled-neutral)" : y ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
    "--dd-cursor": W || y ? "default" : "pointer",
    "--dd-trigger-width": p
  };
  return /* @__PURE__ */ x(
    "button",
    {
      ref: S,
      type: "button",
      id: E,
      disabled: W || y,
      "aria-haspopup": g ?? (R ? "listbox" : "menu"),
      "aria-expanded": _,
      "aria-controls": R,
      "aria-required": k || void 0,
      "aria-label": M,
      onClick: v,
      "data-cads-dropdown-trigger": "input",
      ...I ? { "data-hug": "" } : {},
      className: c.trigger,
      style: N,
      children: [
        /* @__PURE__ */ x("span", { className: c.triggerContent, children: [
          w ? /* @__PURE__ */ i(te, { name: w, fontSize: b.iconPx }) : null,
          /* @__PURE__ */ i(dt, { label: d, hugCandidates: m })
        ] }),
        /* @__PURE__ */ i(te, { name: "chevron-down", fontSize: b.iconPx })
      ]
    }
  );
}
function st({
  option: t,
  size: n,
  selected: o,
  menuType: d,
  role: m,
  active: w,
  keyboardFocus: _,
  onSelect: W,
  onHighlight: y,
  id: V
}) {
  const k = ke[n], v = !!t.destructive && m === "action", S = d === "checklist", E = !S && !!t.iconName, R = !!t.disabled && !S, M = S || E, s = {
    "--dd-item-bg": R ? o ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : o ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": R ? v ? "var(--text-disabled-error)" : o ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : v ? "var(--text-error-primary)" : o ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && S ? 0.5 : 1),
    "--dd-item-height": k.height
  };
  return /* @__PURE__ */ i(
    "div",
    {
      id: V,
      role: m === "input" ? "option" : "menuitem",
      "aria-selected": m === "input" ? o : void 0,
      "aria-disabled": t.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": t.value,
      "data-destructive": v ? "true" : void 0,
      "data-active": w ? "true" : void 0,
      "data-keyboard-focus": _ ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (b) => {
        b.preventDefault();
      },
      onClick: (b) => {
        b.preventDefault(), !(b.metaKey || b.ctrlKey) && (b.stopPropagation(), t.disabled || W());
      },
      onMouseEnter: () => {
        t.disabled || y();
      },
      className: c.item,
      style: s,
      children: /* @__PURE__ */ x("span", { className: P(c.itemInner, M && c.itemInnerGap), children: [
        d === "checklist" ? /* @__PURE__ */ i(
          "span",
          {
            "aria-hidden": !0,
            className: P(
              c.checkbox,
              o && c.checkboxSelected
            ),
            children: o ? /* @__PURE__ */ i(
              te,
              {
                name: "check",
                fontSize: n === "large" ? "0.875rem" : n === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : E ? /* @__PURE__ */ i("span", { "aria-hidden": !0, className: c.iconSlot, children: /* @__PURE__ */ i(te, { name: t.iconName, fontSize: k.iconPx }) }) : null,
        /* @__PURE__ */ i("span", { className: c.itemLabel, children: t.label })
      ] })
    }
  );
}
function ut() {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "separator",
      "aria-hidden": !0,
      "data-cads-dropdown-separator": "",
      className: c.separator,
      children: /* @__PURE__ */ i("div", { className: c.separatorLine })
    }
  );
}
function mt({ label: t }) {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "presentation",
      "data-cads-dropdown-group": "",
      className: c.group,
      children: /* @__PURE__ */ i("span", { className: c.groupLabel, children: t })
    }
  );
}
const St = _e(
  function(n, o) {
    const {
      size: d = "medium",
      menuType: m = "default",
      menuPlacement: w = "bottomLeft",
      menuWidth: _ = "hug",
      options: W,
      open: y,
      defaultOpen: V = !1,
      onOpenChange: k,
      disabled: v = !1,
      disablePortal: S = !1,
      className: E,
      style: R,
      "aria-label": M
    } = n, g = n.role === "input", p = n.menuType === "custom", s = W ?? [], b = p ? n.customContent : void 0, X = Ve(), I = `cads-dropdown-list-${X}`, N = `cads-dropdown-trigger-${X}`, [T, Se] = j(null), J = qe(null), q = ve((e) => {
      e && (J.current = e, Se((a) => a === e ? a : e));
    }, []), Ie = G(
      () => T ? it(T) : null,
      [T]
    ), [Ne, De] = j(V), h = y ?? Ne, Le = Je(), {
      mounted: We,
      exiting: Re,
      entering: Me
    } = Qe(h && !!T);
    Fe(() => {
      if (!h) return;
      const e = J.current ?? document.getElementById(N);
      e && q(e);
    }, [h, N, q]);
    const [re, H] = j(-1), [Ae, C] = j(
      "pointer"
    ), A = ve(
      (e) => {
        y === void 0 && De(e), k == null || k(e), e || (H(-1), C("pointer"));
      },
      [y, k]
    ), r = g ? n : null, D = g && (m === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [Be, Ee] = j(
      () => xe(r == null ? void 0 : r.defaultValue)
    ), z = (r == null ? void 0 : r.value) !== void 0 ? xe(r.value) : Be, O = G(
      () => new Set(z),
      [z]
    ), B = G(() => s.filter(ce), [s]), Te = G(() => {
      if (!g) return n.label ?? "Button";
      const e = (r == null ? void 0 : r.placeholder) ?? "Dropdown";
      if (z.length === 0) return e;
      const a = B.filter((u) => O.has(u.value)).map((u) => u.label);
      return a.length === 0 ? e : a.length === 1 ? a[0] : `${a.length} selected`;
    }, [
      g,
      n,
      r == null ? void 0 : r.placeholder,
      z,
      B,
      O
    ]), He = G(() => {
      if (!g) return;
      const e = B.map((a) => a.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), D && e.push(`${B.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [g, r == null ? void 0 : r.placeholder, B, D]), ne = (e) => {
      var a;
      r && (r.value === void 0 && Ee(e), (a = r.onChange) == null || a.call(r, D ? e : e[0] ?? ""));
    }, se = (e) => {
      var a;
      if (!e.disabled)
        if (g)
          if (D) {
            const u = O.has(e.value) ? z.filter((f) => f !== e.value) : [...z, e.value];
            ne(u);
          } else
            ne([e.value]), A(!1);
        else
          (a = n.onAction) == null || a.call(n, e.value), A(!1);
    }, ae = B.filter((e) => !e.disabled).map((e) => e.value), Q = ae.length > 0 && ae.every((e) => O.has(e)), ue = B.filter(
      (e) => O.has(e.value)
    ).length, Ce = () => {
      ne(Q ? [] : ae);
    }, ze = () => {
      var e;
      A(!1), (e = J.current) == null || e.focus();
    }, ie = () => {
      v || g && (r != null && r.readOnly) || A(!h);
    };
    Ze(() => {
      h || (H(-1), C("pointer"));
    }, [h]);
    const Y = (e) => {
      C("keyboard"), H(e);
    }, me = (e) => {
      C("keyboard"), H((a) => {
        let f = a < 0 ? e === 1 ? -1 : 0 : a;
        for (let l = 0; l < s.length; l++)
          if (f = e === 1 ? (f + 1) % s.length : (f - 1 + s.length) % s.length, K(s[f])) return f;
        return a;
      });
    }, oe = (e) => {
      var a, u, f;
      if (!h) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          if (e.preventDefault(), A(!0), p) return;
          if (e.key === "ArrowUp") {
            for (let l = s.length - 1; l >= 0; l--)
              if (K(s[l])) {
                Y(l);
                break;
              }
          } else {
            const l = s.findIndex(K);
            l >= 0 && Y(l);
          }
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), A(!1), (a = J.current) == null || a.focus();
        return;
      }
      if (!p) {
        if (e.key === "ArrowDown" && (e.preventDefault(), me(1)), e.key === "ArrowUp" && (e.preventDefault(), me(-1)), e.key === "Home") {
          e.preventDefault();
          const l = s.findIndex(K);
          l >= 0 && Y(l);
        }
        if (e.key === "End") {
          e.preventDefault();
          for (let l = s.length - 1; l >= 0; l--)
            if (K(s[l])) {
              Y(l);
              break;
            }
        }
        if (e.key === "Enter" || e.key === " ") {
          if ((f = (u = e.target).closest) != null && f.call(
            u,
            "[data-cads-dropdown-action-row]"
          ))
            return;
          e.preventDefault();
          const l = re >= 0 ? s[re] : void 0;
          l && ce(l) && se(l);
        }
      }
    }, he = p ? "custom" : g && ((r == null ? void 0 : r.menuType) ?? m) === "checklist" ? "checklist" : "default", $ = D ? { width: "max-content", minWidth: "max-content" } : rt(_, (T == null ? void 0 : T.offsetWidth) ?? 0), ge = typeof $.minWidth == "number" ? `${$.minWidth}px` : $.minWidth, fe = typeof $.width == "number" ? `${$.width}px` : $.width, L = ke[d], F = ot[d], Oe = {
      "--dd-panel-width": fe,
      "--dd-panel-min-width": ge,
      "--dd-panel-py": p || D ? "0" : "4px",
      "--dd-list-py": D ? "4px" : "0",
      "--dd-item-pl": L.paddingLeft,
      "--dd-item-pr": L.paddingRight,
      "--dd-item-py": L.paddingBlock,
      "--dd-item-height": L.height,
      "--dd-item-gap": L.gap,
      "--dd-item-font-size": L.fontSize,
      "--dd-item-line-height": L.lineHeight,
      "--dd-item-icon-slot": L.iconSlot,
      "--dd-checkbox": `${L.checkbox}px`,
      "--dd-group-height": `${F.height}px`,
      "--dd-group-pl": F.paddingLeft,
      "--dd-group-pr": F.paddingRight,
      "--dd-group-font-size": F.fontSize,
      "--dd-group-line-height": F.lineHeight,
      "--cads-surface-origin": at(w)
    }, pe = /* @__PURE__ */ i(
      Ue,
      {
        open: We,
        anchorEl: Ie,
        placement: nt(w),
        disablePortal: S,
        style: {
          zIndex: "var(--z-dropdown)",
          width: fe,
          minWidth: ge
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          ...S ? [
            { name: "flip", enabled: !1 },
            { name: "preventOverflow", enabled: !1 }
          ] : []
        ],
        children: /* @__PURE__ */ x(
          "div",
          {
            id: I,
            role: p ? "dialog" : g ? "listbox" : "menu",
            "aria-labelledby": N,
            "aria-multiselectable": D || void 0,
            "data-cads-dropdown-menu": "",
            "data-cads-surface": "",
            ...et(Le),
            ...Ye(Me, Re),
            "data-menu-type": he,
            onKeyDown: oe,
            className: P(c.menuPanel, p && c.menuPanelCustom),
            style: Oe,
            children: [
              p ? /* @__PURE__ */ i("div", { className: c.customSlot, children: b }) : /* @__PURE__ */ i(
                "div",
                {
                  className: c.optionsList,
                  onMouseLeave: () => {
                    H(-1), C("pointer");
                  },
                  children: s.map((e, a) => {
                    if (e.type === "separator")
                      return /* @__PURE__ */ i(ut, {}, `${I}-sep-${a}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ i(
                        mt,
                        {
                          label: e.label
                        },
                        `${I}-group-${a}`
                      );
                    const u = a === re;
                    return /* @__PURE__ */ i(
                      st,
                      {
                        id: `${I}-opt-${a}`,
                        option: e,
                        size: d,
                        selected: O.has(e.value),
                        menuType: he === "checklist" ? "checklist" : "default",
                        role: n.role,
                        active: u,
                        keyboardFocus: u && Ae === "keyboard",
                        onSelect: () => se(e),
                        onHighlight: () => {
                          C("pointer"), H(a);
                        }
                      },
                      e.value
                    );
                  })
                }
              ),
              D ? /* @__PURE__ */ x(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  className: c.actionRow,
                  children: [
                    /* @__PURE__ */ i("div", { className: c.actionRowLeft, children: /* @__PURE__ */ i(
                      de,
                      {
                        variant: "text",
                        color: "secondary",
                        size: we[d],
                        "data-cads-dropdown-toggle-all": Q ? "clear" : "select",
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Ce();
                        },
                        children: /* @__PURE__ */ x("span", { className: c.toggleAllLabel, children: [
                          /* @__PURE__ */ i("span", { "aria-hidden": Q || void 0, children: "Select all" }),
                          /* @__PURE__ */ i("span", { "aria-hidden": !Q || void 0, children: "Clear all" })
                        ] })
                      }
                    ) }),
                    /* @__PURE__ */ i(
                      de,
                      {
                        variant: "contained",
                        color: "secondary",
                        size: we[d],
                        "data-cads-dropdown-done": "",
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), ze();
                        },
                        children: /* @__PURE__ */ x("span", { className: c.toggleAllLabel, children: [
                          /* @__PURE__ */ i("span", { "aria-hidden": !0, children: `Done (${B.length})` }),
                          /* @__PURE__ */ i("span", { children: ue > 0 ? `Done (${ue})` : "Done" })
                        ] })
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
    if (g) {
      const e = n, a = e.error ? "error" : e.sentiment ?? "default", u = e.width ?? "hug", f = tt(u), l = u === "hug";
      return /* @__PURE__ */ i(
        ye,
        {
          onClickAway: () => {
            h && A(!1);
          },
          children: /* @__PURE__ */ x(
            "div",
            {
              ref: o,
              className: P(c.root, E),
              style: {
                width: f.rootWidth,
                maxWidth: f.maxWidth,
                ...R
              },
              "data-cads-dropdown": "input",
              "data-width": l ? "hug" : u === "full" ? "full" : "fixed",
              onKeyDown: oe,
              children: [
                /* @__PURE__ */ i(
                  Ke,
                  {
                    size: d,
                    sentiment: a,
                    label: e.label,
                    required: e.required,
                    helperText: e.helperText,
                    helperIconName: e.helperIconName,
                    showHelper: e.showHelper,
                    htmlFor: N,
                    disabled: v,
                    children: /* @__PURE__ */ i(
                      ct,
                      {
                        size: d,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Te,
                        hugCandidates: l ? He : void 0,
                        startIconName: e.startIconName,
                        open: h,
                        disabled: v,
                        readOnly: !!e.readOnly,
                        error: !!e.error || a === "error",
                        required: !!e.required,
                        onClick: ie,
                        buttonRef: q,
                        id: N,
                        listedBy: h ? I : void 0,
                        ariaHasPopup: p ? "dialog" : "listbox",
                        triggerWidth: f.triggerWidth,
                        ariaLabel: typeof M == "string" ? M : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                pe
              ]
            }
          )
        }
      );
    }
    const U = n, le = !!U.iconOnly, Z = U.trigger, be = p ? "dialog" : "menu", $e = Z && je(Z) ? Ge(Z, {
      ref: q,
      id: N,
      disabled: v,
      "data-cads-dropdown-trigger": "action",
      "aria-haspopup": be,
      "aria-expanded": h,
      "aria-controls": h ? I : void 0,
      "aria-label": M ?? Z.props["aria-label"],
      onClick: (e) => {
        var a, u;
        (u = (a = Z.props).onClick) == null || u.call(a, e), ie();
      }
    }) : /* @__PURE__ */ i(
      de,
      {
        ref: q,
        id: N,
        size: d,
        variant: U.buttonVariant ?? "contained",
        color: U.buttonColor ?? "primary",
        iconOnly: le,
        startIconName: U.startIconName,
        endIconName: le ? void 0 : "chevron-down",
        disabled: v,
        "data-cads-dropdown-trigger": "action",
        "aria-haspopup": be,
        "aria-expanded": h,
        "aria-controls": h ? I : void 0,
        "aria-label": M,
        onClick: ie,
        children: le ? void 0 : U.label ?? "Button"
      }
    );
    return /* @__PURE__ */ i(
      ye,
      {
        onClickAway: () => {
          h && A(!1);
        },
        children: /* @__PURE__ */ x(
          "div",
          {
            ref: o,
            className: P(c.root, E),
            style: { display: "inline-flex", ...R },
            "data-cads-dropdown": "action",
            onKeyDown: oe,
            children: [
              $e,
              pe
            ]
          }
        )
      }
    );
  }
);
export {
  St as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
