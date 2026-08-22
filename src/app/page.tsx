import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Navegación principal">
        <Link className="brand" href="/">
          CakeMatch <span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="#inicio">Inicio</Link>
          <Link href="#como-funciona">Cómo funciona</Link>
          <Link href="/docs">Documentación</Link>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Diseña momentos inolvidables</p>
          <h1>Tu pastel ideal, en minutos</h1>
          <p className="hero-description">
            CakeMatch AI te ayudará a encontrar el tamaño, sabor y diseño
            perfecto para cada celebración.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" disabled>
              Diseñar mi pastel
            </button>
            <Link className="text-link" href="#como-funciona">
              Ver cómo funciona <span aria-hidden="true">↗</span>
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
          <p className="eyebrow">Muy pronto</p>
          <h2>Todo lo que necesitas para celebrar a tu manera.</h2>
        </div>
        <div className="feature-grid">
          {[
            ["01", "Recomendaciones personalizadas"],
            ["02", "Diseños para cada ocasión"],
            ["03", "Presupuestos estimados"],
            ["04", "Guarda tus favoritos"],
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
        <p>CakeMatch AI — Proyecto creado por Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
