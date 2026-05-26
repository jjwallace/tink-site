import { FOOTER_BRAND, FOOTER_LINKS } from "../lore";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="brand">
          {FOOTER_BRAND.title}
          <small>{FOOTER_BRAND.sub}</small>
        </div>
        <nav>
          {FOOTER_LINKS.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
