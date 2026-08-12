import { OverviewHome } from "@/components/OverviewHome";
import { docsMetadata } from "@/lib/docsMetadata";

export const metadata = docsMetadata(
  "CodeAI Design System",
  "The CodeAI Design System (CADS) is a collection of design primitives and components that power our signed-in product experience.",
);

export default function HomePage() {
  return <OverviewHome />;
}
