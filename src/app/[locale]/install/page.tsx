import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import {
  CursorDeepLinkButton,
  ClaudeDesktopCopyPathButton,
} from "@/components/McpClientQuickInstall";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";
const CHROME_STORE_URL =
  process.env.NEXT_PUBLIC_CHROME_STORE_URL ||
  "https://chromewebstore.google.com/detail/oh-my-browser-lite";

// Standard "Oh My Browser" install — no --edition flag (deprecated as of 0.4.0,
// see openspec extension-edition-rename). URL pulled from OMB_INSTALL_URL env
// so dev (local API) and prod (omb.org.cn) stay closed-loop.
const INSTALL_URL =
  process.env.NEXT_PUBLIC_INSTALL_URL || "https://omb.org.cn/install.sh";
const FULL_INSTALL_CMD = `curl -sSL ${INSTALL_URL} | bash`;

const MCP_CLIENTS = [
  {
    key: "claude-code",
    name: "Claude Code",
    command: `claude mcp add oh-my-browser -- omb mcp serve`,
    type: "cli" as const,
  },
  {
    key: "cursor",
    name: "Cursor",
    command: `// ~/.cursor/mcp.json
{
  "mcpServers": {
    "oh-my-browser": {
      "command": "omb",
      "args": ["mcp", "serve"]
    }
  }
}`,
    type: "json" as const,
  },
  {
    key: "codex",
    name: "Codex",
    command: `// ~/.codex/config.json — add to "mcpServers"
{
  "oh-my-browser": {
    "command": "omb",
    "args": ["mcp", "serve"]
  }
}`,
    type: "json" as const,
  },
  {
    key: "windsurf",
    name: "Windsurf",
    command: `// ~/.codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "oh-my-browser": {
      "command": "omb",
      "args": ["mcp", "serve"]
    }
  }
}`,
    type: "json" as const,
  },
  {
    key: "claude-desktop",
    name: "Claude Desktop",
    command: `// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "oh-my-browser": {
      "command": "omb",
      "args": ["mcp", "serve"]
    }
  }
}`,
    type: "json" as const,
  },
  {
    key: "trae",
    name: "Trae",
    command: `// Trae MCP settings → add server
{
  "oh-my-browser": {
    "command": "omb",
    "args": ["mcp", "serve"]
  }
}`,
    type: "json" as const,
  },
  {
    key: "openclaw",
    name: "OpenClaw",
    url: "https://clawhub.ai/plugins/oh-my-browser",
    type: "link" as const,
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("metadata.install.title"),
    description: t("metadata.install.description"),
    alternates: {
      canonical: `${BASE_URL}/install`,
      languages: {
        en: `${BASE_URL}/en/install`,
        "zh-CN": `${BASE_URL}/zh-CN/install`,
        "x-default": `${BASE_URL}/install`,
      },
    },
    robots: "index, follow",
  };
}

export default function InstallPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-20">
        <div className="text-center">
          <span className="badge-capsule mb-6 inline-flex">setup</span>
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t("install.title")}
          </h1>
        </div>

        {/* Lite Edition */}
        <section id="lite-edition" className="scroll-mt-8">
          <div className="glass-feature p-8">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("install.lite.heading")}
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {t("install.lite.desc")}
            </p>
            <a href={CHROME_STORE_URL} className="cta-gradient inline-flex mb-6">
              {t("install.lite.cta")}
            </a>
            <ul className="space-y-2 mt-4">
              {(
                [
                  "install.lite.bullet1",
                  "install.lite.bullet2",
                  "install.lite.bullet3",
                ] as const
              ).map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--cyan)", opacity: 0.5 }}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Standard edition (Oh My Browser) — installed via curl */}
        <section id="full-edition" className="scroll-mt-8">
          <div className="glass-feature p-8">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("install.full.heading")}
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {t("install.full.desc")}
            </p>
            <div
              className="relative flex items-center justify-between rounded-xl px-5 py-4 mb-6"
              style={{
                background: "rgba(10, 14, 20, 0.9)",
                border: "1px solid var(--border-glow)",
              }}
            >
              <pre
                className="font-mono text-sm overflow-x-auto"
                style={{ color: "var(--cyan)" }}
              >
                <span style={{ color: "rgba(94, 234, 212, 0.45)" }}>$ </span>
                {FULL_INSTALL_CMD}
              </pre>
              <CopyButton text={FULL_INSTALL_CMD} />
            </div>
            <ul className="space-y-2">
              {(
                [
                  "install.full.bullet1",
                  "install.full.bullet2",
                  "install.full.bullet3",
                ] as const
              ).map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--cyan)", opacity: 0.5 }}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* MCP Client Setup */}
        <section id="mcp-client-setup" className="scroll-mt-8">
          <h2
            className="text-xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("install.mcp.heading")}
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            {t("install.mcp.intro")}
          </p>
          <div className="space-y-4">
            {MCP_CLIENTS.map((client) => (
              <div
                key={client.key}
                className="glass rounded-xl p-5"
              >
                <h3
                  className="text-sm font-semibold mb-3 font-mono"
                  style={{ color: "var(--cyan)" }}
                >
                  {client.name}
                </h3>
                {client.type === "link" ? (
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-sm underline underline-offset-2"
                  >
                    {client.url}
                  </a>
                ) : (
                  <div className="space-y-3">
                    {client.key === "cursor" && (
                      <CursorDeepLinkButton
                        fallbackCopyLabel={t("install.cursor.fallbackCopy")}
                        fallbackCopiedLabel={t("install.cursor.fallbackCopied")}
                      />
                    )}
                    {client.key === "claude-desktop" && (
                      <ClaudeDesktopCopyPathButton />
                    )}
                    <div
                      className="relative rounded-xl px-5 py-4"
                      style={{
                        background: "rgba(10, 14, 20, 0.9)",
                        border: "1px solid rgba(94, 234, 212, 0.1)",
                      }}
                    >
                      <pre
                        className="font-mono text-xs overflow-x-auto pr-16 whitespace-pre-wrap"
                        style={{ color: "var(--cyan)" }}
                      >
                        {client.command}
                      </pre>
                      <div className="absolute top-3 right-3">
                        <CopyButton text={client.command} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <Link href="/" className="btn-secondary">
            ← {t("notFound.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
