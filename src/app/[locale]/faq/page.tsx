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

  return {
    title: t("metadata.faq.title"),
    description: t("metadata.faq.description"),
    alternates: {
      canonical: `${BASE_URL}/faq`,
      languages: {
        en: `${BASE_URL}/en/faq`,
        "zh-CN": `${BASE_URL}/zh-CN/faq`,
        "x-default": `${BASE_URL}/faq`,
      },
    },
    robots: "index, follow",
  };
}

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export default function FaqPage() {
  const t = useTranslations();

  const faqItems = FAQ_KEYS.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <JsonLd data={jsonLd} />
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="footer-link text-sm mb-8 inline-flex items-center gap-1"
        >
          ← Oh My Browser
        </Link>

        <div className="mt-6 mb-12">
          <span className="badge-capsule mb-5 inline-flex">faq</span>
          <h1
            className="text-3xl font-bold mt-5"
            style={{ color: "var(--text-primary)" }}
          >
            {t("faq.title")}
          </h1>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {t("faq.description")}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="glass rounded-xl p-6"
            >
              <h2
                className="text-base font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                <span
                  className="font-mono text-xs mr-2"
                  style={{ color: "var(--cyan)" }}
                >
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                {item.question}
              </h2>
              <p
                className="text-sm leading-relaxed pl-7"
                style={{ color: "var(--text-muted)" }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-3">
          <Link href="/install" className="cta-gradient">
            {t("nav.install")}
          </Link>
          <Link href="/" className="btn-secondary">
            {t("notFound.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
