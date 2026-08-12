import { jsx as o, jsxs as L } from "react/jsx-runtime";
import ue from "@mui/material/ClickAwayListener";
import Re from "@mui/material/Popper";
import { forwardRef as Be, useId as Ae, useState as V, useRef as Ee, useCallback as me, useMemo as _, useLayoutEffect as He, useEffect as Te } from "react";
import { Button as re } from "../button/Button.js";
import { FieldWrapper as ze } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as X } from "../../icons/FaIcon.js";
import { CONTROL_HEIGHT as Z, TEXT_INPUT_SIZE as Oe, BUTTON_SIZE as $e } from "../../shared/controlSize.js";
import { useExperimentalMotion as Ce, useSurfacePresence as Ue, surfaceMotionStateAttrs as Ve, experimentalMotionHostAttrs as _e } from "../../theme/experimentalMotion.js";
import s from "./dropdown.module.scss.js";
function J(...t) {
  return t.filter(Boolean).join(" ");
}
function ne(t) {
  return t.type !== "separator" && t.type !== "group";
}
function q(t) {
  return ne(t) && !t.disabled;
}
function qe(t = "hug") {
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
function je(t = "hug", n) {
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
function Fe(t) {
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
function Ge(t) {
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
function Ke(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), d = t.offsetWidth, l = t.offsetHeight, u = n.left - (d - n.width) / 2, v = n.top - (l - n.height) / 2;
      return new DOMRect(u, v, d, l);
    }
  };
}
function he(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const fe = {
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
}, Ze = {
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
function Xe(t, n, d, l) {
  return d ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : l || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function Je({
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
function Qe({
  size: t,
  color: n,
  labelStyle: d,
  label: l,
  hugCandidates: u,
  startIconName: v,
  open: z,
  disabled: c,
  readOnly: p,
  error: O,
  required: x,
  onClick: y,
  buttonRef: w,
  id: D,
  listedBy: N,
  ariaLabel: M,
  triggerWidth: h
}) {
  const W = Oe[t], f = $e[t], m = Xe(n, O, c, p), k = !!(u != null && u.length), Q = {
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
      "aria-required": x || void 0,
      "aria-label": M,
      onClick: y,
      "data-cads-dropdown-trigger": "input",
      ...k ? { "data-hug": "" } : {},
      className: s.trigger,
      style: Q,
      children: [
        /* @__PURE__ */ L("span", { className: s.triggerContent, children: [
          v ? /* @__PURE__ */ o(X, { name: v, fontSize: f.iconPx }) : null,
          /* @__PURE__ */ o(Je, { label: l, hugCandidates: u })
        ] }),
        /* @__PURE__ */ o(X, { name: "chevron-down", fontSize: f.iconPx })
      ]
    }
  );
}
function Ye({
  option: t,
  size: n,
  selected: d,
  menuType: l,
  role: u,
  active: v,
  keyboardFocus: z,
  onSelect: c,
  onHighlight: p,
  id: O
}) {
  const x = fe[n], y = !!t.destructive && u === "action", w = l === "checklist", D = !w && !!t.iconName, N = !!t.disabled && !w, M = w || D, f = {
    "--dd-item-bg": N ? d ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : d ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": N ? y ? "var(--text-disabled-error)" : d ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : y ? "var(--text-error-primary)" : d ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && w ? 0.5 : 1),
    "--dd-item-height": x.height
  };
  return /* @__PURE__ */ o(
    "div",
    {
      id: O,
      role: u === "input" ? "option" : "menuitem",
      "aria-selected": u === "input" ? d : void 0,
      "aria-disabled": t.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": t.value,
      "data-destructive": y ? "true" : void 0,
      "data-active": v ? "true" : void 0,
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
        ) : D ? /* @__PURE__ */ o("span", { "aria-hidden": !0, className: s.iconSlot, children: /* @__PURE__ */ o(X, { name: t.iconName, fontSize: x.iconPx }) }) : null,
        /* @__PURE__ */ o("span", { className: s.itemLabel, children: t.label })
      ] })
    }
  );
}
function Pe() {
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
function et({ label: t }) {
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
const ut = Be(
  function(n, d) {
    const {
      size: l = "medium",
      menuType: u = "default",
      menuPlacement: v = "bottomLeft",
      menuWidth: z = "hug",
      options: c,
      open: p,
      defaultOpen: O = !1,
      onOpenChange: x,
      disabled: y = !1,
      disablePortal: w = !1,
      className: D,
      style: N,
      "aria-label": M
    } = n, h = n.role === "input", W = Ae(), f = `cads-dropdown-list-${W}`, m = `cads-dropdown-trigger-${W}`, [k, Q] = V(null), Y = Ee(null), j = me((e) => {
      e && (Y.current = e, Q((i) => i === e ? i : e));
    }, []), ge = _(
      () => k ? Ke(k) : null,
      [k]
    ), [pe, be] = V(O), g = p ?? pe, ye = Ce(), {
      mounted: ve,
      exiting: xe,
      entering: we
    } = Ue(g && !!k);
    He(() => {
      if (!g) return;
      const e = Y.current ?? document.getElementById(m);
      e && j(e);
    }, [g, m, j]);
    const [P, B] = V(-1), [ke, A] = V(
      "pointer"
    ), R = me(
      (e) => {
        p === void 0 && be(e), x == null || x(e), e || (B(-1), A("pointer"));
      },
      [p, x]
    ), r = h ? n : null, S = h && (u === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [Se, Ie] = V(
      () => he(r == null ? void 0 : r.defaultValue)
    ), E = (r == null ? void 0 : r.value) !== void 0 ? he(r.value) : Se, F = _(
      () => new Set(E),
      [E]
    ), H = _(() => c.filter(ne), [c]), Ne = _(() => {
      if (!h) return n.label ?? "Button";
      const e = (r == null ? void 0 : r.placeholder) ?? "Dropdown";
      if (E.length === 0) return e;
      const i = H.filter((a) => F.has(a.value)).map((a) => a.label);
      return i.length === 0 ? e : i.length === 1 ? i[0] : `${i.length} selected`;
    }, [
      h,
      n,
      r == null ? void 0 : r.placeholder,
      E,
      H,
      F
    ]), We = _(() => {
      if (!h) return;
      const e = H.map((i) => i.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), S && e.push(`${H.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [h, r == null ? void 0 : r.placeholder, H, S]), G = (e) => {
      var i;
      r && (r.value === void 0 && Ie(e), (i = r.onChange) == null || i.call(r, S ? e : e[0] ?? ""));
    }, ae = (e) => {
      var i;
      if (!e.disabled)
        if (h)
          if (S) {
            const a = F.has(e.value) ? E.filter((b) => b !== e.value) : [...E, e.value];
            G(a);
          } else
            G([e.value]), R(!1);
        else
          (i = n.onAction) == null || i.call(n, e.value), R(!1);
    }, Le = () => {
      G(
        H.filter((e) => !e.disabled).map((e) => e.value)
      );
    }, De = () => {
      G([]);
    }, ie = () => {
      y || h && (r != null && r.readOnly) || R(!g);
    };
    Te(() => {
      g || (B(-1), A("pointer"));
    }, [g]);
    const K = (e) => {
      A("keyboard"), B(e);
    }, oe = (e) => {
      A("keyboard"), B((i) => {
        let b = i < 0 ? e === 1 ? -1 : 0 : i;
        for (let U = 0; U < c.length; U++)
          if (b = e === 1 ? (b + 1) % c.length : (b - 1 + c.length) % c.length, q(c[b])) return b;
        return i;
      });
    }, ee = (e) => {
      var i;
      if (!g) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
          if (e.preventDefault(), R(!0), e.key === "ArrowUp") {
            for (let a = c.length - 1; a >= 0; a--)
              if (q(c[a])) {
                K(a);
                break;
              }
          } else {
            const a = c.findIndex(q);
            a >= 0 && K(a);
          }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), R(!1), (i = Y.current) == null || i.focus();
        return;
      }
      if (e.key === "ArrowDown" && (e.preventDefault(), oe(1)), e.key === "ArrowUp" && (e.preventDefault(), oe(-1)), e.key === "Home") {
        e.preventDefault();
        const a = c.findIndex(q);
        a >= 0 && K(a);
      }
      if (e.key === "End") {
        e.preventDefault();
        for (let a = c.length - 1; a >= 0; a--)
          if (q(c[a])) {
            K(a);
            break;
          }
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const a = P >= 0 ? c[P] : void 0;
        a && ne(a) && ae(a);
      }
    }, de = h && ((r == null ? void 0 : r.menuType) ?? u) === "checklist" ? "checklist" : "default", T = S ? { width: "max-content", minWidth: "max-content" } : je(z, (k == null ? void 0 : k.offsetWidth) ?? 0), le = typeof T.minWidth == "number" ? `${T.minWidth}px` : T.minWidth, ce = typeof T.width == "number" ? `${T.width}px` : T.width, I = fe[l], $ = Ze[l], Me = {
      "--dd-panel-width": ce,
      "--dd-panel-min-width": le,
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
      "--dd-group-height": `${$.height}px`,
      "--dd-group-pl": $.paddingLeft,
      "--dd-group-pr": $.paddingRight,
      "--dd-group-font-size": $.fontSize,
      "--dd-group-line-height": $.lineHeight,
      "--dd-action-justify": l === "large" ? "space-between" : "flex-start",
      "--cads-surface-origin": Ge(v)
    }, se = /* @__PURE__ */ o(
      Re,
      {
        open: ve,
        anchorEl: ge,
        placement: Fe(v),
        disablePortal: w,
        style: {
          zIndex: "var(--z-dropdown)",
          width: ce,
          minWidth: le
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
            ..._e(ye),
            ...Ve(we, xe),
            "data-menu-type": de,
            onKeyDown: ee,
            className: s.menuPanel,
            style: Me,
            children: [
              /* @__PURE__ */ o(
                "div",
                {
                  className: s.optionsList,
                  onMouseLeave: () => {
                    B(-1), A("pointer");
                  },
                  children: c.map((e, i) => {
                    if (e.type === "separator")
                      return /* @__PURE__ */ o(Pe, {}, `${f}-sep-${i}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ o(
                        et,
                        {
                          label: e.label
                        },
                        `${f}-group-${i}`
                      );
                    const a = i === P;
                    return /* @__PURE__ */ o(
                      Ye,
                      {
                        id: `${f}-opt-${i}`,
                        option: e,
                        size: l,
                        selected: F.has(e.value),
                        menuType: de,
                        role: n.role,
                        active: a,
                        keyboardFocus: a && ke === "keyboard",
                        onSelect: () => ae(e),
                        onHighlight: () => {
                          A("pointer"), B(i);
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
                      re,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Le();
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ o(
                      re,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), De();
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
      const e = n, i = e.error ? "error" : e.sentiment ?? "default", a = e.width ?? "hug", b = qe(a), U = a === "hug";
      return /* @__PURE__ */ o(
        ue,
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
              "data-width": U ? "hug" : a === "full" ? "full" : "fixed",
              onKeyDown: ee,
              children: [
                /* @__PURE__ */ o(
                  ze,
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
                      Qe,
                      {
                        size: l,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Ne,
                        hugCandidates: U ? We : void 0,
                        startIconName: e.startIconName,
                        open: g,
                        disabled: y,
                        readOnly: !!e.readOnly,
                        error: !!e.error || i === "error",
                        required: !!e.required,
                        onClick: ie,
                        buttonRef: j,
                        id: m,
                        listedBy: g ? f : void 0,
                        triggerWidth: b.triggerWidth,
                        ariaLabel: typeof M == "string" ? M : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                se
              ]
            }
          )
        }
      );
    }
    const C = n, te = !!C.iconOnly;
    return /* @__PURE__ */ o(
      ue,
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
                re,
                {
                  ref: j,
                  id: m,
                  size: l,
                  variant: C.buttonVariant ?? "contained",
                  color: C.buttonColor ?? "primary",
                  iconOnly: te,
                  startIconName: C.startIconName,
                  endIconName: te ? void 0 : "chevron-down",
                  disabled: y,
                  "data-cads-dropdown-trigger": "action",
                  "aria-haspopup": "menu",
                  "aria-expanded": g,
                  "aria-controls": g ? f : void 0,
                  "aria-label": M,
                  onClick: ie,
                  children: te ? void 0 : C.label ?? "Button"
                }
              ),
              se
            ]
          }
        )
      }
    );
  }
);
export {
  ut as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
