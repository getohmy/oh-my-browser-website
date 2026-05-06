// Strip query string and fragment from a referrer URL — keep origin+pathname only.
// document.referrer can carry OAuth state, magic-link tokens, password-reset tokens,
// search terms, etc. Cross-origin browsers already trim under the default
// strict-origin-when-cross-origin policy, but same-origin referrers (e.g. our own
// /device?code=… page) still expose query strings, which violates the route's
// "no PII" contract once persisted. Origin+pathname keeps useful funnel signal
// without persisting secrets. Returns undefined for empty/invalid input so the
// field stays optional in the request payload.
//
// Protocol whitelist: only http(s) referrers are surfaced. Browsers don't put
// javascript:/data:/blob: into document.referrer in practice, but new URL()
// happily parses them (origin === "null", pathname carries arbitrary content)
// — fail-closed avoids storing those strings if a non-browser caller ever
// posts here.
export function sanitizeReferrer(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    return u.origin + u.pathname;
  } catch {
    return undefined;
  }
}
