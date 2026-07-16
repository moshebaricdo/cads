import type { Metadata } from "next";
import "./globals.css";
import { DocsShell } from "@/components/DocsShell";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "CADS — CodeAI Design System",
  description:
    "Designer-grade documentation for the CodeAI Design System: variables, components, and AI/Figma parity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <DocsShell>{children}</DocsShell>
        </Providers>
      </body>
    </html>
  );
}
