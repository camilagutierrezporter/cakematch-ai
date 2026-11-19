import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Plan", "/core"],
  ["Research", "/research"],
  ["Product", "/product"],
  ["Pricing", "/pricing"],
  ["Marketing", "/marketing"],
  ["Design chat", "/chat"],
  ["Dashboard", "/dashboard"],
  ["Docs", "/docs"],
  ["Demo", "/demo"],
] as const;

export default function SiteNavigation() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="brand" href="/">
        CakeMatch <span>AI</span>
      </Link>
      <div className="nav-links">
        {links.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
