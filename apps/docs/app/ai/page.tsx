import fs from "node:fs";
import path from "node:path";
import { ForAgents } from "@/components/ForAgents";

export const metadata = {
  title: "Using CADS with AI — CADS",
  description:
    "Install the portable CADS prototyping skill in Claude, ChatGPT, Gemini, or Cursor — self-contained HTML prototypes, no npm packages.",
};

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
