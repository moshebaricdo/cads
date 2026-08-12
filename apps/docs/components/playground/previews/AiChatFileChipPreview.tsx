"use client";

import {
  AiChatFileChip,
  type AiChatFileChipType,
  type AiChatFileChipUseCase,
} from "@moshebaricdo/cads-react";

export default function AiChatFileChipPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const type = (values.type as AiChatFileChipType | undefined) ?? "file";
  return (
    <AiChatFileChip
      type={type}
      useCase={(values.useCase as AiChatFileChipUseCase | undefined) ?? "chatStream"}
      fileName={String(values.fileName ?? "filename.ext")}
      metadata={String(values.metadata ?? "12:56PM")}
      imageSrc={
        type === "image"
          ? String(values.imageSrc || "https://placehold.co/64x64/png")
          : undefined
      }
      imageAlt={String(values.imageAlt || "Attachment")}
      iconName={
        values.iconName ? String(values.iconName) : undefined
      }
    />
  );
}
