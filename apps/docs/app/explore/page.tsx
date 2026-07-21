import Link from "next/link";
import { FaIcon } from "@codeai/cads-react/icons";
import {
  ExploreBanner,
  ExploreHeader,
  ExploreSurface,
} from "@/components/explore/ExploreChrome";

export const metadata = {
  title: "Explore — docs page options — CADS",
  description:
    "Temporary design options for Overview and component content pages.",
};

const OPTIONS = [
  {
    href: "/explore/overview-a",
    badge: "Overview A",
    title: "Directory list",
    description:
      "Stacked rows by Foundations / Components / For Agents — quiet Figma footer.",
  },
  {
    href: "/explore/overview-b",
    badge: "Overview B",
    title: "Start-here split + area cards",
    description:
      "Two-column entry: primary path on the left, IA area cards on the right.",
  },
  {
    href: "/explore/component-a",
    badge: "Component A",
    title: "Playground-first (Button)",
    description:
      "Compact header, playground as hero, quiet props / usage / variables below.",
  },
  {
    href: "/explore/component-b",
    badge: "Component B",
    title: "Preview / Docs (Button)",
    description:
      "Segmented Preview vs Docs with sticky on-page nav in the reference view.",
  },
] as const;

export default function ExploreIndexPage() {
  return (
    <ExploreSurface>
      <ExploreBanner option="Index" title="Content page options" />
      <ExploreHeader
        eyebrow="Docs exploration"
        title="Content page options"
        lead="Four temporary layouts for Overview and Button. Real routes stay unchanged."
      />

      <div className="docs-explore-index-list">
        {OPTIONS.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="docs-explore-index-card"
          >
            <span className="docs-explore-index-badge">{option.badge}</span>
            <span>
              <p className="docs-explore-index-title">{option.title}</p>
              <p className="docs-explore-index-desc">{option.description}</p>
            </span>
            <FaIcon
              name="chevron-right"
              fontSize="12px"
              className="docs-explore-index-chevron"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </ExploreSurface>
  );
}
