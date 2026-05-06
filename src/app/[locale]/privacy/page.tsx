import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("metadata.privacy.title"),
    description: t("metadata.privacy.description"),
    alternates: {
      canonical: `${BASE_URL}/privacy`,
      languages: {
        en: `${BASE_URL}/en/privacy`,
        "zh-CN": `${BASE_URL}/zh-CN/privacy`,
        "x-default": `${BASE_URL}/privacy`,
      },
    },
    robots: "index, follow",
  };
}

const EFFECTIVE_DATE = "2026-05-01";
const CONTACT_EMAIL = "admin@omb.org.cn";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh-CN";

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="footer-link text-sm mb-8 inline-flex items-center gap-1">
          ← Oh My Browser
        </Link>
        <article className="mt-6 prose-policy">
          <span className="badge-capsule mb-5 inline-flex">legal</span>
          <h1
            className="text-3xl font-bold mt-5 mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {isZh ? "隐私政策" : "Privacy Policy"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isZh ? "生效日期" : "Effective date"}: {EFFECTIVE_DATE}
          </p>

          {isZh ? <ZhContent /> : <EnContent />}
        </article>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2
        className="text-xl font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: "var(--text-muted)" }}>
        {children}
      </div>
    </section>
  );
}

function ZhContent() {
  return (
    <>
      <Section title="一、关于本政策">
        <p>
          Oh My Browser（以下简称"OMB"或"本服务"）为 AI Agent 提供浏览器访问通道。
          本政策说明 OMB 在你使用网站、浏览器扩展、CLI 与 MCP 服务时收集、使用、
          存储和共享个人信息的方式。我们遵循《中华人民共和国个人信息保护法》
          （PIPL）以及在适用范围内遵循 GDPR 的要求。
        </p>
        <p>
          运营主体：Oh My Browser 团队。如对本政策有疑问，请通过邮件联系：
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>
          。
        </p>
      </Section>

      <Section title="二、我们收集的信息">
        <p>
          <strong>浏览器扩展专属</strong>：当 agent 触发一次操作时，OMB 扩展会在你的本地浏览器
          内读取 <strong>当前活跃 tab 的页面内容</strong>（DOM 文本 / 元素结构 / 可选的截图）
          以及 <strong>该 tab 的 URL</strong>，以便回答 agent 的请求。这些内容仅作为单次响应
          被发回给你的 AI 客户端（如 Claude Desktop / Cursor），不在 OMB 服务器长期存储。
          详见第三节"我们不收集什么"。
        </p>
        <p>
          <strong>认证 token</strong>：扩展与本地 MCP 中继配对所需的连接 token、刷新 token、
          会话 ID，仅本地存储于浏览器扩展和你机器上的 OMB CLI 中。
        </p>
        <p><strong>账号信息</strong>：邮箱、显示名称、密码（仅以哈希形式存储）。
          通过 GitHub 登录时额外保存 GitHub user ID、用户名和头像 URL。</p>
        <p><strong>使用日志</strong>：每次 API 调用记录请求 ID、调用端点、token 用量、
          provider、估算成本以及缓存命中状态。</p>
        <p><strong>查询内容</strong>：默认仅存 SHA 哈希（<code>queryTextStoragePolicy=hash_only</code>），
          不保留明文。仅在用户主动开启 <code>plain_text</code> 模式时才记录原始查询，
          用于个人调试。</p>
        <p><strong>设备 & 客户端</strong>：CLI 启动时上报版本号、操作系统、CLI/扩展版本，
          网站 pageview 仅记录路径、referer、locale 与 UA 的 SHA 哈希
          —— 我们不存储原始 User-Agent。</p>
        <p><strong>遥测事件</strong>：使用匿名 ID（首次启动生成的随机 UUID）追踪安装漏斗、
          首次登录、错误等事件。登录后该匿名 ID 才与用户 ID 关联。</p>
        <p><strong>站点行为记忆</strong>：当 agent 操作某个站点（如登录小红书、读取知乎）时，
          OMB 可能为该站点缓存可重用的选择器/动作模板（仅含 DOM 结构信息，
          不含你登录的账号或浏览内容）。该数据可在 dashboard 中查看与删除。</p>
      </Section>

      <Section title="三、我们不收集什么（核心承诺）">
        <p>
          <strong>你的浏览器会话与 cookies 仅留在你本地</strong>。OMB 通过浏览器扩展
          驱动你已登录的浏览器会话执行任务，所有 cookie、登录态、账户密码、
          浏览历史均保存在你的本地 Chrome / Edge 中，<strong>不会上传到 OMB 服务器</strong>。
          这是 OMB 的核心安全设计 —— 我们看不到你正在浏览或登录的网站。
        </p>
        <p>
          OMB 服务器只看到 agent 通过 MCP 协议发出的指令（如"搜索 X"、
          "读取 URL Y"）和最终返回的页面摘要，但执行过程发生在你本机的浏览器内。
        </p>
      </Section>

      <Section title="四、我们如何使用这些信息">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>提供和维护服务（账号、配额、计费、缓存）</li>
          <li>诊断和修复故障（错误日志、性能监控）</li>
          <li>计算用量限制（每日免费额度）</li>
          <li>改进产品（聚合后的匿名遥测分析）</li>
          <li>发送账户相关邮件（密码重置、安全提醒）</li>
          <li>遵守法律法规要求</li>
        </ul>
      </Section>

      <Section title="五、第三方服务">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>GitHub OAuth</strong> — 用于登录。OMB 仅获取你的公开邮箱、
            user ID、用户名、头像。受{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub 隐私声明
            </a>{" "}
            约束。
          </li>
          <li>
            <strong>SMTP 邮件服务</strong>（126.com）— 仅用于发送密码重置邮件，
            邮件内容包含一次性 token 链接。
          </li>
          <li>
            <strong>Sentry</strong>（错误监控）— 收集运行时错误堆栈与匿名上下文。
            不收集邮箱、密码、查询内容明文。
          </li>
          <li>
            <strong>Chrome Web Store</strong> — 浏览器扩展由 Google 分发，扩展
            安装统计由 Chrome Web Store 提供，OMB 不直接收集。
          </li>
        </ul>
        <p>
          我们不向任何第三方出售你的个人信息。除上述合作以及法律强制要求外，
          不向任何第三方共享。
        </p>
      </Section>

      <Section title="六、数据存储与安全">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>数据托管于中国大陆境内（阿里云）。</li>
          <li>密码使用 bcrypt 哈希，永不以明文存储。</li>
          <li>JWT 使用 HMAC 签名，token 在传输层 TLS 加密。</li>
          <li>用户配置的模型 API Key 使用 AES-256 加密存储。</li>
          <li>V1 协议链路使用 HKDF 派生信道密钥，每个会话独立。</li>
        </ul>
      </Section>

      <Section title="七、数据保留期限">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>账号信息：账号注销后 30 天硬删除。</li>
          <li>Usage logs：最长保留 12 个月，超出后聚合为日维度统计。</li>
          <li>Refresh token：30 天，过期后失效。</li>
          <li>Device code（CLI 登录）：10 分钟一次性使用。</li>
          <li>Telemetry events：12 个月。</li>
          <li>Pageview：6 个月。</li>
        </ul>
      </Section>

      <Section title="八、你的权利">
        <p>根据 PIPL，你有权：</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>访问、更正你提交的个人信息（dashboard → 账号设置）</li>
          <li>删除你的账号及关联数据（dashboard → 注销）</li>
          <li>导出你的使用数据</li>
          <li>撤回授权（解绑 GitHub、删除已存储的 API Key）</li>
          <li>投诉与申诉（通过邮件或属地网信部门）</li>
        </ul>
        <p>
          请联系{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>{" "}
          行使上述权利。我们会在 15 个工作日内响应。
        </p>
      </Section>

      <Section title="九、Cookie 与本地存储">
        <p>
          OMB 网站使用必要 cookie 维持登录态与防止 CSRF。我们不使用广告追踪、
          不嵌入第三方分析脚本（Pageview 由我们自己 API 收集）。浏览器扩展使用
          <code> chrome.storage.local </code>缓存 site memory 与登录态，
          这些数据仅留在你本机。
        </p>
      </Section>

      <Section title="十、未成年人">
        <p>OMB 不面向未满 14 周岁的用户。如发现未成年人提交了个人信息，请联系我们删除。</p>
      </Section>

      <Section title="十一、政策变更">
        <p>
          本政策可能随服务变化更新。重大变更我们会通过邮件或 dashboard 通知。
          继续使用即视为接受新版本。
        </p>
      </Section>

      <Section title="十二、Chrome Web Store 用户数据有限使用">
        <p>
          OMB 浏览器扩展通过 Chrome Web Store 分发，遵守 Google
          {" "}
          <a
            href="https://developer.chrome.com/docs/webstore/program-policies/limited-use/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Limited Use
          </a>
          {" "}要求。具体而言：
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>我们使用收集到的用户数据 <strong>仅</strong> 用于扩展的核心功能：将你的 AI agent
            连接到你已登录的浏览器，按照你的指令执行操作。</li>
          <li>我们 <strong>不</strong> 将用户数据出售或转移给第三方（除上文第五节中列出的服务、
            或法律强制要求外）。</li>
          <li>我们 <strong>不</strong> 将用户数据用于无关的用途（包括但不限于：广告投放、
            个性化推送、第三方分析）。</li>
          <li>我们 <strong>不</strong> 将用户数据用于评估信用度或贷款决策。</li>
        </ul>
      </Section>

      <Section title="十三、联系我们">
        <p>
          Oh My Browser
          <br />
          邮箱：
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>
    </>
  );
}

function EnContent() {
  return (
    <>
      <Section title="1. About this policy">
        <p>
          Oh My Browser ("OMB", "we", or "the Service") provides an MCP-native
          browser access channel for AI agents. This policy explains how OMB
          collects, uses, stores, and shares personal information when you use
          our website, browser extension, CLI, and MCP server. We comply with
          China's Personal Information Protection Law (PIPL) and, where
          applicable, the EU General Data Protection Regulation (GDPR).
        </p>
        <p>
          Operator: the Oh My Browser team. For questions about this
          policy, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>
          <strong>Browser extension specific</strong>: when the agent triggers an
          action, the OMB extension reads <strong>the content of the active tab
          you are looking at</strong> (DOM text, element structure, an optional
          screenshot) and <strong>that tab's URL</strong> so it can answer the
          agent's request. This content is forwarded as a single-shot response
          to your AI client (e.g. Claude Desktop / Cursor) and is not retained on
          OMB servers. See section 3 ("What we do NOT collect") for the boundary.
        </p>
        <p>
          <strong>Authentication tokens</strong>: a connection token, refresh
          token, and session id used to pair the extension with the OMB CLI
          running on your machine. Stored locally in the extension and the CLI
          only.
        </p>
        <p><strong>Account info</strong>: email, display name, password (stored
          only as a bcrypt hash). When you sign in with GitHub we additionally
          store your GitHub user ID, username, and avatar URL.</p>
        <p><strong>Usage logs</strong>: each API call records a request ID,
          endpoint, token usage, provider, estimated cost, and cache-hit status.</p>
        <p><strong>Query content</strong>: by default only a SHA hash is stored
          (<code>queryTextStoragePolicy=hash_only</code>); plaintext is never
          retained. You may opt into <code>plain_text</code> mode for personal
          debugging — this is off by default.</p>
        <p><strong>Device & client</strong>: CLI startup reports its version,
          operating system, and extension version. Website pageviews record
          path, referer, locale, and a SHA hash of the User-Agent — we do not
          store the raw User-Agent.</p>
        <p><strong>Telemetry events</strong>: install funnel, first-login, and
          error events are tracked using an anonymous ID (a random UUID
          generated on first launch). The anonymous ID is linked to your user
          account only after you sign in.</p>
        <p><strong>Site behavior memory</strong>: when an agent acts on a site
          (e.g. logging into Xiaohongshu, reading Zhihu), OMB may cache reusable
          selectors / action templates for that site (DOM structure only — not
          the account you logged in with or the content you viewed). You can
          inspect and delete this in the dashboard.</p>
      </Section>

      <Section title="3. What we do NOT collect (core commitment)">
        <p>
          <strong>Your browser session and cookies stay on your machine.</strong>{" "}
          OMB drives your already-logged-in browser via the extension; cookies,
          login state, account passwords, and browsing history are stored in
          your local Chrome / Edge — <strong>they are never uploaded to OMB
          servers</strong>. This is OMB's core security design: we cannot see
          which sites you are logged into or browsing.
        </p>
        <p>
          OMB servers only see the MCP-protocol commands the agent sends (e.g.
          "search X", "read URL Y") and the resulting page summary. The
          execution itself happens inside your local browser.
        </p>
      </Section>

      <Section title="4. How we use this information">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Provide and maintain the service (auth, quotas, billing, cache)</li>
          <li>Diagnose and fix issues (error logs, performance monitoring)</li>
          <li>Enforce usage limits (free-tier daily quota)</li>
          <li>Improve the product (aggregated, anonymous telemetry)</li>
          <li>Send account-related email (password reset, security alerts)</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="5. Third-party services">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>GitHub OAuth</strong> — for login. We receive only your
            public email, user ID, username, and avatar. Subject to{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub's privacy statement
            </a>
            .
          </li>
          <li>
            <strong>SMTP email</strong> (126.com) — used solely to send password
            reset emails containing a one-time token link.
          </li>
          <li>
            <strong>Sentry</strong> (error monitoring) — collects runtime error
            stacks and anonymous context. We do not send email, password, or
            plaintext queries to Sentry.
          </li>
          <li>
            <strong>Chrome Web Store</strong> — distributes the extension.
            Install statistics come from Google; OMB does not collect them
            directly.
          </li>
        </ul>
        <p>
          We do not sell your personal information to anyone. We do not share
          it with third parties except as listed above and where required by
          law.
        </p>
      </Section>

      <Section title="6. Storage and security">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Data is hosted in mainland China (Aliyun).</li>
          <li>Passwords are bcrypt-hashed; plaintext is never stored.</li>
          <li>JWTs are HMAC-signed; tokens are TLS-encrypted in transit.</li>
          <li>User-supplied model API keys are AES-256 encrypted at rest.</li>
          <li>The V1 wire protocol uses HKDF-derived per-session channel keys.</li>
        </ul>
      </Section>

      <Section title="7. Retention">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Account data: hard-deleted 30 days after account deletion.</li>
          <li>Usage logs: retained up to 12 months, then aggregated to daily rollups.</li>
          <li>Refresh tokens: 30 days, then expired.</li>
          <li>Device codes (CLI login): 10-minute one-time use.</li>
          <li>Telemetry events: 12 months.</li>
          <li>Pageviews: 6 months.</li>
        </ul>
      </Section>

      <Section title="8. Your rights">
        <p>Under PIPL (and GDPR where applicable) you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Access and correct your personal information (dashboard → account)</li>
          <li>Delete your account and associated data (dashboard → delete)</li>
          <li>Export your usage data</li>
          <li>Withdraw consent (unbind GitHub, delete stored API keys)</li>
          <li>Lodge a complaint with your local data protection authority</li>
        </ul>
        <p>
          Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>{" "}
          to exercise these rights. We respond within 15 business days.
        </p>
      </Section>

      <Section title="9. Cookies and local storage">
        <p>
          The OMB website uses essential cookies for session and CSRF
          protection. We do not use advertising trackers and we do not embed
          third-party analytics scripts (pageviews are recorded by our own
          API). The browser extension uses <code>chrome.storage.local</code>{" "}
          to cache site memory and auth state — that data stays on your
          machine.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          OMB is not directed at users under 14. If you believe a minor has
          provided us personal information, please contact us so we can delete
          it.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this policy as the service evolves. For material
          changes we will notify users by email or dashboard banner. Continued
          use constitutes acceptance.
        </p>
      </Section>

      <Section title="12. Chrome Web Store Limited Use of User Data">
        <p>
          The OMB browser extension is distributed through the Chrome Web Store
          and complies with Google's{" "}
          <a
            href="https://developer.chrome.com/docs/webstore/program-policies/limited-use/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Limited Use
          </a>{" "}
          requirements. Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>We use the user data we collect <strong>only</strong> for the
            extension's core function: connecting your AI agent to your
            already-logged-in browser to execute the actions you ask for.</li>
          <li>We do <strong>not</strong> sell or transfer user data to third
            parties, except for the services listed in section 5 above and as
            required by law.</li>
          <li>We do <strong>not</strong> use or transfer user data for purposes
            unrelated to that core function (including, but not limited to,
            advertising, personalized push, or third-party analytics).</li>
          <li>We do <strong>not</strong> use or transfer user data to determine
            creditworthiness or for lending purposes.</li>
        </ul>
      </Section>

      <Section title="13. Contact">
        <p>
          Oh My Browser
          <br />
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>
    </>
  );
}
