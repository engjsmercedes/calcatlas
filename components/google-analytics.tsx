"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") {
      return;
    }

    const query = window.location.search;
    const pagePath = query ? `${pathname}${query}` : pathname;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: `${siteConfig.url}${pagePath}`,
      page_path: pagePath
    });
  }, [pathname]);

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
