import { DISCLOSURE_LINES, DISCLOSURE_HEADLINE, DISCLOSURE_TAIL } from "../lore";

export function Disclosure() {
  return (
    <section className="block disclosure-block">
      <div className="disclosure">
        <p className="disclosure-prelude">
          {DISCLOSURE_LINES.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
        <img
          className="tink-crashed-art"
          src={`${import.meta.env.BASE_URL}tink-crashed.png`}
          alt=""
          aria-hidden="true"
        />
        <p className="disclosure-headline">{DISCLOSURE_HEADLINE}</p>
        <p className="disclosure-tail">
          {DISCLOSURE_TAIL.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
