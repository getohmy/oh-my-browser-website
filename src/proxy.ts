// Next.js 16+ network boundary entry point (formerly middleware.ts).
// Runs on the Node.js runtime. Renamed from `middleware.ts` per the next 16
// deprecation; the next-intl plugin still exports its handler from
// `next-intl/middleware` (the import path is stable across the rename).
//
// IMPORTANT: next 16's loader resolves `module.proxy || module.default`. User
// code MUST export the handler as the named `proxy` export; `default` is
// reserved for the loader-injected adapter wrapper. Exporting next-intl's
// createMiddleware result as `default` causes `TypeError: adapterFn is not
// a function` at runtime, because next 16 then invokes it with adapter-shaped
// arguments instead of (NextRequest).
//   See: openspec/changes/fix-website-next16-proxy-adapterfn/
import createMiddleware from "next-intl/middleware";

export const proxy = createMiddleware({
  locales: ["en", "zh-CN"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /public assets
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
