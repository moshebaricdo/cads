"use client";

import { useMemo, useState } from "react";
import {
  AiChatFileChip,
  AiChatInput,
  AiChatMessage,
  Link,
  Tabs,
  cadsManifest,
} from "@moshebaricdo/cads-react";
import { TemplatePlayground } from "@/components/TemplatePlayground";
import { PropSheets } from "@/components/PropSheets";
import { withBasePath } from "@/lib/basePath";
import { COMPONENT_PROP_SHEETS, defaultPropSheets } from "@/lib/propSheets";
import styles from "./aiChat.module.scss";

const TAB_EXPORTS = [
  { value: "message", label: "Message", exportName: "AiChatMessage" },
  { value: "fileChip", label: "File Chip", exportName: "AiChatFileChip" },
  {
    value: "remove",
    label: "Remove Button",
    exportName: "ChatFileRemoveButton",
  },
  { value: "input", label: "Input", exportName: "AiChatInput" },
] as const;

const thumb = withBasePath("/favicon.png");

type Attachment = {
  id: string;
  type: "file" | "image";
  fileName?: string;
};

function AttachmentRow({
  items,
  onRemove,
}: {
  items: Attachment[];
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className={styles.attachmentRow}>
      {items.map((item) =>
        item.type === "image" ? (
          <AiChatFileChip
            key={item.id}
            type="image"
            useCase="inputField"
            imageSrc={thumb}
            onRemove={() => onRemove(item.id)}
          />
        ) : (
          <AiChatFileChip
            key={item.id}
            type="file"
            useCase="inputField"
            fileName={item.fileName}
            onRemove={() => onRemove(item.id)}
          />
        ),
      )}
    </div>
  );
}

function AssembledChat() {
  const [taDraft, setTaDraft] = useState("");
  const [tutorDraft, setTutorDraft] = useState("");
  const [taAttachments, setTaAttachments] = useState<Attachment[]>([
    { id: "ta-a", type: "file", fileName: "filename.ext" },
    { id: "ta-b", type: "image" },
  ]);
  const [tutorAttachments, setTutorAttachments] = useState<Attachment[]>([
    { id: "tu-a", type: "file", fileName: "filename.ext" },
    { id: "tu-b", type: "image" },
  ]);

  return (
    <section className={styles.assembled} aria-label="Assembled AI chat">
      <div className={styles.splitCard}>
        <div className={styles.column}>
          <header className={styles.columnHeader}>Teaching Assistant</header>
          <div className={styles.messages}>
            <AiChatMessage context="TA" author="Human">
              Can you suggest a warm-up activity for my Unit 3 loops lesson?
            </AiChatMessage>
            <AiChatMessage
              context="TA"
              author="AI"
              customContent="Warm-up: 10× name loop"
            >
              Sure! Have students write a loop that prints their name 10 times,
              then challenge them to add a <code>counter</code>.
            </AiChatMessage>
          </div>
          <div className={styles.composer}>
            <AttachmentRow
              items={taAttachments}
              onRemove={(id) =>
                setTaAttachments((prev) => prev.filter((item) => item.id !== id))
              }
            />
            <AiChatInput
              value={taDraft}
              onChange={(event) => setTaDraft(event.target.value)}
              placeholder="Type something"
              onSubmit={() => setTaDraft("")}
            />
          </div>
        </div>

        <div className={styles.column}>
          <header className={styles.columnHeader}>Tutor</header>
          <div className={styles.messages}>
            <AiChatMessage context="Tutor" author="Human">
              Why does my sprite keep disappearing when I click run?
            </AiChatMessage>
            <AiChatMessage
              context="Tutor"
              author="AI"
              hasDownload={false}
              hasRightActions={false}
            >
              Good question! Take a look at{" "}
              <Link size="small" isExternal={false} href="#line-4">
                line 4
              </Link>{" "}
              — what do you think happens when your loop sets the sprite&apos;s
              size to <code>0</code>?
            </AiChatMessage>
          </div>
          <div className={styles.composer}>
            <AttachmentRow
              items={tutorAttachments}
              onRemove={(id) =>
                setTutorAttachments((prev) =>
                  prev.filter((item) => item.id !== id),
                )
              }
            />
            <AiChatInput
              value={tutorDraft}
              onChange={(event) => setTutorDraft(event.target.value)}
              placeholder="Type something"
              onSubmit={() => setTutorDraft("")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AiChatPageContent() {
  const [tab, setTab] = useState<string>("message");

  const active = TAB_EXPORTS.find((item) => item.value === tab) ?? TAB_EXPORTS[0];
  const component = useMemo(
    () =>
      cadsManifest.components.find((entry) => entry.exportName === active.exportName),
    [active.exportName],
  );

  const propSheets = component
    ? (COMPONENT_PROP_SHEETS[component.exportName] ??
      defaultPropSheets(component))
    : [];

  return (
    <>
      <AssembledChat />

      <section className={styles.atoms} aria-label="AI Chat building blocks">
        <div className={styles.assembledHeader}>
          <h2 className={styles.sectionTitle}>Building Blocks</h2>
          <p className={styles.assembledLead}>
            The individual building blocks that make up the AI chat UI. These components
            should not typically be used outside of the chat experience.
          </p>
        </div>

        <div className={styles.tabbed}>
          <Tabs
            className={styles.tabs}
            type="primary"
            size="small"
            value={tab}
            onChange={setTab}
            items={TAB_EXPORTS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
          />
        </div>

        {component ? (
          <>
            <TemplatePlayground
              key={component.exportName}
              component={component}
            />
            <PropSheets sheets={propSheets} />
          </>
        ) : null}
      </section>
    </>
  );
}
