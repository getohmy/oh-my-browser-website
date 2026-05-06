"use client";

/**
 * McpClientQuickInstall — quick-install buttons for Cursor + Claude Desktop
 * on the /install page MCP client setup section.
 *
 * Cursor: deep link via cursor://anysphere.cursor-deeplink/mcp/install
 *   500ms fallback: show copy-config if Cursor isn't installed.
 * Claude Desktop: copy config path button.
 *
 * Windsurf / Codex / Trae: deferred (no verified URL schema).
 */

import { useState } from "react";
import { useTranslations } from "next-intl";

// Cursor MCP config (HTTP transport preferred by Cursor)
const CURSOR_MCP_CONFIG = JSON.stringify(
  {
    mcpServers: {
      "oh-my-browser": {
        url: "http://127.0.0.1:7890/mcp",
      },
    },
  },
  null,
  2,
);

function buildCursorDeepLink(): string {
  const configBase64 = btoa(CURSOR_MCP_CONFIG);
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=oh-my-browser&config=${encodeURIComponent(configBase64)}`;
}

function getClaudeDesktopConfigPath(): string {
  if (typeof navigator !== "undefined" && /Win/.test(navigator.platform)) {
    return "%APPDATA%\\Claude\\claude_desktop_config.json";
  }
  return "~/Library/Application Support/Claude/claude_desktop_config.json";
}

interface CursorDeepLinkButtonProps {
  fallbackCopyLabel: string;
  fallbackCopiedLabel: string;
}

export function CursorDeepLinkButton({
  fallbackCopyLabel,
  fallbackCopiedLabel,
}: CursorDeepLinkButtonProps) {
  const t = useTranslations();
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleInstallClick() {
    const deepLink = buildCursorDeepLink();
    let launched = false;

    const onBlur = () => {
      launched = true;
    };
    window.addEventListener("blur", onBlur, { once: true });

    window.location.href = deepLink;

    setTimeout(() => {
      window.removeEventListener("blur", onBlur);
      if (!launched && document.hasFocus()) {
        setShowFallback(true);
      }
    }, 500);
  }

  async function handleCopyConfig() {
    try {
      await navigator.clipboard.writeText(CURSOR_MCP_CONFIG);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  }

  if (showFallback) {
    return (
      <button
        type="button"
        onClick={handleCopyConfig}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {copied ? fallbackCopiedLabel : fallbackCopyLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
    >
      {t("install.cursor.installBtn")}
    </button>
  );
}

export function ClaudeDesktopCopyPathButton() {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const path = getClaudeDesktopConfigPath();
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {copied ? t("install.mcp.copied") : t("install.claudeDesktop.copyPathBtn")}
    </button>
  );
}
