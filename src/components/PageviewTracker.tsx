// TODO: Mount this in [locale]/layout.tsx — PageviewTracker is a no-op client component until mounted.
// Add <PageviewTracker /> anywhere inside the <body> of packages/website/src/app/[locale]/layout.tsx
// (import from "@/components/PageviewTracker"). No auth, no PII, fire-and-forget.
"use client";
import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";

import { sanitizeReferrer } from "@/lib/sanitize-referrer";

export function PageviewTracker() {
  const pathname = usePathname();
  const { locale } = useParams() as { locale?: string };
  useEffect(() => {
    // Hash navigator.userAgent client-side — irreversible at rest, no PII stored.
    const ua = navigator.userAgent;
    const enc = new TextEncoder().encode(ua);
    crypto.subtle.digest("SHA-256", enc).then((buf) => {
      const ua_hash = [...new Uint8Array(buf)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 64);
      const url =
        (process.env.NEXT_PUBLIC_API_URL || "https://api.omb.org.cn") +
        "/api/v1/website/pageview";
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referer: sanitizeReferrer(document.referrer),
          locale: locale || "en",
          ua_hash,
        }),
        keepalive: true,
      }).catch(() => {}); // fire-and-forget, no PII consequences
    });
  }, [pathname, locale]);
  return null;
}
