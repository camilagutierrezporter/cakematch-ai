import Link from "next/link";

const features = [
  {
    area: "Celebration recommendation",
    planner: "Suggests quantity, flavor, design, and estimated price based on the event.",
    bakery: "Helps understand what information each client wants to share.",
    status: "Available in CakeMatch AI",
  },
  {
    area: "Budget and preferences",
    planner: "Adds style, flavor, and budget to the recommendation.",
    bakery: "Allows requests with clearer preferences in a future version.",
    status: "Available for planning · request intake proposed",
  },
  {
    area: "Saved plans and favorites",
    planner: "Lets users revisit ideas for their events.",
    bakery: "—",
    status: "Proposed for a future version",
  },
  {
    area: "Bakery profile and catalog",
    planner: "Explore options from a bakery.",
    bakery: "Showcases products, flavors, and prices from a profile.",
    status: "Proposed for a future version",
  },
  {
    area: "Custom requests",
    planner: "Sends the event details to a bakery.",
    bakery: "Organizes cake and cupcake requests.",
    status: "Proposed for a future version",
  },
];

const tiers = [
  {
    name: "Free Planner",
    price: "$0",
    segment: "People planning a celebration",
    features: ["Cake or cupcake suggestion", "Flavor and style", "Budget and estimated price"],
  },
  {
    name: "Plus Planner",
    price: "$99 MXN / month",
    segment: "People planning multiple events",
    features: ["Everything in the Free plan", "Saved event plans", "Favorite cakes"],
  },
  {
    name: "Bakery Pro",
    price: "$399 MXN / month",
    segment: "Independent bakeries",
    features: ["Bakery profile", "Cake and cupcake catalog", "Organized requests"],
  },
];

export default function ProductPage() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">CakeMatch <span>AI</span></Link>
        <div className="nav-links">
          <Link href="/product" aria-current="page">Product</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/core">Plan an event</Link>
          <Link href="/research">Research</Link>
        </div>
      </nav>

      <section className="product-page" aria-labelledby="product-title">
        <div className="product-intro">
          <p className="eyebrow">Product architecture · Week 3</p>
          <h1 id="product-title">A better way to plan something sweet.</h1>
          <p className="product-lead">CakeMatch AI helps organize an idea for an event and, in the future, can better connect people with independent bakeries.</p>
          <p className="assumption-note">The future features and prices shown here are proposals for this school project; they are not plans available for purchase yet.</p>
        </div>

        <section className="product-section" aria-labelledby="segments-title">
          <p className="eyebrow">For whom</p>
          <h2 id="segments-title">Two segments, different needs.</h2>
          <div className="segment-grid">
            <article className="segment-card"><span className="feature-number">01</span><h3>People planning celebrations</h3><p>They want to estimate quantities and compare flavor, style, and budget without starting from scratch.</p><Link className="text-link" href="/core">Try the planner ↗</Link></article>
            <article className="segment-card"><span className="feature-number">02</span><h3>Independent bakeries</h3><p>They could present their catalog and receive customized requests with cleaner, better-organized information.</p><span className="status-pill">Future idea</span></article>
          </div>
        </section>

        <section className="product-section" aria-labelledby="feature-map-title">
          <p className="eyebrow">Feature map</p>
          <h2 id="feature-map-title">What exists now and what comes next.</h2>
          <div className="feature-map-wrap">
            <table className="feature-map">
              <thead><tr><th>Area</th><th>Event planner</th><th>Bakery</th><th>Status</th></tr></thead>
              <tbody>{features.map((feature) => <tr key={feature.area}><th scope="row">{feature.area}</th><td>{feature.planner}</td><td>{feature.bakery}</td><td><span className={feature.status.startsWith("Available") ? "status-pill" : "status-pill status-proposed"}>{feature.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="product-section" aria-labelledby="tiers-title">
          <div className="section-heading"><p className="eyebrow">Proposed tiers</p><h2 id="tiers-title">One option for each stage.</h2><p className="assumption-note">Trial monthly prices in MXN. They are not validated prices or an active offer.</p></div>
          <div className="tier-grid">{tiers.map((tier) => <article className="tier-card" key={tier.name}><p className="eyebrow">{tier.segment}</p><h3>{tier.name}</h3><p className="tier-price">{tier.price}</p><ul>{tier.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><span className="status-pill status-proposed">Week 3 proposal</span></article>)}</div>
          <div className="product-actions"><Link className="primary-button" href="/pricing">Explore the revenue simulator</Link></div>
        </section>
      </section>
      <footer className="site-footer"><p>CakeMatch AI — Project by Camila Gutiérrez</p><p>AI-Native Builder 2026</p></footer>
    </main>
  );
}
