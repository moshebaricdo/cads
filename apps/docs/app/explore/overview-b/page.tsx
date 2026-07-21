import Link from "next/link";
import { FaIcon } from "@codeai/cads-react/icons";
import {
  ExploreBanner,
  ExploreHeader,
  ExploreSurface,
  FIGMA_URL,
} from "@/components/explore/ExploreChrome";
import { OverviewStartActions } from "@/components/explore/OverviewStartActions";
import { OVERVIEW_AREA_CARDS } from "@/components/explore/overview-data";

export const metadata = {
  title: "Explore Overview B — CADS",
  description: "Area-card Overview option for CADS docs.",
};

export default function ExploreOverviewBPage() {
  return (
    <ExploreSurface>
      <ExploreBanner option="Overview B" title="Start-here split" />
      <ExploreHeader
        title="CADS"
        lead="Start with foundations or jump into components."
      />

      <div className="docs-explore-split">
        <aside className="docs-explore-start">
          <p className="docs-explore-start-title">Start here</p>
          <p className="docs-explore-start-lead">
            Color and Button cover most of what you need for a first prototype.
          </p>
          <OverviewStartActions />
        </aside>

        <div className="docs-explore-area-grid">
          {OVERVIEW_AREA_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="docs-explore-area-card"
            >
              <div className="docs-explore-area-card-top">
                <FaIcon name={card.iconName} fontSize="14px" aria-hidden />
                <span className="docs-explore-area-card-label">
                  {card.label}
                </span>
              </div>
              <p className="docs-explore-area-card-desc">{card.description}</p>
              <div className="docs-explore-area-links">
                {card.links.slice(0, 4).map((link) => (
                  <span key={link.href}>{link.label}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="docs-explore-footer">
        <span>Spec in Figma</span>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">
          Open CADS file ↗
        </a>
      </footer>
    </ExploreSurface>
  );
}
