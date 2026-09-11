import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="placeholder-page docs-page">
      <p className="eyebrow">CakeMatch AI</p>
      <h1>Documentation</h1>
      <p>Simple product notes and prompts for building CakeMatch AI with discipline.</p>

      <section className="docs-section" aria-labelledby="prompt-library-title">
        <p className="eyebrow">Week 1</p>
        <h2 id="prompt-library-title">Prompt Library</h2>
        <p>
          I use this macro-prompt to keep the product plan clear before I write feature code.
        </p>
        <pre className="prompt-code"><code>{`ROLE: You are my disciplined AI-native product architect and coding partner.
COURSE RULE: Do not let me code before the plan is clear.
TASK: Help me complete this week's Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code.
CONSTRAINTS:
- Free tools only.
- Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed.
- Build small, testable features.
- No paid APIs required. If AI output is simulated, label it clearly.
- Require acceptance criteria before coding.`}</code></pre>

        <h3>Week 1 Add-On</h3>
        <ul>
          <li>Required live page: `/core`</li>
          <li>Intake form</li>
          <li>Structured output card</li>
          <li>Save button</li>
          <li>Supabase table `core_outputs`</li>
          <li>Dashboard preview</li>
          <li>Prompt library entry</li>
          <li>Three test runs</li>
        </ul>
      </section>

      <Link className="text-link" href="/">
        Return Home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}