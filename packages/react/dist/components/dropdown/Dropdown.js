import { jsx as o, jsxs as D } from "react/jsx-runtime";
import ce from "@mui/material/ClickAwayListener";
import Le from "@mui/material/Popper";
import { forwardRef as Me, useId as Re, useState as U, useRef as Ae, useCallback as se, useMemo as V, useLayoutEffect as Be, useEffect as Ee } from "react";
import { Button as ee } from "../button/Button.js";
import { FieldWrapper as He } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as G } from "../../icons/FaIcon.js";
import { TEXT_INPUT_SIZE as ze, BUTTON_SIZE as Te } from "../../shared/controlSize.js";
import { useExperimentalMotion as $e, useSurfacePresence as Ce, surfaceMotionStateAttrs as Oe, experimentalMotionHostAttrs as Ue } from "../../theme/experimentalMotion.js";
import s from "./dropdown.module.scss.js";
function X(...t) {
  return t.filter(Boolean).join(" ");
}
function te(t) {
  return t.type !== "separator" && t.type !== "group";
}
function _(t) {
  return te(t) && !t.disabled;
}
function Ve(t = "hug") {
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
function _e(t = "hug", n) {
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
function qe(t) {
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
function je(t) {
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
function Fe(t) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      const n = t.getBoundingClientRect(), d = t.offsetWidth, l = t.offsetHeight, u = n.left - (d - n.width) / 2, x = n.top - (l - n.height) / 2;
      return new DOMRect(u, x, d, l);
    }
  };
}
function ue(t) {
  return t == null ? [] : Array.isArray(t) ? t : [t];
}
const me = {
  large: {
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    paddingBlock: "0.625rem",
    gap: "0.75rem",
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.75rem",
    iconPx: "1.375rem",
    checkbox: 22
  },
  medium: {
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    paddingBlock: "0.5rem",
    gap: "0.75rem",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.5rem",
    iconPx: "1.1875rem",
    checkbox: 20
  },
  small: {
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    paddingBlock: "0.3125rem",
    gap: "0.5rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1.25rem",
    iconPx: "1rem",
    checkbox: 18
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    paddingBlock: "0.125rem",
    gap: "0.25rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "1rem",
    iconPx: "0.8125rem",
    checkbox: 16
  }
}, Ke = {
  large: {
    height: 32,
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  medium: {
    height: 28,
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  },
  small: {
    height: 24,
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  },
  extraSmall: {
    height: 20,
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  }
};
function Ze(t, n, d, l) {
  return d ? "var(--border-disabled-neutral)" : n ? "var(--border-error-primary)" : l || t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function Ge({
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
  return n != null && n.length ? /* @__PURE__ */ D(
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
function Xe({
  size: t,
  color: n,
  labelStyle: d,
  label: l,
  hugCandidates: u,
  startIconName: x,
  open: T,
  disabled: c,
  readOnly: p,
  error: $,
  required: I,
  onClick: y,
  buttonRef: v,
  id: L,
  listedBy: N,
  ariaLabel: M,
  triggerWidth: h
}) {
  const w = ze[t], g = Te[t], m = Ze(n, $, c, p), k = !!(u != null && u.length), J = {
    "--dd-height": w.height,
    "--dd-px": w.paddingInline,
    "--dd-py": w.paddingBlock,
    "--dd-gap": g.gap,
    "--dd-font-size": w.fontSize,
    "--dd-line-height": w.lineHeight,
    "--dd-font-weight": String(d === "thin" ? 400 : 600),
    "--dd-border": m,
    "--dd-bg": p ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
    "--dd-fg": c ? "var(--text-disabled-neutral)" : p ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
    "--dd-cursor": c || p ? "default" : "pointer",
    "--dd-trigger-width": h
  };
  return /* @__PURE__ */ D(
    "button",
    {
      ref: v,
      type: "button",
      id: L,
      disabled: c || p,
      "aria-haspopup": N ? "listbox" : "menu",
      "aria-expanded": T,
      "aria-controls": N,
      "aria-required": I || void 0,
      "aria-label": M,
      onClick: y,
      "data-cads-dropdown-trigger": "input",
      ...k ? { "data-hug": "" } : {},
      className: s.trigger,
      style: J,
      children: [
        /* @__PURE__ */ D("span", { className: s.triggerContent, children: [
          x ? /* @__PURE__ */ o(G, { name: x, fontSize: g.iconPx }) : null,
          /* @__PURE__ */ o(Ge, { label: l, hugCandidates: u })
        ] }),
        /* @__PURE__ */ o(G, { name: "chevron-down", fontSize: g.iconPx })
      ]
    }
  );
}
function Je({
  option: t,
  size: n,
  selected: d,
  menuType: l,
  role: u,
  active: x,
  keyboardFocus: T,
  onSelect: c,
  onHighlight: p,
  id: $
}) {
  const I = me[n], y = !!t.destructive && u === "action", v = l === "checklist", L = !v && !!t.iconName, N = !!t.disabled && !v, M = v || L, g = {
    "--dd-item-bg": N ? d ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)" : d ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--dd-item-fg": N ? y ? "var(--text-disabled-error)" : d ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)" : y ? "var(--text-error-primary)" : d ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--dd-item-cursor": t.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(t.disabled && v ? 0.5 : 1)
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
      "data-keyboard-focus": T ? "true" : void 0,
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
      style: g,
      children: /* @__PURE__ */ D("span", { className: X(s.itemInner, M && s.itemInnerGap), children: [
        l === "checklist" ? /* @__PURE__ */ o(
          "span",
          {
            "aria-hidden": !0,
            className: X(
              s.checkbox,
              d && s.checkboxSelected
            ),
            children: d ? /* @__PURE__ */ o(
              G,
              {
                name: "check",
                fontSize: n === "large" ? "0.875rem" : n === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : L ? /* @__PURE__ */ o("span", { "aria-hidden": !0, className: s.iconSlot, children: /* @__PURE__ */ o(G, { name: t.iconName, fontSize: I.iconPx }) }) : null,
        /* @__PURE__ */ o("span", { className: s.itemLabel, children: t.label })
      ] })
    }
  );
}
function Qe() {
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
function Ye({ label: t }) {
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
const ct = Me(
  function(n, d) {
    const {
      size: l = "medium",
      menuType: u = "default",
      menuPlacement: x = "bottomLeft",
      menuWidth: T = "hug",
      options: c,
      open: p,
      defaultOpen: $ = !1,
      onOpenChange: I,
      disabled: y = !1,
      disablePortal: v = !1,
      className: L,
      style: N,
      "aria-label": M
    } = n, h = n.role === "input", w = Re(), g = `cads-dropdown-list-${w}`, m = `cads-dropdown-trigger-${w}`, [k, J] = U(null), Q = Ae(null), q = se((e) => {
      e && (Q.current = e, J((i) => i === e ? i : e));
    }, []), he = V(
      () => k ? Fe(k) : null,
      [k]
    ), [fe, ge] = U($), f = p ?? fe, pe = $e(), {
      mounted: be,
      exiting: ye,
      entering: xe
    } = Ce(f && !!k);
    Be(() => {
      if (!f) return;
      const e = Q.current ?? document.getElementById(m);
      e && q(e);
    }, [f, m, q]);
    const [Y, A] = U(-1), [ve, B] = U(
      "pointer"
    ), R = se(
      (e) => {
        p === void 0 && ge(e), I == null || I(e), e || (A(-1), B("pointer"));
      },
      [p, I]
    ), r = h ? n : null, S = h && (u === "checklist" || (r == null ? void 0 : r.menuType) === "checklist"), [we, ke] = U(
      () => ue(r == null ? void 0 : r.defaultValue)
    ), E = (r == null ? void 0 : r.value) !== void 0 ? ue(r.value) : we, j = V(
      () => new Set(E),
      [E]
    ), H = V(() => c.filter(te), [c]), Se = V(() => {
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
    ]), Ie = V(() => {
      if (!h) return;
      const e = H.map((i) => i.label);
      return (r == null ? void 0 : r.placeholder) != null && r.placeholder !== "" && e.push(r.placeholder), S && e.push(`${H.length} selected`), e.length === 0 && e.push((r == null ? void 0 : r.placeholder) ?? "Dropdown"), e;
    }, [h, r == null ? void 0 : r.placeholder, H, S]), F = (e) => {
      var i;
      r && (r.value === void 0 && ke(e), (i = r.onChange) == null || i.call(r, S ? e : e[0] ?? ""));
    }, re = (e) => {
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
    }, Ne = () => {
      F(
        H.filter((e) => !e.disabled).map((e) => e.value)
      );
    }, We = () => {
      F([]);
    }, ne = () => {
      y || h && (r != null && r.readOnly) || R(!f);
    };
    Ee(() => {
      f || (A(-1), B("pointer"));
    }, [f]);
    const K = (e) => {
      B("keyboard"), A(e);
    }, ae = (e) => {
      B("keyboard"), A((i) => {
        let b = i < 0 ? e === 1 ? -1 : 0 : i;
        for (let O = 0; O < c.length; O++)
          if (b = e === 1 ? (b + 1) % c.length : (b - 1 + c.length) % c.length, _(c[b])) return b;
        return i;
      });
    }, P = (e) => {
      var i;
      if (!f) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
          if (e.preventDefault(), R(!0), e.key === "ArrowUp") {
            for (let a = c.length - 1; a >= 0; a--)
              if (_(c[a])) {
                K(a);
                break;
              }
          } else {
            const a = c.findIndex(_);
            a >= 0 && K(a);
          }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault(), R(!1), (i = Q.current) == null || i.focus();
        return;
      }
      if (e.key === "ArrowDown" && (e.preventDefault(), ae(1)), e.key === "ArrowUp" && (e.preventDefault(), ae(-1)), e.key === "Home") {
        e.preventDefault();
        const a = c.findIndex(_);
        a >= 0 && K(a);
      }
      if (e.key === "End") {
        e.preventDefault();
        for (let a = c.length - 1; a >= 0; a--)
          if (_(c[a])) {
            K(a);
            break;
          }
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const a = Y >= 0 ? c[Y] : void 0;
        a && te(a) && re(a);
      }
    }, ie = h && ((r == null ? void 0 : r.menuType) ?? u) === "checklist" ? "checklist" : "default", z = S ? { width: "max-content", minWidth: "max-content" } : _e(T, (k == null ? void 0 : k.offsetWidth) ?? 0), oe = typeof z.minWidth == "number" ? `${z.minWidth}px` : z.minWidth, de = typeof z.width == "number" ? `${z.width}px` : z.width, W = me[l], C = Ke[l], De = {
      "--dd-panel-width": de,
      "--dd-panel-min-width": oe,
      "--dd-panel-py": S ? "0" : "4px",
      "--dd-list-py": S ? "4px" : "0",
      "--dd-item-pl": W.paddingLeft,
      "--dd-item-pr": W.paddingRight,
      "--dd-item-py": W.paddingBlock,
      "--dd-item-gap": W.gap,
      "--dd-item-font-size": W.fontSize,
      "--dd-item-line-height": W.lineHeight,
      "--dd-item-icon-slot": W.iconSlot,
      "--dd-checkbox": `${W.checkbox}px`,
      "--dd-group-height": `${C.height}px`,
      "--dd-group-pl": C.paddingLeft,
      "--dd-group-pr": C.paddingRight,
      "--dd-group-font-size": C.fontSize,
      "--dd-group-line-height": C.lineHeight,
      "--dd-action-justify": l === "large" ? "space-between" : "flex-start",
      "--cads-surface-origin": je(x)
    }, le = /* @__PURE__ */ o(
      Le,
      {
        open: be,
        anchorEl: he,
        placement: qe(x),
        disablePortal: v,
        style: {
          zIndex: "var(--z-dropdown)",
          width: de,
          minWidth: oe
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } },
          ...v ? [
            { name: "flip", enabled: !1 },
            { name: "preventOverflow", enabled: !1 }
          ] : []
        ],
        children: /* @__PURE__ */ D(
          "div",
          {
            id: g,
            role: h ? "listbox" : "menu",
            "aria-labelledby": m,
            "aria-multiselectable": S || void 0,
            "data-cads-dropdown-menu": "",
            "data-cads-surface": "",
            ...Ue(pe),
            ...Oe(xe, ye),
            "data-menu-type": ie,
            onKeyDown: P,
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
                      return /* @__PURE__ */ o(Qe, {}, `${g}-sep-${i}`);
                    if (e.type === "group")
                      return /* @__PURE__ */ o(
                        Ye,
                        {
                          label: e.label
                        },
                        `${g}-group-${i}`
                      );
                    const a = i === Y;
                    return /* @__PURE__ */ o(
                      Je,
                      {
                        id: `${g}-opt-${i}`,
                        option: e,
                        size: l,
                        selected: j.has(e.value),
                        menuType: ie,
                        role: n.role,
                        active: a,
                        keyboardFocus: a && ve === "keyboard",
                        onSelect: () => re(e),
                        onHighlight: () => {
                          B("pointer"), A(i);
                        }
                      },
                      e.value
                    );
                  })
                }
              ),
              S ? /* @__PURE__ */ D(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  className: s.actionRow,
                  children: [
                    /* @__PURE__ */ o(
                      ee,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), Ne();
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ o(
                      ee,
                      {
                        variant: "text",
                        color: "secondary",
                        size: l,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation(), We();
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
      const e = n, i = e.error ? "error" : e.sentiment ?? "default", a = e.width ?? "hug", b = Ve(a), O = a === "hug";
      return /* @__PURE__ */ o(
        ce,
        {
          onClickAway: () => {
            f && R(!1);
          },
          children: /* @__PURE__ */ D(
            "div",
            {
              ref: d,
              className: X(s.root, L),
              style: {
                width: b.rootWidth,
                maxWidth: b.maxWidth,
                ...N
              },
              "data-cads-dropdown": "input",
              "data-width": O ? "hug" : a === "full" ? "full" : "fixed",
              onKeyDown: P,
              children: [
                /* @__PURE__ */ o(
                  He,
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
                      Xe,
                      {
                        size: l,
                        color: e.color ?? "primary",
                        labelStyle: e.labelStyle ?? "thick",
                        label: Se,
                        hugCandidates: O ? Ie : void 0,
                        startIconName: e.startIconName,
                        open: f,
                        disabled: y,
                        readOnly: !!e.readOnly,
                        error: !!e.error || i === "error",
                        required: !!e.required,
                        onClick: ne,
                        buttonRef: q,
                        id: m,
                        listedBy: f ? g : void 0,
                        triggerWidth: b.triggerWidth,
                        ariaLabel: typeof M == "string" ? M : typeof e.label == "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                le
              ]
            }
          )
        }
      );
    }
    const Z = n;
    return /* @__PURE__ */ o(
      ce,
      {
        onClickAway: () => {
          f && R(!1);
        },
        children: /* @__PURE__ */ D(
          "div",
          {
            ref: d,
            className: X(s.root, L),
            style: { display: "inline-flex", ...N },
            "data-cads-dropdown": "action",
            onKeyDown: P,
            children: [
              /* @__PURE__ */ o(
                ee,
                {
                  ref: q,
                  id: m,
                  size: l,
                  variant: Z.buttonVariant ?? "contained",
                  color: Z.buttonColor ?? "primary",
                  startIconName: Z.startIconName,
                  endIconName: "chevron-down",
                  disabled: y,
                  "data-cads-dropdown-trigger": "action",
                  "aria-haspopup": "menu",
                  "aria-expanded": f,
                  "aria-controls": f ? g : void 0,
                  "aria-label": M,
                  onClick: ne,
                  children: Z.label ?? "Button"
                }
              ),
              le
            ]
          }
        )
      }
    );
  }
);
export {
  ct as Dropdown
};
//# sourceMappingURL=Dropdown.js.map
