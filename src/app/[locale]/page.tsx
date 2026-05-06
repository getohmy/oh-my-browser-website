import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CopyButton } from "@/components/CopyButton";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";
const CHROME_STORE_URL =
  process.env.NEXT_PUBLIC_CHROME_STORE_URL ||
  "https://chromewebstore.google.com/detail/oh-my-browser/placeholder";

// Use the env-configured install URL so dev (localhost API) and prod
// (omb.org.cn) stay closed-loop. We read both the NEXT_PUBLIC_* form
// (prod build inlines this) AND the raw OMB_* form (next dev picks it
// up directly from `.env`). Either will do — fallback is the prod URL.
// INSTALL_URL is computed in next.config.mjs as `${API_URL}/install.sh` and
// inlined into NEXT_PUBLIC_INSTALL_URL. OMB_INSTALL_URL is no longer a
// real env — keep the OMB_API_BASE_URL fallback for `next dev` without build.
const INSTALL_URL =
  process.env.NEXT_PUBLIC_INSTALL_URL ||
  `${process.env.OMB_API_BASE_URL || "https://api.omb.org.cn"}/install.sh`;
const INSTALL_CMD = `curl -fsSL ${INSTALL_URL} | sh`;
const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ||
  process.env.OMB_DASHBOARD_URL ||
  "https://dashboard.omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isZh = locale === "zh-CN";
  const ogLocale = isZh ? "zh_CN" : "en_US";
  const ogImage = isZh ? "/og-zh.svg" : "/og-en.svg";
  const canonicalUrl = `${BASE_URL}${locale === "en" ? "/en" : `/${locale}`}`;

  return {
    title: t("metadata.home.title"),
    description: t("metadata.home.description"),
    alternates: {
      canonical: BASE_URL,
      languages: {
        en: `${BASE_URL}/en`,
        "zh-CN": `${BASE_URL}/zh-CN`,
        "x-default": BASE_URL,
      },
    },
    robots: "index, follow",
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: t("metadata.home.title"),
      description: t("metadata.home.description"),
      locale: ogLocale,
      siteName: "Oh My Browser",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Oh My Browser",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.home.title"),
      description: t("metadata.home.description"),
      images: [ogImage],
    },
  };
}

/* ─── KPI data (hardcoded — no matching i18n keys) ──────────────── */
const KPI_ITEMS = [
  { value: "4+", label: { en: "Connection modes", zh: "接入方式" } },
  { value: "100%", label: { en: "Runs locally", zh: "本地运行" } },
  { value: "0", label: { en: "Third-party data", zh: "第三方数据" } },
  { value: "OSS", label: { en: "Open source", zh: "开源免费" } },
] as const;

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isZh = locale === "zh-CN";
  const extensionVersion =
    process.env.NEXT_PUBLIC_OMB_EXTENSION_VERSION || "0.2.5";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Oh My Browser",
    operatingSystem: "Google Chrome",
    applicationCategory: "BrowserExtension",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    installUrl: CHROME_STORE_URL,
    softwareVersion: extensionVersion,
  };

  const featureCards = [
    {
      key: "read",
      titleKey: "home.features.read.title",
      bodyKeys: [
        "home.features.read.body1",
        "home.features.read.body2",
        "home.features.read.body3",
      ] as const,
      icon: "⬡",
      iconLabel: "read",
    },
    {
      key: "sessions",
      titleKey: "home.features.sessions.title",
      bodyKeys: [
        "home.features.sessions.body1",
        "home.features.sessions.body2",
        "home.features.sessions.body3",
      ] as const,
      icon: "◈",
      iconLabel: "sessions",
    },
    {
      key: "mcp",
      titleKey: "home.features.mcp.title",
      bodyKeys: [
        "home.features.mcp.body1",
        "home.features.mcp.body2",
        "home.features.mcp.body3",
      ] as const,
      icon: "⬡",
      iconLabel: "mcp",
    },
  ];

  const editionRows = [
    { key: "read", label: "home.editions.row.read" },
    { key: "act", label: "home.editions.row.act" },
    { key: "sessions", label: "home.editions.row.sessions" },
    { key: "siteMemory", label: "home.editions.row.siteMemory" },
    { key: "concurrent", label: "home.editions.row.concurrent" },
  ] as const;

  return (
    <main className="min-h-screen">
      <JsonLd data={jsonLd} />

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="px-4 pt-16 pb-20 text-center" style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="max-w-5xl mx-auto w-full animate-fade-up">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="badge-capsule">AI-Powered Browser Gateway</span>
          </div>

          {/* Title — `whitespace-pre-line` honors `\n` in i18n messages so
              the Chinese title breaks at "打造的" → "MCP 原生浏览器基建"
              (semantic phrase boundary) instead of being chopped mid-word
              by CSS auto-wrap on narrow viewports. */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 whitespace-pre-line"
            style={{ letterSpacing: "-0.03em", color: "var(--text-primary)" }}
          >
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* KPI row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto"
          >
            {KPI_ITEMS.map((kpi) => (
              <div
                key={kpi.value}
                className="glass rounded-xl px-4 py-4 text-center"
              >
                <div className="kpi-number mb-1">{kpi.value}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {isZh ? kpi.label.zh : kpi.label.en}
                </div>
              </div>
            ))}
          </div>

          {/* Install command */}
          <div
            className="relative flex items-center justify-between max-w-xl mx-auto mb-8 rounded-xl px-5 py-4"
            style={{
              background: "rgba(10, 14, 20, 0.9)",
              border: "1px solid var(--border-glow)",
              boxShadow: "0 0 16px rgba(94, 234, 212, 0.08)",
            }}
          >
            <span
              className="font-mono text-sm"
              style={{ color: "var(--cyan)" }}
            >
              <span style={{ color: "rgba(94, 234, 212, 0.45)" }}>$ </span>
              {INSTALL_CMD}
            </span>
            <CopyButton text={INSTALL_CMD} />
          </div>

          {/* CTA buttons — the curl install above is the primary path for
             "Oh My Browser" (default build). Chrome Web Store CTA covers
             users on managed Chrome who need the Lite (Web Store) variant.
             No "Full" button — Oh My Browser is the default; Lite is the
             only labeled variant. */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CHROME_STORE_URL} className="btn-secondary">
              {t("home.hero.cta.chrome")}
            </a>
            <Link href="/install" className="btn-secondary">
              {t("nav.install")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Feature cards ───────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--cyan)" }}
            >
              capabilities
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {/* No matching key for this heading, use subtitle approach */}
              Built for real browser automation
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {featureCards.map((card, i) => (
              <div
                key={card.key}
                className="glass-feature p-7"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Icon — minimal geometric, not emoji overflow */}
                <div
                  className="font-mono text-2xl mb-5 leading-none"
                  style={{ color: "var(--cyan)" }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <h2
                  className="text-base font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t(card.titleKey)}
                </h2>
                <ul className="space-y-3">
                  {card.bodyKeys.map((bodyKey) => (
                    <li
                      key={bodyKey}
                      className="text-sm leading-relaxed flex items-start gap-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span
                        className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--cyan)", opacity: 0.5 }}
                      />
                      {t(bodyKey)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Site Memory ─────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div
            className="glass rounded-2xl p-8 sm:p-12 grid sm:grid-cols-2 gap-10 items-center"
            style={{
              background: "rgba(15, 23, 36, 0.5)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {/* Left: mock terminal trace */}
            <div
              className="rounded-xl p-5 font-mono text-xs leading-relaxed order-2 sm:order-1"
              style={{
                background: "rgba(10, 14, 20, 0.95)",
                border: "1px solid var(--border-glow)",
                color: "rgba(94, 234, 212, 0.7)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-4 pb-3"
                style={{ borderBottom: "1px solid rgba(94, 234, 212, 0.1)" }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }}
                />
                <span style={{ color: "var(--cyan)" }}>site_memory.log</span>
              </div>
              <div className="space-y-1.5">
                <div><span style={{ color: "rgba(94, 234, 212, 0.4)" }}>[init] </span>loading selectors for github.com</div>
                <div><span style={{ color: "rgba(94, 234, 212, 0.4)" }}>[hit]  </span>cached path: .search-input → skip discover</div>
                <div><span style={{ color: "rgba(94, 234, 212, 0.4)" }}>[exec] </span>fill #search-box value="oh-my-browser"</div>
                <div><span style={{ color: "rgba(94, 234, 212, 0.4)" }}>[hit]  </span>cached button selector: [data-hotkey="Enter"]</div>
                <div style={{ color: "rgba(167, 139, 250, 0.8)" }}><span style={{ color: "rgba(167, 139, 250, 0.4)" }}>[done] </span>total: 312ms ↓ from 1.4s</div>
                <div><span style={{ color: "rgba(94, 234, 212, 0.4)" }}>[save] </span>updated selector confidence: high</div>
              </div>
            </div>

            {/* Right: text */}
            <div className="order-1 sm:order-2">
              <p
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: "var(--cyan)" }}
              >
                site memory
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-6 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {t("home.siteMemory.headline")}
              </h2>
              <div className="space-y-4">
                {(["home.siteMemory.body1", "home.siteMemory.body2", "home.siteMemory.body3"] as const).map((key) => (
                  <p
                    key={key}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(key)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Edition comparison ───────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--cyan)" }}
            >
              editions
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("home.editions.title")}
            </h2>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid var(--border-subtle)",
              background: "rgba(15, 23, 36, 0.5)",
            }}
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <th
                    className="text-left py-4 px-6 font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--text-muted)", width: "50%" }}
                  />
                  <th
                    className="py-4 px-6 text-center font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("home.editions.liteHeading")}
                  </th>
                  <th
                    className="py-4 px-6 text-center font-semibold text-sm"
                    style={{
                      color: "var(--cyan)",
                      background: "rgba(94, 234, 212, 0.04)",
                    }}
                  >
                    {t("home.editions.fullHeading")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {editionRows.map((row, idx) => (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: idx < editionRows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <td
                      className="py-4 px-6 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t(row.label)}
                    </td>
                    <td
                      className="py-4 px-6 text-center text-sm check-no"
                    >
                      {t(`home.editions.lite.${row.key}`)}
                    </td>
                    <td
                      className="py-4 px-6 text-center text-sm check-yes"
                      style={{ background: "rgba(94, 234, 212, 0.04)" }}
                    >
                      {t(`home.editions.full.${row.key}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/install" className="cta-gradient">
              {t("nav.install")}
            </Link>
            <Link href="/faq" className="btn-secondary">
              FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA footer band ─────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {t("metadata.home.description")}
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Install command */}
          <div
            className="relative flex items-center justify-between max-w-xl mx-auto mb-6 rounded-xl px-5 py-4"
            style={{
              background: "rgba(10, 14, 20, 0.9)",
              border: "1px solid var(--border-glow)",
              boxShadow: "0 0 16px rgba(94, 234, 212, 0.08)",
            }}
          >
            <span className="font-mono text-sm" style={{ color: "var(--cyan)" }}>
              <span style={{ color: "rgba(94, 234, 212, 0.45)" }}>$ </span>
              {INSTALL_CMD}
            </span>
            <CopyButton text={INSTALL_CMD} />
          </div>

          <a
            href={DASHBOARD_URL}
            className="cta-gradient inline-flex"
          >
            {t("nav.signin")}
          </a>
        </div>
      </section>
    </main>
  );
}
