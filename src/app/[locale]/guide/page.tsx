import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isZh = locale === "zh-CN";
  const ogLocale = isZh ? "zh_CN" : "en_US";
  const canonicalUrl = `${BASE_URL}/guide`;

  return {
    title: t("metadata.guide.title"),
    description: t("metadata.guide.description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${BASE_URL}/en/guide`,
        "zh-CN": `${BASE_URL}/zh-CN/guide`,
        "x-default": `${BASE_URL}/guide`,
      },
    },
    robots: "index, follow",
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${locale}/guide`,
      title: t("metadata.guide.title"),
      description: t("metadata.guide.description"),
      locale: ogLocale,
      siteName: "Oh My Browser",
      images: [
        {
          url: "/og-default.svg",
          width: 1200,
          height: 630,
          alt: "Oh My Browser Guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.guide.title"),
      description: t("metadata.guide.description"),
      images: ["/og-default.svg"],
    },
  };
}

export default function GuidePage() {
  const t = useTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Oh My Browser Guide",
    author: {
      "@type": "Organization",
      name: "Oh My Browser",
    },
    datePublished: "2026-04-25",
  };

  const guides = [
    {
      href: "./guide/ide-agent",
      title: t("guide.ide-agent.title"),
      description: t("metadata.guide.ide-agent.description"),
      label: "ide",
    },
    {
      href: "./guide/agent-platform",
      title: t("guide.agent-platform.title"),
      description: t("metadata.guide.agent-platform.description"),
      label: "platform",
    },
  ];

  return (
    <main className="min-h-screen px-4 py-16">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <span className="badge-capsule mb-5 inline-flex">docs</span>
          <h1
            className="text-3xl font-bold mt-5"
            style={{ color: "var(--text-primary)" }}
          >
            {t("guide.title")}
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="glass-feature p-6 block group"
            >
              <div
                className="text-xs font-mono uppercase tracking-wider mb-3"
                style={{ color: "var(--cyan)" }}
              >
                {guide.label}
              </div>
              <h2
                className="text-base font-semibold mb-2 transition-colors group-hover:text-white"
                style={{ color: "var(--text-primary)" }}
              >
                {guide.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {guide.description}
              </p>
              <div
                className="mt-4 text-xs font-mono"
                style={{ color: "var(--cyan)" }}
              >
                read guide →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
