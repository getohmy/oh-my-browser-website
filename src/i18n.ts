import { getRequestConfig } from "next-intl/server";

// Whitelist of supported locales — must match `messages/*.json` filenames.
// Required because `locale` from next-intl can be ANY string captured by
// the [locale] route segment (e.g. `favicon.ico`, `robots.txt`, garbage
// from a typo'd URL). Without this guard we'd `import("../messages/
// favicon.ico.json")` and crash with MODULE_NOT_FOUND on every static asset
// that happens to land in the [locale] route.
const SUPPORTED_LOCALES = ["zh-CN", "en"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
// Must match proxy.ts `defaultLocale`. With `localePrefix: "as-needed"`,
// requests to `/` (no locale prefix) arrive here with `locale = undefined`
// — the fallback decides what those requests render. Mismatch with proxy
// causes `/` to render zh while the nav (which receives the resolved en
// locale via params) stays English, producing a half-translated page.
const DEFAULT_LOCALE: SupportedLocale = "en";

function pickLocale(input: string | undefined): SupportedLocale {
  if (input && (SUPPORTED_LOCALES as readonly string[]).includes(input)) {
    return input as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

// next-intl v3+ requires returning `locale` alongside `messages`.
export default getRequestConfig(async ({ locale }) => {
  const safeLocale = pickLocale(locale);
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default,
  };
});
