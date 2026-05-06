"use client";

import { useEffect } from "react";
import { initSentry } from "@/lib/sentry";

// Mounts Sentry initialization once at app boot (client-side only).
// No-op when NEXT_PUBLIC_SENTRY_DSN_WEBSITE is absent.
export function SentryInit() {
  useEffect(() => {
    initSentry();
  }, []);
  return null;
}
