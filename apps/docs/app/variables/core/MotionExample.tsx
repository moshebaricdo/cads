"use client";

import {
  Button,
  CadsProvider,
  Checkbox,
  ChipGroup,
  Dropdown,
  IconToggle,
  IconTooltip,
  Tabs,
  TextInput,
  Toggle,
} from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";
import { useEffect, useState } from "react";
import { DEMO_DROPDOWN_OPTIONS } from "@/components/playground/previews/shared";
import styles from "./MotionExample.module.scss";

const TOPIC_OPTIONS = [
  { value: "apps", label: "Apps" },
  { value: "games", label: "Games" },
  { value: "art", label: "Art" },
  { value: "ai", label: "AI" },
  { value: "music", label: "Music" },
  { value: "data", label: "Data" },
];

const ACCOUNT_MENU = [
  {
    value: "profile",
    label: "View profile",
    iconName: "circle-user" as FaIconName,
  },
  {
    value: "settings",
    label: "Account settings",
    iconName: "gear" as FaIconName,
  },
  { type: "separator" as const },
  {
    value: "sign-out",
    label: "Sign out",
    iconName: "right-from-bracket" as FaIconName,
  },
];

const PROJECTS = {
  all: {
    title: "Intro to App Lab",
    meta: "Edited 2 hours ago · Period 3",
    body: "Build a clicker game with buttons, variables, and a simple score display. Students share finished apps to the class gallery.",
    activity: [
      { label: "Design the start screen", done: true },
      { label: "Track score with a variable", done: true },
      { label: "Add a reset button", done: false },
      { label: "Share to the class gallery", done: false },
    ],
  },
  starred: {
    title: "Sprite Lab gallery",
    meta: "Edited yesterday · Favorites",
    body: "Starred projects from this section. Open one to review progress or leave a comment for the student.",
    activity: [
      { label: "Review Maya’s sprite story", done: true },
      { label: "Leave feedback on level 3", done: false },
      { label: "Mark ready for showcase", done: false },
      { label: "Pin to favorites board", done: true },
    ],
  },
  shared: {
    title: "Shared with me",
    meta: "3 projects · Last week",
    body: "Projects classmates shared for peer review. Toggle published-only to hide drafts still in progress.",
    activity: [
      { label: "Open Jordan’s remix", done: false },
      { label: "Check peer-review rubric", done: true },
      { label: "Send revision notes", done: false },
      { label: "Approve for gallery", done: false },
    ],
  },
} as const;

type StepItem = { label: string; done: boolean };

function MotionExampleCard({ previewMotion }: { previewMotion: boolean }) {
  const [tabValue, setTabValue] =
    useState<keyof typeof PROJECTS>("all");
  const [sort, setSort] = useState("recent");
  const [favorited, setFavorited] = useState(false);
  const [topics, setTopics] = useState<string[]>(["apps", "games"]);
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [query, setQuery] = useState("");
  const [steps, setSteps] = useState<StepItem[]>(() =>
    PROJECTS.all.activity.map((item) => ({ ...item })),
  );

  const project = PROJECTS[tabValue];

  useEffect(() => {
    setSteps(PROJECTS[tabValue].activity.map((item) => ({ ...item })));
  }, [tabValue]);

  return (
    <CadsProvider experimentalMotion={previewMotion} baseline={false}>
      <div className={styles.card} aria-label="Projects browser example">
        <div className={styles.toolbar}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>My projects</h3>
            <IconTooltip
              size="small"
              color="tertiary"
              title="Projects for Period 3, including drafts you have not published yet."
              placement="bottom"
              aria-label="About this list"
            />
          </div>
          <div className={styles.toolbarActions}>
            <Dropdown
              role="action"
              size="small"
              label="Alex Kim"
              startIconName="circle-user"
              buttonVariant="outlined"
              buttonColor="secondary"
              menuType="default"
              menuPlacement="bottomRight"
              options={ACCOUNT_MENU}
              aria-label="Account menu"
            />
          </div>
        </div>

        <div className={styles.tabsRail}>
          <Tabs
            type="primary"
            size="small"
            aria-label="Project views"
            value={tabValue}
            onChange={(value) =>
              setTabValue(value as keyof typeof PROJECTS)
            }
            items={[
              { value: "all", label: "All" },
              { value: "starred", label: "Starred" },
              { value: "shared", label: "Shared" },
            ]}
          />
        </div>

        <div className={styles.body}>
          <aside className={styles.sidebar}>
            <TextInput
              size="small"
              color="secondary"
              label="Search"
              showHelper={false}
              placeholder="Search projects"
              startIconName="magnifying-glass"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Dropdown
              role="input"
              size="small"
              color="secondary"
              label="Sort"
              showHelper={false}
              options={DEMO_DROPDOWN_OPTIONS}
              value={sort}
              onChange={(next) =>
                setSort(Array.isArray(next) ? (next[0] ?? "recent") : next)
              }
              menuPlacement="bottomLeft"
              width="full"
              aria-label="Sort projects"
            />
            <ChipGroup
              size="small"
              color="secondary"
              label="Topics"
              showHelper={false}
              options={TOPIC_OPTIONS}
              value={topics}
              onChange={setTopics}
            />
          </aside>

          <div className={styles.main}>
            <div className={styles.mainHeader}>
              <div className={styles.mainTitleRow}>
                <p className={styles.mainTitle}>{project.title}</p>
                <IconToggle
                  size="small"
                  iconName="heart"
                  aria-label="Favorite project"
                  pressed={favorited}
                  onPressedChange={setFavorited}
                />
              </div>
              <p className={styles.mainMeta}>{project.meta}</p>
            </div>
            <p className={styles.mainBody}>{project.body}</p>

            <div className={styles.checklist}>
              <p className={styles.checklistLabel}>Next steps</p>
              <ul className={styles.checklistList}>
                {steps.map((item) => (
                  <li key={item.label} className={styles.checklistItem}>
                    <Checkbox
                      size="small"
                      label={item.label}
                      checked={item.done}
                      onChange={(_, checked) =>
                        setSteps((current) =>
                          current.map((step) =>
                            step.label === item.label
                              ? { ...step, done: checked }
                              : step,
                          ),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.mainFooter}>
              <Toggle
                size="small"
                label="Published only"
                labelPlacement="right"
                checked={publishedOnly}
                onChange={(_, next) => setPublishedOnly(next)}
              />
              <span className={styles.footerSpacer} />
              <Button size="small" variant="contained" color="primary">
                Open project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CadsProvider>
  );
}

/** Contained mini UI that exercises Press, Surface, and Indicator together. */
export function MotionExample() {
  const [previewMotion, setPreviewMotion] = useState(true);

  return (
    <div className={styles.preview}>
      <div className={styles.previewControls}>
        <Toggle
          size="small"
          label="Motion preview on"
          labelPlacement="right"
          hasIcons={false}
          checked={previewMotion}
          onChange={(_, next) => setPreviewMotion(next)}
        />
      </div>
      <MotionExampleCard previewMotion={previewMotion} />
    </div>
  );
}
