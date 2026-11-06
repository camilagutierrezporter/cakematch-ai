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
          <Link href="/core">Core</Link>
          <Link href="/product">Product</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/research">Research</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/marketing">Marketing</Link>
        </div>
      </nav>

      <section className="hero" id="inicio" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">A sweeter way to plan your celebration</p>
          <h1 id="home-title">Find the right cake for your celebration.</h1>
          <p className="hero-description">
            CakeMatch AI turns your occasion, guest count, flavor, style, and
            budget into a thoughtful cake or cupcake recommendation, so dessert
            planning feels simple.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/core">
              Create My Recommendation
            </Link>
            <Link className="text-link" href="/chat">
              Try the guided chat <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="#who-its-for">
              Who It&apos;s For <span aria-hidden="true">↗</span>
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

      <section
        className="audiences"
        id="who-its-for"
        aria-labelledby="audiences-title"
      >
        <div className="audiences-heading">
          <p className="eyebrow">Made for every side of the celebration</p>
          <h2 id="audiences-title">A thoughtful match starts with you.</h2>
        </div>
        <div className="audience-grid">
          <article className="audience-card">
            <p className="audience-label">For celebration planners</p>
            <h3>Make the dessert decision feel easy.</h3>
            <p>
              Whether it&apos;s a birthday or a once-in-a-lifetime gathering,
              get a recommendation shaped around your occasion, guests, and
              preferences.
            </p>
          </article>
          <article className="audience-card audience-card-bakery">
            <p className="audience-label">For independent bakeries</p>
            <h3>Bring your craft to more celebrations.</h3>
            <p>
              Independent bakeries make meaningful moments sweeter. CakeMatch
              AI is exploring ways to help local bakers connect with people
              looking for something special.
            </p>
          </article>
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
