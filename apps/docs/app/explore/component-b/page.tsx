import { buttonMeta } from "@/components/explore/button-data";
import { ButtonExploreB } from "@/components/explore/ButtonExploreB";
import {
  ExploreBanner,
  ExploreSurface,
} from "@/components/explore/ExploreChrome";

export const metadata = {
  title: "Explore Component B — Button — CADS",
  description: "Preview / Docs segmented Button docs option.",
};

export default function ExploreComponentBPage() {
  const { component, category, importCode, figmaUrl } = buttonMeta();
  const categoryLabel = category?.sectionLabel ?? "Actions";

  return (
    <ExploreSurface>
      <ExploreBanner option="Component B" title="Preview / Docs · Button" />
      <ButtonExploreB
        component={component}
        categoryLabel={categoryLabel}
        importCode={importCode}
        figmaUrl={figmaUrl}
      />
    </ExploreSurface>
  );
}
