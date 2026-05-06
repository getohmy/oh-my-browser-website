# @omb/website — Oh My Browser Marketing Website

Next.js 14 App Router + next-intl + Tailwind CSS.

## Dev

```bash
cd packages/website
pnpm install
pnpm dev        # starts on http://localhost:4173
```

## Locale routing

- Default locale (`en`) uses no URL prefix: `https://omb.org.cn/`
- Chinese locale uses `/zh-CN` prefix: `https://omb.org.cn/zh-CN/`
- Locale is detected automatically from the `Accept-Language` header via `next-intl` middleware (`localePrefix: "as-needed"`)
- Message files: `messages/en.json`, `messages/zh-CN.json`

## Routes

| Path | Description |
|---|---|
| `/` | Homepage (en) |
| `/zh-CN` | Homepage (zh-CN) |
| `/install` | Install page (#lite-edition, #full-edition, #mcp-client-setup) |
| `/guide` | Guide index |
| `/guide/ide-agent` | IDE agent guide (Claude Code, Cursor, Codex, Windsurf) |
| `/guide/agent-platform` | Agent platform guide (OpenClaw, etc.) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/demo-page` | Agent-readable baseline demo page |
| `/pro` | Pro tier waitlist |

## Build

```bash
pnpm build      # production build
pnpm typecheck  # tsc --noEmit
```

## Status

Scaffolded (F3 structure pass). Real copy, fonts, SEO metadata, and components are deferred to subsequent passes.

The legacy static HTML files in `public/` are preserved for reference but are superseded by the Next.js App Router build.
