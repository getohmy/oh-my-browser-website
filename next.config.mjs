import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// All website-facing URLs come from env so dev + prod stay closed-loop.
// Defaults are prod values (so static builds without env still produce the
// right marketing URLs). Vercel injects NEXT_PUBLIC_* via project settings.
const SITE_URL = process.env.OMB_WEBSITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";
const DASHBOARD_URL = process.env.OMB_DASHBOARD_URL || process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.omb.org.cn";
const CHROME_STORE_URL = process.env.OMB_CHROME_STORE_URL || process.env.NEXT_PUBLIC_CHROME_STORE_URL || "https://chromewebstore.google.com/detail/oh-my-browser-lite";
const API_URL = process.env.OMB_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.omb.org.cn";
const INSTALL_URL = `${API_URL}/install.sh`;
const EXTENSION_VERSION =
  process.env.OMB_EXTENSION_VERSION ||
  process.env.NEXT_PUBLIC_OMB_EXTENSION_VERSION ||
  "0.4.0";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Legacy static .html paths — pre-App-Router site lived at /privacy.html
      // etc. Redirect to canonical no-suffix routes for back-compat / SEO.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/install.html", destination: "/install", permanent: true },
      { source: "/en/index.html", destination: "/en", permanent: true },
      { source: "/en/privacy.html", destination: "/en/privacy", permanent: true },
      { source: "/en/install.html", destination: "/en/install", permanent: true },
      { source: "/zh-CN/index.html", destination: "/zh-CN", permanent: true },
      { source: "/zh-CN/privacy.html", destination: "/zh-CN/privacy", permanent: true },
      { source: "/zh-CN/install.html", destination: "/zh-CN/install", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
