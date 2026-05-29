/**
 * Section-by-section screenshot variant of the landing page.
 *
 * Each section renders ALONE, centered, with text bumped large so the
 * captured PNG stays readable when shrunk into a README. The homepage
 * at `/` is untouched — these variants live only at:
 *
 *   /?mode=screenshot&section=hero       → T.I.N.K. title block
 *   /?mode=screenshot&section=disclosure → "For decades they denied it…"
 *   /?mode=screenshot&section=briefing   → T.I.N.K. dossier paragraph
 *   /?mode=screenshot&section=footer     → bottom footer + creature sphere
 *
 * Download buttons + video are omitted everywhere — these are README
 * captures, not the actual marketing flow.
 */

import { CreatureStage } from "./stage/CreatureStage";
import { Hero } from "./ui/Hero";
import { Disclosure } from "./ui/Disclosure";
import { Briefing } from "./ui/Briefing";
import { Footer } from "./ui/Footer";

export type ScreenshotSection = "hero" | "disclosure" | "briefing" | "footer";

interface Props {
  section: ScreenshotSection;
}

export function ScreenshotApp({ section }: Props) {
  return (
    <div className={`screenshot-mode screenshot-${section}`}>
      <div className="bg-grain" aria-hidden="true" />
      {section === "footer" && <CreatureStage />}
      <main className="page screenshot-page">
        {section === "hero" && <Hero />}
        {section === "disclosure" && <Disclosure />}
        {section === "briefing" && <Briefing />}
        {section === "footer" && <Footer />}
      </main>
    </div>
  );
}
