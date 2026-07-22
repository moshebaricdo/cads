import type { ReactNode } from "react";
import styles from "./syntax.module.css";

type TokenKind =
  | "tag"
  | "attribute"
  | "string"
  | "punctuation"
  | "value"
  | "plain";

const TOKEN_CLASS: Record<TokenKind, string> = {
  tag: styles.tag,
  attribute: styles.attribute,
  string: styles.string,
  punctuation: styles.punctuation,
  value: styles.value,
  plain: styles.plain,
};

/**
 * Lightweight JSX highlighter for playground code panes.
 * Uses CADS `--syntax-*` variables — no highlighter dependency.
 */
export function highlightJsx(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const push = (kind: TokenKind, text: string) => {
    if (!text) return;
    nodes.push(
      <span key={key++} className={TOKEN_CLASS[kind]}>
        {text}
      </span>,
    );
  };

  while (i < code.length) {
    // JSX / HTML tag
    if (code[i] === "<") {
      const close = code.indexOf(">", i);
      if (close === -1) {
        push("plain", code.slice(i));
        break;
      }
      highlightTag(code.slice(i, close + 1), push);
      i = close + 1;
      continue;
    }

    // String outside tags (rare in our snippets)
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === "\\") j += 1;
        j += 1;
      }
      push("string", code.slice(i, Math.min(j + 1, code.length)));
      i = Math.min(j + 1, code.length);
      continue;
    }

    // Brace expressions: {…}
    if (code[i] === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < code.length && depth > 0) {
        const ch = code[j];
        if (ch === '"' || ch === "'") {
          const q = ch;
          j += 1;
          while (j < code.length && code[j] !== q) {
            if (code[j] === "\\") j += 1;
            j += 1;
          }
        } else if (ch === "{") depth += 1;
        else if (ch === "}") depth -= 1;
        j += 1;
      }
      push("punctuation", "{");
      const inner = code.slice(i + 1, j - 1);
      if (/^-?\d+(\.\d+)?$/.test(inner.trim())) {
        push("value", inner);
      } else {
        push("value", inner);
      }
      push("punctuation", "}");
      i = j;
      continue;
    }

    // Plain run until next special char
    let j = i + 1;
    while (j < code.length && !"<\"'{".includes(code[j]!)) j += 1;
    push("plain", code.slice(i, j));
    i = j;
  }

  return nodes;
}

function highlightTag(
  tag: string,
  push: (kind: TokenKind, text: string) => void,
) {
  // <Tag … /> or </Tag>
  push("punctuation", "<");
  let i = 1;
  if (tag[i] === "/") {
    push("punctuation", "/");
    i += 1;
  }

  // Tag name
  let j = i;
  while (j < tag.length && /[A-Za-z0-9._-]/.test(tag[j]!)) j += 1;
  push("tag", tag.slice(i, j));
  i = j;

  while (i < tag.length) {
    if (tag[i] === ">" || (tag[i] === "/" && tag[i + 1] === ">")) {
      push("punctuation", tag.slice(i));
      return;
    }

    if (/\s/.test(tag[i]!)) {
      let k = i + 1;
      while (k < tag.length && /\s/.test(tag[k]!)) k += 1;
      push("plain", tag.slice(i, k));
      i = k;
      continue;
    }

    // Attribute name
    let k = i;
    while (k < tag.length && /[A-Za-z0-9_:-]/.test(tag[k]!)) k += 1;
    if (k === i) {
      push("punctuation", tag[i]!);
      i += 1;
      continue;
    }
    push("attribute", tag.slice(i, k));
    i = k;

    if (tag[i] === "=") {
      push("punctuation", "=");
      i += 1;
      if (tag[i] === '"' || tag[i] === "'") {
        const quote = tag[i]!;
        let end = i + 1;
        while (end < tag.length && tag[end] !== quote) end += 1;
        push("string", tag.slice(i, Math.min(end + 1, tag.length)));
        i = Math.min(end + 1, tag.length);
      } else if (tag[i] === "{") {
        let depth = 1;
        let end = i + 1;
        while (end < tag.length && depth > 0) {
          if (tag[end] === "{") depth += 1;
          else if (tag[end] === "}") depth -= 1;
          end += 1;
        }
        push("punctuation", "{");
        push("value", tag.slice(i + 1, end - 1));
        push("punctuation", "}");
        i = end;
      }
    }
  }
}
