import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { PageviewTracker } from "@/components/PageviewTracker";
import { SentryInit } from "@/components/SentryInit";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: "%s | Oh My Browser",
      default: t("metadata.default.title"),
    },
    description: t("metadata.default.description"),
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
      siteName: "Oh My Browser",
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

function Nav({ t }: { t: (key: string) => string }) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 nav-shroud">
      <div className="max-w-7xl mx-auto">
        <nav className="nav-island px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 nav-logo-link">
            <Image
              src="/logo.svg"
              alt="Oh My Browser"
              width={28}
              height={28}
            />
            <span className="font-semibold text-sm tracking-tight nav-brand-text">
              Oh My Browser
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link href="/install" className="nav-link px-3 py-1.5 text-sm rounded-lg">
              {t("nav.install")}
            </Link>
            <Link href="/guide" className="nav-link px-3 py-1.5 text-sm rounded-lg">
              {t("nav.guide")}
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.omb.org.cn"}
              className="cta-gradient ml-2 px-4 py-1.5 text-sm"
            >
              {t("nav.signin")}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Footer({ t }: { t: (key: string) => string }) {
  const compatibilityClients = [
    { label: "Claude Code", href: "/guide/ide-agent" },
    { label: "Cursor", href: "/guide/ide-agent" },
    { label: "Codex", href: "/guide/ide-agent" },
    { label: "Windsurf", href: "/guide/ide-agent" },
    { label: "OpenClaw", href: "/guide/agent-platform" },
  ];

  return (
    <footer className="footer-root mt-24 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 mb-12">
          {/* Product */}
          <div>
            <h3 className="footer-heading text-xs font-semibold uppercase tracking-widest mb-4 font-mono">
              {t("footer.product.heading")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/install" className="footer-link">
                  {t("footer.product.install")}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="footer-link">
                  {t("footer.product.guide")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="footer-heading text-xs font-semibold uppercase tracking-widest mb-4 font-mono">
              {t("footer.resources.heading")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="footer-link">
                  {t("footer.resources.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  {t("footer.resources.terms")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/getohmy/oh-my-browser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {t("footer.resources.github")}
                </a>
              </li>
            </ul>
          </div>

          {/* Compatibility */}
          <div>
            <h3 className="footer-heading text-xs font-semibold uppercase tracking-widest mb-4 font-mono">
              {t("footer.compatibility.heading")}
            </h3>
            <ul className="space-y-3 text-sm">
              {compatibilityClients.map((client) => (
                <li key={client.label}>
                  <Link href={client.href} className="footer-link">
                    {client.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.svg" alt="Oh My Browser" width={20} height={20} />
              <span className="text-sm font-semibold nav-brand-text">
                Oh My Browser
              </span>
            </div>
            <p className="text-xs footer-copy">
              {t("footer.brand.copyright")}
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="footer-bottom pt-6 border-t text-xs text-center">
          MCP-native browser infrastructure for AI agents
        </div>
      </div>
    </footer>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Nav t={t} />
      {children}
      <Footer t={t} />
      <PageviewTracker />
      <SentryInit />
    </NextIntlClientProvider>
  );
}
