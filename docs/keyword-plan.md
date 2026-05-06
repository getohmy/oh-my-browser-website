# Keyword Plan (locked 2026-04-25, agent-infrastructure positioning)

## English primary terms
- MCP-native browser extension
- MCP browser infrastructure
- AI agent browser MCP server
- Claude Code browser MCP / Cursor browser MCP / Codex browser MCP / Windsurf browser MCP
- OpenClaw browser plugin / clawhub browser skill
- browser automation for AI agents
- logged-in sessions agent automation

## 中文主词
- MCP 浏览器扩展
- MCP 浏览器基建
- AI agent 浏览器服务端
- Claude Code 浏览器插件 / Cursor 浏览器 MCP / OpenClaw 浏览器插件
- agent 登录态浏览器自动化
- 真浏览器 agent 操作

## Removed (consumer-grade, off-position)
- ~~AI 浏览器扩展~~ (too generic)
- ~~AI 网页操作~~ (consumer framing)

## Long-tail per page
- /install: MCP 浏览器扩展 安装 / oh my browser install / claude code browser setup
- /guide/ide-agent: Claude Code MCP browser quickstart / Cursor MCP browser setup
- /guide/agent-platform: OpenClaw browser plugin integration / clawhub browser skill
- /pro: AI agent browser pro / 商业版 agent 浏览器

## Density rule
- 2-3% in body copy
- H1 unique per page + must contain target term
- Image alt = real description, NOT keyword stuffing

## Banlist (CI fails on hit)
Forbidden in production page copy + messages/*.json:
- Monica
- HARPA
- Sider

Exception: allowed in /blog, /competitive-scans, listing-copy.md (analytical contexts; v1 has no such pages so banlist is currently absolute on rendered pages).
