import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
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

  return {
    title: t("metadata.guide.ide-agent.title"),
    description: t("metadata.guide.ide-agent.description"),
    alternates: {
      canonical: `${BASE_URL}/guide/ide-agent`,
      languages: {
        en: `${BASE_URL}/en/guide/ide-agent`,
        "zh-CN": `${BASE_URL}/zh-CN/guide/ide-agent`,
        "x-default": `${BASE_URL}/guide/ide-agent`,
      },
    },
    robots: "index, follow",
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${locale}/guide/ide-agent`,
      title: t("metadata.guide.ide-agent.title"),
      description: t("metadata.guide.ide-agent.description"),
      locale: ogLocale,
      siteName: "Oh My Browser",
      images: [
        {
          url: "/og-default.svg",
          width: 1200,
          height: 630,
          alt: "Oh My Browser IDE Agent Guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.guide.ide-agent.title"),
      description: t("metadata.guide.ide-agent.description"),
      images: ["/og-default.svg"],
    },
  };
}

export default function GuideIdeAgentPage() {
  const t = useTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "IDE Agent Guide — Oh My Browser",
    author: {
      "@type": "Organization",
      name: "Oh My Browser",
    },
    datePublished: "2026-04-25",
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <h1>{t("guide.ide-agent.title")}</h1>
    </main>
  );
}
