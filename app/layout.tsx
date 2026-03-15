import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const rootSeo = createMetadata({
  title: `${siteConfig.name} | Fast, Modern Online Calculators`,
  description: siteConfig.description,
  path: "/"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...rootSeo,
  title: {
    default: `${siteConfig.name} | Fast, Modern Online Calculators`,
    template: `%s | ${siteConfig.name}`
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen font-sans`}>
        <GoogleAnalytics />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
