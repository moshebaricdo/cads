import Link from "next/link";
import { FaIcon } from "@codeai/cads-react/icons";
import {
  ExploreBanner,
  ExploreHeader,
  ExploreSurface,
  FIGMA_URL,
} from "@/components/explore/ExploreChrome";
import { OVERVIEW_DIR_GROUPS } from "@/components/explore/overview-data";

export const metadata = {
  title: "Explore Overview A — CADS",
  description: "Directory-list Overview option for CADS docs.",
};

export default function ExploreOverviewAPage() {
  return (
    <ExploreSurface>
      <ExploreBanner option="Overview A" title="Directory list" />
      <ExploreHeader
        title="CADS"
        lead="Variables, components, and agent tooling — pick a system area."
      />

      <div className="docs-explore-dir">
        {OVERVIEW_DIR_GROUPS.map((group) => (
          <div key={group.id} className="docs-explore-dir-group">
            <div className="docs-explore-dir-group-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={`${group.id}-${item.href}-${item.label}`}
                href={item.href}
                className="docs-explore-dir-row"
              >
                <span className="docs-explore-dir-icon" aria-hidden>
                  <FaIcon name={item.iconName} fontSize="14px" />
                </span>
                <span className="docs-explore-dir-text">
                  <span className="docs-explore-dir-label">{item.label}</span>
                  <span className="docs-explore-dir-desc">
                    {item.description}
                  </span>
                </span>
                <FaIcon
                  name="chevron-right"
                  fontSize="12px"
                  className="docs-explore-dir-chevron"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        ))}
      </div>

      <footer className="docs-explore-footer">
        <span>Source of truth</span>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">
          CADS in Figma ↗
        </a>
      </footer>
    </ExploreSurface>
  );
}
