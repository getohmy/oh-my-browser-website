"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
    >
      {copied ? t("install.mcp.copied") : t("install.mcp.copy")}
    </button>
  );
}
