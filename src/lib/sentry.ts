// Sentry client wrapper for the website (Next.js App Router).
// DSN-driven: no-op when NEXT_PUBLIC_SENTRY_DSN_WEBSITE is absent.
// PII-stripped: sendDefaultPii false, beforeSend clears event.user.
// Using @sentry/browser (lightweight) — no SSR/RSC tracing for v1.

import * as Sentry from "@sentry/browser";

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN_WEBSITE;
  if (!dsn) return;
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      if (event.user) event.user = undefined;
      return event;
    },
  });
  initialized = true;
}

export function captureError(err: unknown, extra?: Record<string, unknown>): void {
  if (!initialized) return;
  Sentry.captureException(err, { extra });
}
