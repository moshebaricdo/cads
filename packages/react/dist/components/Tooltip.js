import { jsx, jsxs } from 'react/jsx-runtime';
import MuiTooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { FaIcon } from '../icons/FaIcon.js';

const CARET_TO_MUI_PLACEMENT = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
const ARROW_SIZE_PX = 14;
const ARROW_HEIGHT_PX = Math.round(ARROW_SIZE_PX * 0.71);
function Tooltip({
  children,
  title,
  caretPlacement = "top",
  hasCaret = true,
  startIcon = false,
  iconName = "face-smile",
  ...rest
}) {
  const muiPlacement = CARET_TO_MUI_PLACEMENT[caretPlacement];
  const offsetDistance = hasCaret ? 4 + ARROW_HEIGHT_PX : 6;
  const content = /* @__PURE__ */ jsxs(
    Box,
    {
      component: "span",
      sx: {
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "8px",
        maxWidth: 256,
        width: "max-content",
        textAlign: "left"
      },
      children: [
        startIcon ? /* @__PURE__ */ jsx(
          Box,
          {
            component: "span",
            "aria-hidden": true,
            sx: {
              // Match body/sm line-box and center the FA glyph (same approach as Alert).
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 14,
              height: "var(--leading-body-sm)",
              color: "var(--text-neutral-primary-inverse)",
              lineHeight: 0
            },
            children: /* @__PURE__ */ jsx(
              FaIcon,
              {
                name: iconName || "face-smile",
                fontSize: "14px",
                style: {
                  width: 14,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ jsx(
          Box,
          {
            component: "span",
            sx: {
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-sm)",
              fontWeight: 400,
              lineHeight: "var(--leading-body-sm)",
              color: "var(--text-neutral-primary-inverse)",
              textAlign: "left"
            },
            children: title
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsx(
    MuiTooltip,
    {
      title: content,
      arrow: hasCaret,
      placement: muiPlacement,
      slotProps: {
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, offsetDistance]
              }
            }
          ]
        },
        tooltip: {
          sx: {
            backgroundColor: "var(--background-neutral-primary-inverse)",
            color: "var(--text-neutral-primary-inverse)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-body-sm)",
            padding: "4px 12px",
            maxWidth: 256,
            width: "max-content",
            minWidth: 0,
            boxShadow: "var(--shadow-md)",
            // Kill MUI’s placement margins — gap is controlled via offset above.
            margin: "0 !important",
            textAlign: "left"
          }
        },
        arrow: {
          sx: {
            color: "var(--background-neutral-primary-inverse)",
            fontSize: ARROW_SIZE_PX,
            "&::before": {
              backgroundColor: "var(--background-neutral-primary-inverse)"
            }
          }
        }
      },
      ...rest,
      children
    }
  );
}

export { Tooltip };
//# sourceMappingURL=Tooltip.js.map
//# sourceMappingURL=Tooltip.js.map