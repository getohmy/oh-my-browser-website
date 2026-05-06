import createNextIntlPlugin from "next-intl/plugin";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// Single source of truth: load monorepo-root .env so website / API / ext /
// CLI all read the same OMB_* variables. Without this, Next.js only sees
// its own package's .env / .env.local, which would force us to duplicate
// every var. We avoid the dotenv npm dependency by parsing inline.
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnv = resolve(__dirname, "../../.env");
if (existsSync(rootEnv)) {
  for (const line of readFileSync(rootEnv, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    // Don't override if explicitly set in shell (so per-shell overrides win).
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// All website-facing URLs come from a single env source so dev + prod stay
// closed-loop. Defaults are prod values (so static builds without env still
// produce the right marketing URLs); dev `.env` overrides via OMB_WEBSITE_URL,
// OMB_DASHBOARD_URL, OMB_API_BASE_URL — see .env.example.
// install URL = API_URL/install.sh (served by API at routes/client.ts).
const SITE_URL = process.env.OMB_WEBSITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";
const DASHBOARD_URL = process.env.OMB_DASHBOARD_URL || process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.omb.org.cn";
const CHROME_STORE_URL = process.env.OMB_CHROME_STORE_URL || process.env.NEXT_PUBLIC_CHROME_STORE_URL || "https://chromewebstore.google.com/detail/oh-my-browser-lite";
// API_URL backs PageviewTracker fetch (and any future website→API call). In
// dev this points at the local API (CORS allows http://localhost:4174); in
// prod it's https://api.omb.org.cn. Never hard-code the prod URL in
// components — always read this env so dev → local API stays closed loop.
const API_URL = process.env.OMB_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.omb.org.cn";
const INSTALL_URL = `${API_URL}/install.sh`;
const EXTENSION_VERSION =
  process.env.OMB_EXTENSION_VERSION ||
  process.env.NEXT_PUBLIC_OMB_EXTENSION_VERSION ||
  "0.4.0";

// Pin Turbopack workspace root to the monorepo root. Otherwise Turbopack
// detects multiple package-lock.json (root + ~/package-lock.json from another
// project) and warns. Reuses the __dirname/fileURLToPath defined above.
const REPO_ROOT = resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: REPO_ROOT,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: SITE_URL,
    NEXT_PUBLIC_DASHBOARD_URL: DASHBOARD_URL,
    NEXT_PUBLIC_INSTALL_URL: INSTALL_URL,
    NEXT_PUBLIC_CHROME_STORE_URL: CHROME_STORE_URL,
    NEXT_PUBLIC_API_URL: API_URL,
    NEXT_PUBLIC_OMB_EXTENSION_VERSION: EXTENSION_VERSION,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/guides", destination: "/guide", permanent: true },
      { source: "/guides/:path*", destination: "/guide/:path*", permanent: true },
      { source: "/demo", destination: "/demo-page", permanent: true },
      { source: "/zh-CN/guides", destination: "/zh-CN/guide", permanent: true },
      { source: "/zh-CN/guides/:path*", destination: "/zh-CN/guide/:path*", permanent: true },
      { source: "/zh-CN/demo", destination: "/zh-CN/demo-page", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
