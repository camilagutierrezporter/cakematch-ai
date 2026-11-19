import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";

const week6MacroPrompt = `ROLE: You are my disciplined AI-native product architect and coding partner.
COURSE RULE: Do not let me code before the plan is clear.
TASK: Help me complete this week's Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code.
CONSTRAINTS:
- Free tools only.
- Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed.
- Build small, testable features.
- No paid APIs required. If AI output is simulated, label it clearly.
- Require acceptance criteria before coding.

WEEK 6 ADD-ON:
- Integrate the existing CakeMatch pages.
- Required live page: /demo.
- Add /dashboard with existing records and /docs with prompts and build logs.
- Include a clear agent map, practical impact check, and Version 2 roadmap.
- Test with five external users and run a full-site regression check.
- Do not make up user feedback, tests, records, or deployments.`;

async function getPromptLog() {
  try {
    return await readFile(path.join(process.cwd(), "docs/WEEK6_CODING_PROMPT_LOG.md"), "utf8");
  } catch {
    return "The Week 6 coding prompt log is not available yet.";
  }
}

export default async function DocsPage() {
  const promptLog = await getPromptLog();

  return (
    <main className="placeholder-page docs-page">
      <p className="eyebrow">CakeMatch AI</p>
      <h1>Build notes and prompt library.</h1>
      <p>These notes show the planning and coding decisions behind CakeMatch AI. Tests and deployments are labeled only after they happen.</p>

      <section className="docs-section" aria-labelledby="macro-prompt-title">
        <p className="eyebrow">Course macro-prompt</p>
        <h2 id="macro-prompt-title">Plan before building.</h2>
        <pre className="prompt-code"><code>{week6MacroPrompt}</code></pre>
      </section>

      <section className="docs-section" aria-labelledby="week6-build-title">
        <p className="eyebrow">Week 6</p>
        <h2 id="week6-build-title">Coding prompts and build log.</h2>
        <pre className="prompt-code"><code>{promptLog}</code></pre>
        <ul className="docs-evidence-links">
          <li><Link href="/demo">Open the guided demo</Link></li>
          <li><Link href="/dashboard">Open the records dashboard</Link></li>
          <li><a href="https://github.com/camilagutierrezporter/cakematch-ai/blob/main/docs/WEEK6_BUILD_DISCIPLINE.md">Week 6 Build Discipline Packet</a></li>
          <li><a href="https://github.com/camilagutierrezporter/cakematch-ai/blob/main/docs/WEEK6_TEST_LOG.md">Week 6 Test Log</a></li>
          <li><a href="https://github.com/camilagutierrezporter/cakematch-ai/blob/main/docs/WEEK6_ITERATION_LOG.md">Week 6 Iteration Log</a></li>
        </ul>
      </section>

      <section className="docs-section" aria-labelledby="week1-prompt-title">
        <p className="eyebrow">Prompt Library</p>
        <h2 id="week1-prompt-title">The original build discipline prompt.</h2>
        <p>I use this prompt to define the user, product, acceptance criteria, and tests before coding.</p>
        <pre className="prompt-code"><code>{`ROLE: You are my disciplined AI-native product architect and coding partner.
COURSE RULE: Do not let me code before the plan is clear.
TASK: Help me complete this week's Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code.
CONSTRAINTS:
- Free tools only.
- Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed.
- Build small, testable features.
- No paid APIs required. If AI output is simulated, label it clearly.
- Require acceptance criteria before coding.`}</code></pre>
      </section>
    </main>
  );
}
