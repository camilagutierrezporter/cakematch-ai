import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Plan a celebration",
    description: "Share the occasion, guest count, flavor, style, and budget to get a starting recommendation.",
    href: "/core",
    link: "Open the planner",
  },
  {
    number: "02",
    title: "Explore the venture",
    description: "Review the research, feature plan, pricing assumptions, and marketing work behind CakeMatch AI.",
    href: "/product",
    link: "View the product plan",
  },
  {
    number: "03",
    title: "Create a design idea",
    description: "Answer three guided questions and get a design description you can review with a cake designer.",
    href: "/chat",
    link: "Try the design chat",
  },
];

const agents = [
  { name: "Event planner", status: "Working feature", description: "Uses the visitor’s event details to create a rule-based starting recommendation." },
  { name: "Design assistant", status: "Working feature", description: "Uses three selected answers to create a design idea. It does not generate an image or place an order." },
  { name: "Impact check", status: "Human review reminder", description: "Reminds visitors to confirm ingredients, allergies, feasibility, and final prices with a bakery." },
  { name: "Research and venture tools", status: "Planning tools", description: "Show market research, proposed features, pricing assumptions, and marketing content." },
];

export default function DemoPage() {
  return (
    <main className="week6-page demo-page">
      <section className="week6-hero" aria-labelledby="demo-title">
        <p className="eyebrow">Week 6 · Integrated venture</p>
        <h1 id="demo-title">A clearer way to plan something sweet.</h1>
        <p className="week6-lead">
          CakeMatch AI brings event planning, cake design inspiration, and the venture plan together in one place.
          Follow the steps below to try the current features.
        </p>
        <p className="week6-note"><strong>Demo note:</strong> Some examples and pricing scenarios are illustrative. CakeMatch AI does not confirm bakery availability, final prices, ingredients, or food safety.</p>
      </section>

      <section className="week6-section" aria-labelledby="walkthrough-title">
        <div className="week6-heading"><p className="eyebrow">Guided walkthrough</p><h2 id="walkthrough-title">Three ways to explore CakeMatch AI.</h2></div>
        <div className="week6-card-grid">
          {steps.map((step) => (
            <article className="week6-card walkthrough-card" key={step.number}>
              <span className="week6-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <Link className="text-link" href={step.href}>{step.link} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="week6-section" aria-labelledby="agent-map-title">
        <div className="week6-heading"><p className="eyebrow">How the product fits together</p><h2 id="agent-map-title">CakeMatch AI agent map.</h2><p className="week6-muted">These are product modules with clear roles. The recommendations use existing rules and saved data; this map does not mean separate autonomous agents are running.</p></div>
        <div className="agent-map" role="list" aria-label="CakeMatch AI modules">
          {agents.map((agent, index) => (
            <article className="agent-card" role="listitem" key={agent.name}>
              <span className="status-pill">{agent.status}</span>
              <h3>{agent.name}</h3>
              <p>{agent.description}</p>
              {index < agents.length - 1 && <span className="agent-arrow" aria-hidden="true">→</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="week6-section impact-section" aria-labelledby="impact-title">
        <div><p className="eyebrow">Practical impact check</p><h2 id="impact-title">Helpful suggestions still need a human check.</h2><p className="week6-muted">CakeMatch AI is a planning aid. A bakery must confirm the final details before anyone orders or serves a cake.</p></div>
        <ul className="impact-list">
          <li><strong>Allergies:</strong> Tell the bakery directly and confirm ingredients and cross-contact practices.</li>
          <li><strong>Budget:</strong> Treat any estimate as a starting point and request a current quote.</li>
          <li><strong>Design:</strong> Ask a cake designer whether the size, decorations, timing, and materials are feasible.</li>
          <li><strong>Privacy:</strong> Do not enter sensitive personal information into a planning form.</li>
        </ul>
      </section>

      <section className="week6-section" aria-labelledby="testing-summary-title">
        <div className="week6-heading"><p className="eyebrow">Testing summary</p><h2 id="testing-summary-title">Checks completed so far.</h2><p className="week6-muted">Local technical checks are complete. External user testing is still pending and is not counted as passed.</p></div>
        <div className="week6-card-grid test-summary-grid">
          <article className="week6-card"><span className="status-pill">Passed locally</span><h3>Automated tests</h3><p>13 existing software tests passed.</p></article>
          <article className="week6-card"><span className="status-pill">Passed locally</span><h3>Code and route checks</h3><p>Lint and production build passed. All 10 existing and new routes returned HTTP 200 in the local route check.</p></article>
          <article className="week6-card"><span className="status-pill status-proposed">Not completed</span><h3>Five external users</h3><p>The five-user test requirement is still open. No external-user feedback is claimed on this page.</p></article>
        </div>
        <p className="week6-test-link"><Link className="text-link" href="/docs">Review the test log <span aria-hidden="true">↗</span></Link></p>
      </section>

      <section className="week6-section" aria-labelledby="roadmap-title">
        <div className="week6-heading"><p className="eyebrow">Version 2 roadmap</p><h2 id="roadmap-title">Ideas for a future version.</h2></div>
        <div className="roadmap-grid">
          <article className="roadmap-card"><span className="status-pill">Future idea</span><h3>Local bakery profiles</h3><p>Let independent bakeries share verified menus, service areas, and ways to request a quote.</p></article>
          <article className="roadmap-card"><span className="status-pill">Future idea</span><h3>Compare bakery options</h3><p>Help planners compare availability and confirmed quotes after bakeries choose to participate.</p></article>
          <article className="roadmap-card"><span className="status-pill">Future idea</span><h3>More user testing</h3><p>Use feedback from this week’s five external users to decide which improvements are most useful.</p></article>
        </div>
      </section>

      <section className="week6-final-cta" aria-labelledby="next-step-title">
        <div><p className="eyebrow">Try CakeMatch AI</p><h2 id="next-step-title">Start with your celebration.</h2></div>
        <Link className="primary-button" href="/core">Open the event planner</Link>
      </section>
    </main>
  );
}
