import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">CakeMatch AI</p>
      <h1>Documentation</h1>
      <p>CakeMatch AI documentation will be available soon.</p>
      <Link className="text-link" href="/">
        Return Home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}