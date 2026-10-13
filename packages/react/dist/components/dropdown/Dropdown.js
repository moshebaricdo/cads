import { jsx as i, jsxs as W } from "react/jsx-runtime";
import be from "@mui/material/ClickAwayListener";
import $e from "@mui/material/Popper";
import { forwardRef as Ue, useId as _e, useState as j, useRef as Ve, useCallback as ye, useMemo as G, useLayoutEffect as qe, useEffect as Fe, isValidElement as Ze, cloneElement as je } from "react";
import { Button as de } from "../button/Button.js";
import { FieldWrapper as Ge } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as te } from "../../icons/FaIcon.js";
import { CONTROL_HEIGHT as ee, TEXT_INPUT_SIZE as Ke, BUTTON_SIZE as Pe } from "../../shared/controlSize.js";
import { useExperimentalMotion as Xe, useSurfacePresence as Je, surfaceMotionStateAttrs as Qe, experimentalMotionHostAttrs as Ye } from "../../theme/experimentalMotion.js";
import s from "./dropdown.module.scss.js";
function P(...t) {
  return t.filter(Boolean).join(" ");
}
function ce(t) {
  return t.type !== "separator" && t.type !== "group";
}
function K(t) {
  return ce(t) && !t.disabled;
}
function et(t = "hug") {
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
function tt(t = "hug", n) {
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
function rt(t) {
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
function nt(t) {
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
function at(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), o = t.offsetWidth, d = t.offsetHeight, m = n.left - (o - n.width) / 2, x = n.top - (d - n.height) / 2;
      return new DOMRect(m, x, o, d);
    }
  };
}
function ve(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const we = {
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
}, xe = {
  large: "medium",
  medium: "small",
  small: "extraSmall",
  extraSmall: "extraSmall"
}, it = {
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
function ot(t, n, o, d) {
  return o ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : d || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function lt({
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
  return n != null && n.length ? /* @__PURE__ */ W(
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
function dt({
  size: t,
  color: n,
  labelStyle: o,
  label: d,
  hugCandidates: m,
  startIconName: x,
  open: U,
  disabled: D,
  readOnly: y,
  error: _,
  required: w,
  onClick: v,
  buttonRef: k,
  id: B,
  listedBy: R,
  ariaLabel: M,
  ariaHasPopup: g,
  triggerWidth: p
}) {
  const c = Ke[t], b = Pe[t], X = ot(n, _, D, y), S = !!(m != null && m.length), I = {
    "--dd-height": c.height,
    // Match Button / Figma Dropdown Button padding 16 / 14 / 12 / 8
    "--dd-px": b.paddingInline,
    "--dd-py": c.paddingBlock,
    "--dd-gap": b.gap,
    "--dd-font-size": c.fontSize,
    "--dd-line-height": c.lineHeight,
    "--dd-font-weight": String(o === "thin" ? 400 : 600),
    "--dd-border": X,
    "--dd-bg": y ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
    "--dd-fg": D ? "var(--text-disabled-neutral)" : y ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
    "--dd-cursor": D || y ? "default" : "pointer",
    "--dd-trigger-width": p
  };
  return /* @__PURE__ */ W(
    "button",
    {
      ref: k,
      type: "button",
      id: B,
      disabled: D || y,
      "aria-haspopup": g ?? (R ? "listbox" : "menu"),
      "aria-expanded": U,
      "aria-controls": R,
      "aria-required": w || void 0,
      "aria-label": M,
      onClick: v,
      "data-cads-dropdown-trigger": "input",
      ...S ? { "data-hug": "" } : {},
      className: s.trigger,
      style: I,
      children: [
        /* @__PURE__ */ W("span", { className: s.triggerContent, children: [
          x ? /* @__PURE__ */ i(te, { name: x, fontSize: b.iconPx }) : null,
          /* @__PURE__ */ i(lt, { label: d, hugCandidates: m })
        ] }),
        /* @__PURE__ */ i(te, { name: "chevron-down", fontSize: b.iconPx })
      ]
    }
  );
}
function ct({
  option: t,
  size: n,
  selected: o,
  menuType: d,
  role: m,
  active: x,
  keyboardFocus: U,
  onSelect: D,
  onHighlight: y,
  id: _
}) {
  const w = we[n], v = !!t.destructive && m === "action", k = d === "checklist", B = !k && !!t.iconName, R = !!t.disabled && !k, M = k || B, c = {
    "--dd-item-bg": R ? o ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : o ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": R ? v ? "var(--text-disabled-error)" : o ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : v ? "var(--text-error-primary)" : o ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && k ? 0.5 : 1),
    "--dd-item-height": w.height
  };
  return /* @__PURE__ */ i(
    "div",
    {
      id: _,
      role: m === "input" ? "option" : "menuitem",
      "aria-selected": m === "input" ? o : void 0,
      "aria-disabled": t.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": t.value,
      "data-destructive": v ? "true" : void 0,
      "data-active": x ? "true" : void 0,
      "data-keyboard-focus": U ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (b) => {
        b.preventDefault();
      },
      onClick: (b) => {
        b.preventDefault(), !(b.metaKey || b.ctrlKey) && (b.stopPropagation(), t.disabled || D());
      },
      onMouseEnter: () => {
        t.disabled || y();
      },
      className: s.item,
      style: c,
      children: /* @__PURE__ */ W("span", { className: P(s.itemInner, M && s.itemInnerGap), children: [
        d === "checklist" ? /* @__PURE__ */ i(
          "span",
          {
            "aria-hidden": !0,
            className: P(
              s.checkbox,
              o && s.checkboxSelected
            ),
            children: o ? /* @__PURE__ */ i(
              te,
              {
                name: "check",
                fontSize: n === "large" ? "0.875rem" : n === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : B ? /* @__PURE__ */ i("span", { "aria-hidden": !0, className: s.iconSlot, children: /* @__PURE__ */ i(te, { name: t.iconName, fontSize: w.iconPx }) }) : null,
        /* @__PURE__ */ i("span", { className: s.itemLabel, children: t.label })
      ] })
    }
  );
}
function st() {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "separator",
      "aria-hidden": !0,
      "data-cads-dropdown-separator": "",
      className: s.separator,
      children: /* @__PURE__ */ i("div", { className: s.separatorLine })
    }
  );
}
function ut({ label: t }) {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "presentation",
      "data-cads-dropdown-group": "",
      className: s.group,
      children: /* @__PURE__ */ i("span", { className: s.groupLabel, children: t })
    }
  );
}
const kt = Ue(
  function(n, o) {
    const {
      size: d = "medium",
      menuType: m = "default",
      menuPlacement: x = "bottomLeft",
      menuWidth: U = "hug",
      options: D,
      open: y,
      defaultOpen: _ = !1,
      onOpenChange: w,
      disabled: v = !1,
      disablePortal: k = !1,
      className: B,
      style: R,
      "aria-label": M
    } = n, g = n.role === "input", p = n.menuType === "custom", c = D ?? [], b = p ? n.customContent : void 0, X = _e(), S = `cads-dropdown-list-${X}`, I = `cads-dropdown-trigger-${X}`, [E, ke] = j(null), J = Ve(null), V = ye((e) => {
      e && (J.current = e, ke((a) => a === e ? a : e));
    }, []), Se = G(
      () => E ? at(E) : null,
      [E]
    ), [Ie, Ne] = j(_), h = y ?? Ie, Le = Xe(), {
      mounted: We,
      exiting: De,
      entering: Re
    } = Je(h && !!E);
    qe(() => {
      if (!h) return;
      const e = J.current ?? document.getElementById(I);
      e && V(e);
    }, [h, I, V]);
    const [re, T] = j(-1), [Me, H] = j(
      "pointer"
    ), A = ye(
      (e) => {
        y === void 0 && Ne(e), w == null || w(e), e || (T(-1), H("pointer"));
      },
      [y, w]
    ), r = g ? n : null, N = g && (m === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [Ae, Be] = j(
      () => ve(r == null ? void 0 : r.defaultValue)
    ), z = (r == null ? void 0 : r.value) !== void 0 ? ve(r.value) : Ae, q = G(
      () => new Set(z),
      [z]
    ), C = G(() => c.filter(ce), [c]), Ee = G(() => {
      if (!g) return n.label ?? "Button";
      const e = (r == null ? void 0 : r.placeholder) ?? "Dropdown";
      if (z.length === 0) return e;
      const a = C.filter((u) => q.has(u.value)).map((u) => u.label);
      return a.length === 0 ? e : a.length === 1 ? a[0] : `${a.length} selected`;
    }, [
      g,
      n,
      r == null ? void 0 : r.placeholder,
      z,
      C,
      q
    ]), Te = G(() => {
      if (!g) return;
      const e = C.map((a) => a.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), N && e.push(`${C.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [g, r == null ? void 0 : r.placeholder, C, N]), ne = (e) => {
      var a;
      r && (r.value === void 0 && Be(e), (a = r.onChange) == null || a.call(r, N ? e : e[0] ?? ""));
    }, se = (e) => {
      var a;
      if (!e.disabled)
        if (g)
          if (N) {
            const u = q.has(e.value) ? z.filter((f) => f !== e.value) : [...z, e.value];
            ne(u);
          } else
            ne([e.value]), A(!1);
        else
          (a = n.onAction) == null || a.call(n, e.value), A(!1);
    }, ae = C.filter((e) => !e.disabled).map((e) => e.value), Q = ae.length > 0 && ae.every((e) => q.has(e)), He = () => {
      ne(Q ? [] : ae);
    }, ze = () => {
      var e;
      A(!1), (e = J.current) == null || e.focus();
    }, ie = () => {
      v || g && (r != null && r.readOnly) || A(!h);
    };
    Fe(() => {
      h || (T(-1), H("pointer"));
    }, [h]);
    const Y = (e) => {
      H("keyboard"), T(e);
    }, ue = (e) => {
      H("keyboard"), T((a) => {
        let f = a < 0 ? e === 1 ? -1 : 0 : a;
        for (let l = 0; l < c.length; l++)
          if (f = e === 1 ? (f + 1) % c.length : (f - 1 + c.length) % c.length, K(c[f])) return f;
        return a;
      });
    }, oe = (e) => {
      var a, u, f;
      if (!h) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          if (e.preventDefault(), A(!0), p) return;
          if (e.key === "ArrowUp") {
            for (let l = c.length - 1; l >= 0; l--)
              if (K(c[l])) {
                Y(l);
                break;
              }
          } else {
            const l = c.findIndex(K);
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
        if (e.key === "ArrowDown" && (e.preventDefault(), ue(1)), e.key === "ArrowUp" && (e.preventDefault(), ue(-1)), e.key === "Home") {
          e.preventDefault();
          const l = c.findIndex(K);
          l >= 0 && Y(l);
        }
        if (e.key === "End") {
          e.preventDefault();
          for (let l = c.length - 1; l >= 0; l--)
            if (K(c[l])) {
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
          const l = re >= 0 ? c[re] : void 0;
          l && ce(l) && se(l);
        }
      }
    }, me = p ? "custom" : g && ((r == null ? void 0 : r.menuType) ?? m) === "checklist" ? "checklist" : "default", O = N ? { width: "max-content", minWidth: "max-content" } : tt(U, (E == null ? void 0 : E.offsetWidth) ?? 0), he = typeof O.minWidth == "number" ? `${O.minWidth}px` : O.minWidth, ge = typeof O.width == "number" ? `${O.width}px` : O.width, L = we[d], F = it[d], Ce = {
      "--dd-panel-width": ge,
      "--dd-panel-min-width": he,
      "--dd-panel-py": p || N ? "0" : "4px",
      "--dd-list-py": N ? "4px" : "0",
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
      "--cads-surface-origin": nt(x)
    }, fe = /* @__PURE__ */ i(
      $e,
      {
        open: We,
        anchorEl: Se,
        placement: rt(x),
        disablePortal: k,
        style: {
          zIndex: "var(--z-dropdown)",
          width: ge,
          minWidth: he
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          ...k ? [
            { name: "flip", enabled: !1 },
            { name: "preventOverflow", enabled: !1 }
          ] : []
        ],
        children: /* @__PURE__ */ W(
          "div",
          {
            id: S,
            role: p ? "dialog" : g ? "listbox" : "menu",
            "aria-labelledby": I,
            "aria-multiselectable": N || void 0,
            "data-cads-dropdown-menu": "",
            "data-cads-surface": "",
            ...Ye(Le),
            ...Qe(Re, De),
            "data-menu-type": me,
            onKeyDown: oe,
            className: P(s.menuPanel, p && s.menuPanelCustom),
            style: Ce,
            children: [
              p ? /* @__PURE__ */ i("div", { className: s.customSlot, children: b }) : /* @__PURE__ */ i(
                "div",
                {
                  className: s.optionsList,
                  onMouseLeave: () => {
                    T(-1), H("pointer");
                  },
                  children: c.map((e, a) => {
                    if (e.type === "separator")
                      return /* @__PURE__ */ i(st, {}, `${S}-sep-${a}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ i(
                        ut,
                        {
                          label: e.label
                        },
                        `${S}-group-${a}`
                      );
                    const u = a === re;
                    return /* @__PURE__ */ i(
                      ct,
                      {
                        id: `${S}-opt-${a}`,
                        option: e,
                        size: d,
                        selected: q.has(e.value),
                        menuType: me === "checklist" ? "checklist" : "default",
                        role: n.role,
                        active: u,
                        keyboardFocus: u && Me === "keyboard",
                        onSelect: () => se(e),
                        onHighlight: () => {
                          H("pointer"), T(a);
                        }
                      },
                      e.value
                    );
                  })
                }
              ),
              N ? /* @__PURE__ */ W(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  className: s.actionRow,
                  children: [
                    /* @__PURE__ */ i("div", { className: s.actionRowLeft, children: /* @__PURE__ */ i(
                      de,
                      {
                        variant: "text",
                        color: "secondary",
                        size: xe[d],
                        "data-cads-dropdown-toggle-all": Q ? "clear" : "select",
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), He();
                        },
                        children: /* @__PURE__ */ W("span", { className: s.toggleAllLabel, children: [
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
                        size: xe[d],
                        "data-cads-dropdown-done": "",
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), ze();
                        },
                        children: "Done"
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
      const e = n, a = e.error ? "error" : e.sentiment ?? "default", u = e.width ?? "hug", f = et(u), l = u === "hug";
      return /* @__PURE__ */ i(
        be,
        {
          onClickAway: () => {
            h && A(!1);
          },
          children: /* @__PURE__ */ W(
            "div",
            {
              ref: o,
              className: P(s.root, B),
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
                  Ge,
                  {
                    size: d,
                    sentiment: a,
                    label: e.label,
                    required: e.required,
                    helperText: e.helperText,
                    helperIconName: e.helperIconName,
                    showHelper: e.showHelper,
                    htmlFor: I,
                    disabled: v,
                    children: /* @__PURE__ */ i(
                      dt,
                      {
                        size: d,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Ee,
                        hugCandidates: l ? Te : void 0,
                        startIconName: e.startIconName,
                        open: h,
                        disabled: v,
                        readOnly: !!e.readOnly,
                        error: !!e.error || a === "error",
                        required: !!e.required,
                        onClick: ie,
                        buttonRef: V,
                        id: I,
                        listedBy: h ? S : void 0,
                        ariaHasPopup: p ? "dialog" : "listbox",
                        triggerWidth: f.triggerWidth,
                        ariaLabel: typeof M == "string" ? M : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                fe
              ]
            }
          )
        }
      );
    }
    const $ = n, le = !!$.iconOnly, Z = $.trigger, pe = p ? "dialog" : "menu", Oe = Z && Ze(Z) ? je(Z, {
      ref: V,
      id: I,
      disabled: v,
      "data-cads-dropdown-trigger": "action",
      "aria-haspopup": pe,
      "aria-expanded": h,
      "aria-controls": h ? S : void 0,
      "aria-label": M ?? Z.props["aria-label"],
      onClick: (e) => {
        var a, u;
        (u = (a = Z.props).onClick) == null || u.call(a, e), ie();
      }
    }) : /* @__PURE__ */ i(
      de,
      {
        ref: V,
        id: I,
        size: d,
        variant: $.buttonVariant ?? "contained",
        color: $.buttonColor ?? "primary",
        iconOnly: le,
        startIconName: $.startIconName,
        endIconName: le ? void 0 : "chevron-down",
        disabled: v,
        "data-cads-dropdown-trigger": "action",
        "aria-haspopup": pe,
        "aria-expanded": h,
        "aria-controls": h ? S : void 0,
        "aria-label": M,
        onClick: ie,
        children: le ? void 0 : $.label ?? "Button"
      }
    );
    return /* @__PURE__ */ i(
      be,
      {
        onClickAway: () => {
          h && A(!1);
        },
        children: /* @__PURE__ */ W(
          "div",
          {
            ref: o,
            className: P(s.root, B),
            style: { display: "inline-flex", ...R },
            "data-cads-dropdown": "action",
            onKeyDown: oe,
            children: [
              Oe,
              fe
            ]
          }
        )
      }
    );
  }
);
export {
  kt as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
