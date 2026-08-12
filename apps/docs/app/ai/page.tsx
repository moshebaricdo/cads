import fs from "node:fs";
import path from "node:path";
import { ForAgents } from "@/components/ForAgents";
import { docsMetadata } from "@/lib/docsMetadata";

export const metadata = docsMetadata(
  "Using CADS with AI",
  "The CADS portable skill packages the CADS Docs runtime (components and styles) along with general guidance for LLMs on how to best use it. It also provides context on our UI/UX practices, different surfaces of our platform, and more. It works in any AI tool that supports agent skills.",
);

function skillZipAvailable(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", "downloads", "cads-prototyping.zip"),
    );
  } catch {
    return false;
  }
}

export default function AiSetupPage() {
  return <ForAgents zipReady={skillZipAvailable()} />;
}
