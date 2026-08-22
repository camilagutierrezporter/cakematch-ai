import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">CakeMatch AI</p>
      <h1>Documentación</h1>
      <p>La documentación de CakeMatch AI estará disponible próximamente.</p>
      <Link className="text-link" href="/">
        Volver al inicio <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}