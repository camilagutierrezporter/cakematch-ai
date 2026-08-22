import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          CakeMatch <span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="#inicio">Home</Link>
          <Link href="#como-funciona">How It Works</Link>
          <Link href="/docs">Documentation</Link>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Design unforgettable moments</p>
          <h1>Your perfect cake, in minutes</h1>
          <p className="hero-description">
            CakeMatch AI will help you find the perfect size, flavor, and design
            for every celebration.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" disabled>
              Design My Cake
            </button>
            <Link className="text-link" href="#como-funciona">
              See How It Works <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="cake-plate" />
          <div className="cake">
            <div className="cake-top" />
            <div className="cake-body">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="sparkle sparkle-one">✦</div>
          <div className="sparkle sparkle-two">✧</div>
        </div>
      </section>

      <section className="features" id="como-funciona">
        <div className="section-heading">
          <p className="eyebrow">Coming Soon</p>
          <h2>Everything you need to celebrate your way.</h2>
        </div>
        <div className="feature-grid">
          {[
            ["01", "Personalized Recommendations"],
            ["02", "Designs for Every Occasion"],
            ["03", "Estimated Budgets"],
            ["04", "Save Your Favorites"],
          ].map(([number, title]) => (
            <article className="feature-card" key={number}>
              <span className="feature-number">{number}</span>
              <h3>{title}</h3>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
