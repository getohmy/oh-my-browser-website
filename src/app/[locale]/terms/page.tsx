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
    title: t("metadata.terms.title"),
    description: t("metadata.terms.description"),
    alternates: {
      canonical: `${BASE_URL}/terms`,
      languages: {
        en: `${BASE_URL}/en/terms`,
        "zh-CN": `${BASE_URL}/zh-CN/terms`,
        "x-default": `${BASE_URL}/terms`,
      },
    },
    robots: "index, follow",
  };
}

const EFFECTIVE_DATE = "2026-05-01";
const CONTACT_EMAIL = "admin@omb.org.cn";

export default async function TermsPage({
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
            {isZh ? "服务条款" : "Terms of Service"}
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
      <Section title="一、接受条款">
        <p>
          欢迎使用 Oh My Browser（以下简称"OMB"或"本服务"）。本服务由
          Oh My Browser 团队运营。当你注册账号、安装浏览器扩展、使用 CLI 或通过
          MCP 协议接入 OMB 时，即表示你已阅读并同意本《服务条款》以及{" "}
          <Link href="/privacy" className="footer-link">
            《隐私政策》
          </Link>
          。
        </p>
        <p>如不同意本条款的任何内容，请停止使用本服务。</p>
      </Section>

      <Section title="二、服务说明">
        <p>
          OMB 是面向 AI Agent 的浏览器访问网关。它通过浏览器扩展驱动你本地已登录的
          Chrome / Edge 会话执行搜索、读取、交互等任务，并通过 MCP 协议向 agent
          返回结构化结果。
        </p>
        <p>
          OMB 提供以下版本：
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Free Tier</strong>：免费每日 50 次调用</li>
          <li><strong>标准版</strong>：更高额度（额度详见 dashboard）</li>
          <li><strong>浏览器扩展</strong>：默认通过 <code>install.sh</code> 安装的 "Oh My Browser"
            为完整能力版本；Chrome 应用商店还提供轻量版 "Oh My Browser Lite"，能力差异详见{" "}
            <Link href="/install" className="footer-link">安装说明</Link>
          </li>
        </ul>
      </Section>

      <Section title="三、账号与责任">
        <p>
          你需提供真实有效的邮箱完成注册，并对账号下的所有操作负责。
          请妥善保管密码与 token，不要将其分享给他人或公开仓库。
        </p>
        <p>
          如发现账号被盗用，请立即通过{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>{" "}
          联系我们。
        </p>
      </Section>

      <Section title="四、可接受使用">
        <p>使用 OMB 时，你<strong>不得</strong>：</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>规避或攻击 OMB 的速率限制、用量统计、安全机制</li>
          <li>使用 OMB 抓取或滥用第三方网站，造成对方 ToS 违规或法律风险</li>
          <li>用于发送垃圾邮件、刷量、自动化欺诈、恶意 SEO 等行为</li>
          <li>未经授权访问其他用户的账号或数据</li>
          <li>逆向工程、解密 OMB 的协议、加密信道密钥或商业秘密</li>
          <li>用于任何违反中华人民共和国法律法规的活动</li>
          <li>用于自动化注册账号、自动登录他人账号以"养号"，或商业化批量行为</li>
        </ul>
        <p>
          你使用 OMB 访问任何第三方网站的行为需自行遵守该网站的服务条款。
          OMB 仅作为执行通道，不对你 agent 的操作合法性负责。
        </p>
      </Section>

      <Section title="五、用量限额">
        <p>
          Free Tier 每日 50 次调用上限会在 UTC 0 点重置。标准版用量限额详见
          dashboard。如果你恶意触发 rate limit、批量绕过配额或出现异常的
          DDoS 风格请求，我们保留中止账号的权利。
        </p>
        <p>
          OMB 当前不收取费用。若未来推出付费方案，将以新版本服务条款另行说明。
        </p>
      </Section>

      <Section title="六、知识产权">
        <p>
          OMB 的代码（除非另有声明）由 Oh My Browser 团队拥有。开源部分按对应的开源协议授权。
          网站文案、Logo、品牌名"Oh My Browser"为 Oh My Browser 团队所有。
        </p>
        <p>
          你使用 OMB 产生的输出（搜索结果、读取内容、agent action 结果）属于你，
          但你应自行确保不侵犯第三方权利。
        </p>
      </Section>

      <Section title="七、第三方内容">
        <p>
          OMB 仅是浏览器执行通道，返回内容来自你访问的第三方网站。我们不对这些
          内容的准确性、合法性、版权状态作任何陈述或保证。第三方内容的版权归
          原作者所有。
        </p>
      </Section>

      <Section title="八、服务变更与终止">
        <p>
          我们保留随时修改、暂停或终止服务（或服务的某一部分）的权利。重大变更我们
          会提前通过邮件或 dashboard 通知。
        </p>
        <p>
          如你违反本条款，我们可能不经通知暂停或终止你的账号。你可以随时通过
          dashboard 注销账号；注销后账号数据会按隐私政策约定的期限删除。
        </p>
      </Section>

      <Section title="九、免责声明">
        <p>
          OMB 按"现状"和"可用情况"提供。我们不对服务的可用性、不中断、无错误、
          满足你特定需求作明示或默示的保证。在法律允许的最大范围内，我们不对
          因使用或无法使用本服务造成的任何间接、偶然、特殊、惩罚性损害或利润损失负责。
        </p>
        <p>
          特别提示：OMB 通过浏览器扩展驱动你本机的浏览器会话。你应自行评估在
          高风险账号（如银行、企业内网）上启用 OMB 的影响。
        </p>
      </Section>

      <Section title="十、责任限额">
        <p>
          OMB 当前为免费服务。在法律允许的最大范围内，OMB 对你的累计责任不超过
          100 元人民币。如未来引入付费方案，本条款将相应更新。
        </p>
      </Section>

      <Section title="十一、适用法律与争议解决">
        <p>
          本条款适用中华人民共和国法律。任何争议应首先通过友好协商解决；
          协商不成的，由运营主体所在地有管辖权的法院管辖。
        </p>
      </Section>

      <Section title="十二、条款变更">
        <p>
          我们可能随服务变化更新本条款。重大变更我们会通过邮件或 dashboard 通知。
          继续使用即视为接受新版本。
        </p>
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
      <Section title="1. Acceptance of terms">
        <p>
          Welcome to Oh My Browser ("OMB", "we", or "the Service"). The Service
          is operated by the Oh My Browser team. By creating an
          account, installing the browser extension, using the CLI, or
          connecting to OMB via MCP, you agree to these Terms of Service and
          our{" "}
          <Link href="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          .
        </p>
        <p>If you do not agree with any part of these Terms, do not use the Service.</p>
      </Section>

      <Section title="2. Service description">
        <p>
          OMB is an MCP-native browser access gateway for AI agents. Through a
          browser extension it drives your locally logged-in Chrome / Edge
          session to search, read, and interact with web pages, returning
          structured results to the agent over MCP.
        </p>
        <p>OMB offers the following tiers:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Free Tier</strong>: 50 calls per day at no charge</li>
          <li><strong>Standard tier</strong>: higher quotas (see the dashboard for details)</li>
          <li><strong>Browser extension</strong>: the default <code>install.sh</code> installs
            "Oh My Browser" with full capabilities. A lightweight "Oh My Browser Lite" is also
            available on the Chrome Web Store; capability differences are documented in the{" "}
            <Link href="/install" className="footer-link">install guide</Link>
          </li>
        </ul>
      </Section>

      <Section title="3. Accounts and responsibility">
        <p>
          You must provide a valid email to register and are responsible for
          all activity under your account. Keep your password and tokens
          confidential — do not share them or commit them to public
          repositories.
        </p>
        <p>
          If you suspect your account has been compromised, contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>{" "}
          immediately.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>You must NOT:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Circumvent or attack OMB's rate limits, usage accounting, or security mechanisms</li>
          <li>Use OMB to scrape or abuse third-party sites in violation of their ToS or applicable law</li>
          <li>Send spam, fake engagement, automated fraud, or malicious SEO traffic via OMB</li>
          <li>Access other users' accounts or data without authorisation</li>
          <li>Reverse-engineer OMB's wire protocol, channel keys, or trade secrets</li>
          <li>Use OMB for any activity that violates the laws of the People's Republic of China</li>
          <li>Operate automated account creation, automated login to others' accounts, or commercial bulk operations</li>
        </ul>
        <p>
          When you use OMB to access a third-party site, you are responsible for
          complying with that site's terms. OMB is only an execution channel
          and is not responsible for the lawfulness of your agent's actions.
        </p>
      </Section>

      <Section title="5. Usage limits">
        <p>
          The Free Tier daily limit (50 calls) resets at 00:00 UTC. Standard
          tier quotas are documented in the dashboard. We reserve the right to
          suspend accounts that maliciously trigger rate limits, attempt to
          bypass quotas, or send DDoS-style traffic.
        </p>
        <p>
          OMB does not currently charge any fees. If paid plans are introduced
          in the future, they will be described in an updated version of these
          Terms.
        </p>
      </Section>

      <Section title="6. Intellectual property">
        <p>
          OMB's code (unless otherwise stated) is owned by the Oh My Browser
          team. Open-source components are licensed under their respective
          licences. Website copy, logos, and the "Oh My Browser" name are
          owned by the Oh My Browser team.
        </p>
        <p>
          Outputs you produce by using OMB (search results, read content,
          agent action results) belong to you, but you must ensure they do not
          infringe third-party rights.
        </p>
      </Section>

      <Section title="7. Third-party content">
        <p>
          OMB acts only as an execution channel; the content returned comes
          from the third-party sites you visit. We make no representation or
          warranty regarding the accuracy, legality, or copyright status of
          such content. Copyright in third-party content belongs to its
          original authors.
        </p>
      </Section>

      <Section title="8. Service changes and termination">
        <p>
          We may modify, suspend, or terminate the Service (or any part of it)
          at any time. We will give prior notice for material changes via email
          or a dashboard banner.
        </p>
        <p>
          We may suspend or terminate your account without notice if you
          violate these Terms. You may delete your account at any time from the
          dashboard; data is removed per the retention schedule in the Privacy
          Policy.
        </p>
      </Section>

      <Section title="9. Disclaimer">
        <p>
          OMB is provided "AS IS" and "AS AVAILABLE". We make no express or
          implied warranties about availability, uninterrupted operation,
          error-free behaviour, or fitness for any particular purpose. To the
          maximum extent permitted by law, we are not liable for any indirect,
          incidental, special, punitive damages, or lost profits arising from
          your use of or inability to use the Service.
        </p>
        <p>
          Note: OMB drives your local browser session via the extension. You
          are responsible for evaluating the impact of enabling OMB on
          high-risk accounts (banking, corporate intranets, etc.).
        </p>
      </Section>

      <Section title="10. Limitation of liability">
        <p>
          OMB is currently provided free of charge. To the maximum extent
          permitted by law, OMB's aggregate liability to you shall not exceed
          RMB 100. If paid plans are introduced in the future, this clause
          will be updated accordingly.
        </p>
      </Section>

      <Section title="11. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the People's Republic of
          China. Any dispute should first be resolved through good-faith
          negotiation. If unresolved, the dispute shall be submitted to the
          competent court at the operator's place of registration.
        </p>
      </Section>

      <Section title="12. Changes to these terms">
        <p>
          We may update these Terms as the Service evolves. For material
          changes we will notify users by email or dashboard banner. Continued
          use constitutes acceptance.
        </p>
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
