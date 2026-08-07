"use client";

import {
  AiChatMessage,
  type AiChatMessageAuthor,
  type AiChatMessageContext,
} from "@codeai/cads-react";

export default function AiChatMessagePreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const author = (values.author as AiChatMessageAuthor | undefined) ?? "Human";
  const body =
    values.children != null && String(values.children).length > 0
      ? String(values.children)
      : author === "AI"
        ? "Sure! Have students write a loop that prints their name 10 times, then challenge them to add a counter."
        : "Can you suggest a warm-up activity for my Unit 3 loops lesson?";

  return (
    <AiChatMessage
      context={(values.context as AiChatMessageContext | undefined) ?? "TA"}
      author={author}
      hasActionRow={values.hasActionRow !== false}
      hasLeftActions={values.hasLeftActions !== false}
      hasRightActions={values.hasRightActions !== false}
      hasFlagging={values.hasFlagging !== false}
      feedbackLabel={String(values.feedbackLabel || "Was this helpful?")}
    >
      {body}
    </AiChatMessage>
  );
}
