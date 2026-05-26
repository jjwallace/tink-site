import { BRIEFING } from "../lore";

export function Briefing() {
  return (
    <section className="block briefing-block">
      <div className="briefing-tag">{BRIEFING.tag}</div>
      <p className="briefing">{BRIEFING.body}</p>
    </section>
  );
}
