import { useDialKit } from "dialkit";
import { useEffect, useMemo, useState } from "react";
import { ModuleItem } from "./ModuleCell";
import {
  buildSymbolLayout,
  type Band,
  type ComponentKind,
  type SwatchPalette,
} from "./shapeGrid";
import {
  SYMBOL_PILL_PATH,
  SYMBOL_TRIANGLE_PATH,
  SYMBOL_VIEWBOX,
} from "./symbolPaths";
import styles from "./SymbolFill.module.scss";

export function SymbolFill() {
  const [seed, setSeed] = useState(42);

  const stage = useDialKit("Stage", {
    theme: {
      type: "select" as const,
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
      default: "dark",
    },
    surface: {
      type: "select" as const,
      options: [
        { value: "void", label: "Void" },
        { value: "canvas", label: "Canvas" },
        { value: "brand", label: "Brand" },
      ],
      default: "void",
    },
    logoScale: [1, 0.5, 1.4, 0.01],
    outline: false,
    outlineWeight: [1.5, 0.5, 6, 0.1],
  });

  const mosaic = useDialKit(
    "Mosaic",
    {
      // DS 8px scale — every stop keeps controls/cards exactly full height
      rowHeight: [40, 24, 64, 8],
      gap: [5, 2, 12, 0.5],
      popRatio: [0.2, 0, 0.6, 0.01],
      palette: {
        type: "select" as const,
        options: [
          { value: "all", label: "Brand + accents" },
          { value: "brand", label: "Purple only" },
          { value: "accents", label: "Pink / orange" },
          { value: "sentiment", label: "Sentiment" },
        ],
        default: "all",
      },
      components: {
        _collapsed: true,
        alerts: true,
        fields: true,
        dropdowns: true,
        chatMessages: true,
        chatInputs: true,
        chatFiles: true,
        sliders: true,
        buttons: true,
        chips: true,
        tags: true,
        toggles: true,
        segmented: true,
      },
      reshuffle: { type: "action" as const, label: "Reshuffle" },
    },
    {
      onAction: (action) => {
        if (action === "reshuffle") setSeed((s) => s + 1);
      },
    },
  );

  const isDark = stage.theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "";
    };
  }, [isDark]);

  const enabledComponents = useMemo(
    (): Record<ComponentKind, boolean> => ({
      alert: mosaic.components.alerts,
      field: mosaic.components.fields,
      dropdown: mosaic.components.dropdowns,
      chatMessage: mosaic.components.chatMessages,
      chatInput: mosaic.components.chatInputs,
      chatFile: mosaic.components.chatFiles,
      slider: mosaic.components.sliders,
      button: mosaic.components.buttons,
      chip: mosaic.components.chips,
      tag: mosaic.components.tags,
      toggle: mosaic.components.toggles,
      segmented: mosaic.components.segmented,
    }),
    [mosaic.components],
  );

  const stagePx = Math.round(880 * stage.logoScale);

  const layout = useMemo(
    () =>
      buildSymbolLayout({
        stage: stagePx,
        rowHeight: mosaic.rowHeight,
        gap: mosaic.gap,
        seed,
        popRatio: mosaic.popRatio,
        palette: mosaic.palette as SwatchPalette,
        enabledComponents,
      }),
    [
      stagePx,
      mosaic.rowHeight,
      mosaic.gap,
      mosaic.popRatio,
      mosaic.palette,
      enabledComponents,
      seed,
    ],
  );

  const counts = useMemo(() => {
    const all = [...layout.bands, ...layout.pill.bands];
    let components = 0;
    let swatches = 0;
    for (const band of all) {
      for (const item of band.items) {
        if (item.content.type === "component") components += 1;
        else swatches += 1;
      }
    }
    return { components, swatches, bands: all.length };
  }, [layout]);

  return (
    <div
      className={`${styles.viewport} ${isDark ? styles.themeDark : styles.themeLight}`}
      style={{ background: surfaceBackground(stage.surface, isDark) }}
    >
      <div
        className={styles.stage}
        style={{
          width: stagePx,
          height: stagePx,
          ["--outline-weight" as string]: String(stage.outlineWeight),
        }}
      >
        <div
          className={styles.assembly}
          role="img"
          aria-label="CodeAI symbol assembled from design system components"
        >
          {layout.bands.map((band) => (
            <BandRow key={band.id} band={band} zoom={layout.zoom} gap={mosaic.gap} />
          ))}

          <div
            className={styles.pill}
            style={{
              left: layout.pill.x,
              top: layout.pill.y,
              width: layout.pill.width,
              height: layout.pill.height,
              borderRadius: layout.pill.radius,
            }}
          >
            {layout.pill.bands.map((band) => (
              <BandRow
                key={band.id}
                band={band}
                zoom={layout.zoom}
                gap={mosaic.gap}
              />
            ))}
          </div>
        </div>

        {stage.outline ? (
          <svg className={styles.outline} viewBox={SYMBOL_VIEWBOX} aria-hidden>
            <path d={SYMBOL_TRIANGLE_PATH} />
            <path d={SYMBOL_PILL_PATH} />
          </svg>
        ) : null}
      </div>

      <p className={styles.caption}>
        {counts.components} components · {counts.swatches} swatches ·{" "}
        {counts.bands} bands
      </p>
    </div>
  );
}

function BandRow({
  band,
  zoom,
  gap,
}: {
  band: Band;
  zoom: number;
  gap: number;
}) {
  return (
    <div
      className={styles.band}
      style={{
        left: band.x,
        top: band.y,
        width: band.width,
        height: band.height,
      }}
    >
      <div
        className={styles.bandInner}
        style={{
          zoom,
          width: band.width / zoom,
          height: band.height / zoom,
          gap: gap / zoom,
          justifyContent: band.justify,
        }}
      >
        {band.items.map((item) => (
          <ModuleItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function surfaceBackground(surface: string, isDark: boolean): string {
  switch (surface) {
    case "canvas":
      return "var(--background-neutral-secondary)";
    case "brand":
      return "var(--background-brand-strong)";
    case "void":
    default:
      return isDark ? "#000000" : "#ffffff";
  }
}
