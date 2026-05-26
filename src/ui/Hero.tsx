import { useEffect, useRef, useState } from "react";
import {
  HERO_DOSSIER,
  ACRONYM_COLUMNS,
  ACRONYM_COLUMN_LONGEST,
} from "../lore";

const TITLE_LETTERS = ["T.", "I.", "N.", "K."];
const ROTATE_MS = 3000;

export function Hero() {
  // One index per column. Each tick advances exactly one column to its
  // next word — round-robin across the four columns. Columns with only
  // one possible word are skipped, since rotating them would no-op.
  const [colIdx, setColIdx] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [versions, setVersions] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const nextColRef = useRef(0);

  // Acronym rotation — paused. Uncomment to re-enable the one-word-at-a-time
  // round-robin (3s tick). Initial state stays on variant 0 (THOUGHT
  // INTERACTIVE NEURAL KERNEL) so it reads as a normal static title.
  // useEffect(() => {
  //   const t = window.setInterval(() => {
  //     let col = nextColRef.current;
  //     let tries = 0;
  //     while (ACRONYM_COLUMNS[col].length <= 1 && tries < 4) {
  //       col = (col + 1) % 4;
  //       tries++;
  //     }
  //     if (tries >= 4) return;
  //     nextColRef.current = (col + 1) % 4;
  //     setColIdx((prev) => {
  //       const next = [...prev] as [number, number, number, number];
  //       next[col] = (prev[col] + 1) % ACRONYM_COLUMNS[col].length;
  //       return next;
  //     });
  //     setVersions((prev) => {
  //       const next = [...prev] as [number, number, number, number];
  //       next[col] = prev[col] + 1;
  //       return next;
  //     });
  //   }, ROTATE_MS);
  //   return () => window.clearInterval(t);
  // }, []);

  const subWords = colIdx.map((i, j) => ACRONYM_COLUMNS[j][i]);

  return (
    <section className="block hero">
      <div className="hero-grid">
        <div className="hero-title-stack tink-mark">
          {TITLE_LETTERS.map((l, i) => (
            <span key={i} className="hero-letter">{l}</span>
          ))}
          {subWords.map((w, i) => (
            <span key={`cell-${i}`} className="hero-word-cell">
              <span className="hero-word-ghost" aria-hidden="true">
                {ACRONYM_COLUMN_LONGEST[i]}
              </span>
              <span key={`word-${i}-${versions[i]}`} className="hero-word">
                {w}
              </span>
            </span>
          ))}
        </div>
        <ul className="dossier">
          {HERO_DOSSIER.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div className="classified-tag">CLASSIFIED // EYES ONLY</div>
    </section>
  );
}
