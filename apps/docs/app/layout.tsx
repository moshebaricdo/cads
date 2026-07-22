import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Google_Sans_Code, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DocsShell } from "@/components/DocsShell";
import { Providers } from "@/components/Providers";
import { withBasePath } from "@/lib/basePath";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  variable: "--font-google-sans-code",
});

export const metadata: Metadata = {
  title: "CADS — CodeAI Design System",
  description:
    "Designer-grade documentation for the CodeAI Design System: variables, components, and AI/Figma parity.",
  icons: {
    icon: [{ url: withBasePath("/favicon.png"), type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${spaceGrotesk.variable} ${googleSansCode.variable}`}
    >
      <body>
        <Providers>
          <DocsShell>{children}</DocsShell>
        </Providers>
      </body>
    </html>
  );
}
