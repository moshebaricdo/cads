import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { Google_Sans_Code, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DocsShell } from "@/components/DocsShell";
import { Providers } from "@/components/Providers";
import { withBasePath } from "@/lib/basePath";
import { getThemeBootScript } from "@/lib/docsTheme";

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
      suppressHydrationWarning
    >
      <body>
        <Script
          id="cads-docs-theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getThemeBootScript() }}
        />
        <Providers>
          <DocsShell>{children}</DocsShell>
        </Providers>
      </body>
    </html>
  );
}
