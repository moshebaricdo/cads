import { jsxs as t, jsx as a, Fragment as g } from "react/jsx-runtime";
import { forwardRef as v } from "react";
import { FaIcon as m } from "../../icons/FaIcon.js";
import { ChatFileRemoveButton as x } from "../chat-file-remove-button/ChatFileRemoveButton.js";
import e from "./aiChatFileChip.module.scss.js";
const w = v(
  function({
    type: i = "file",
    useCase: o = "chatStream",
    fileName: s = "filename.ext",
    metadata: c = "12:56PM",
    imageSrc: n,
    imageAlt: d = "Attachment",
    iconName: h = "file-code",
    onRemove: p,
    className: f,
    ...u
  }, C) {
    const N = o === "inputField", l = i === "image", r = i === "codeSnippet", F = [
      e.root,
      r ? e.rootCode : "",
      l ? e.rootImage : "",
      f ?? ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ t(
      "div",
      {
        ref: C,
        "data-cads-component": "AiChatFileChip",
        "data-type": i,
        "data-use-case": o,
        className: F,
        ...u,
        children: [
          l ? n ? /* @__PURE__ */ a("img", { className: e.thumb, src: n, alt: d }) : /* @__PURE__ */ a("span", { className: e.iconTile, "aria-hidden": !0, children: /* @__PURE__ */ a(
            m,
            {
              name: "image",
              family: "solid",
              fontSize: "0.875rem",
              "aria-hidden": !0
            }
          ) }) : /* @__PURE__ */ t(g, { children: [
            /* @__PURE__ */ a("span", { className: e.iconTile, "aria-hidden": !0, children: /* @__PURE__ */ a(
              m,
              {
                name: h,
                family: "solid",
                fontSize: "0.875rem",
                "aria-hidden": !0
              }
            ) }),
            /* @__PURE__ */ t("span", { className: e.content, children: [
              /* @__PURE__ */ a("span", { className: e.fileName, children: s }),
              r ? /* @__PURE__ */ a("span", { className: e.metadata, children: c }) : null
            ] })
          ] }),
          N ? /* @__PURE__ */ a("span", { className: e.remove, children: /* @__PURE__ */ a(
            x,
            {
              onClick: p,
              "aria-label": "Remove attachment"
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  w as AiChatFileChip
};
//# sourceMappingURL=AiChatFileChip.js.map
