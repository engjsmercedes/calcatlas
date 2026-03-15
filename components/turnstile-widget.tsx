"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "auto" | "light" | "dark";
        }
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onTokenChange,
  resetSignal
}: {
  onTokenChange: (token: string) => void;
  resetSignal: number;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current && window.turnstile.remove) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    containerRef.current.innerHTML = "";

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onTokenChange(token),
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => onTokenChange(""),
      theme: "auto"
    });
  }, [onTokenChange, scriptReady, siteKey]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget, resetSignal]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
      <p className="text-xs leading-6 text-muted">
        Protected by Cloudflare Turnstile to reduce spam and automated abuse.
      </p>
    </div>
  );
}
