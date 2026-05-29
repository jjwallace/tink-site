export const HERO_TITLE = "T.I.N.K.";
export const HERO_DOSSIER = ["OBJECT RECOVERED.", "ORIGIN UNKNOWN."];

export const DISCLOSURE_LINES = [
  "For decades they denied it.",
];

export const DISCLOSURE_HEADLINE = "Congress is still asking questions.";
export const DISCLOSURE_TAIL = ["It fell from the sky.", "T.I.N.K. is on your desktop."];

export const BRIEFING = {
  tag: "FIELD MANUAL // EXTRACT // UNCLASSIFIED",
  body:
    "T.I.N.K listens. It reads. It speaks. A resident anomaly on your desktop, " +
    "it ingests the chatter of your editor and the agentic operators wired " +
    "alongside it. Claude, Cursor, whichever code-companion you've issued " +
    "clearance to. Compressed into a single calm voice. " +
    "Vibe-coded directives in. Synthesized debriefings out. Half intercept, " +
    "half assistant. A more capable, less smug descendant of Clippy.",
};

export const FOOTER_BRAND = {
  title: "T.I.N.K.",
  sub: "Thought Interactive Neural Kernel",
};

// Rotating "competing classifications" the agency keeps revising. Hero
// cycles through these one word at a time; footer keeps the canonical one.
export const ACRONYM_VARIANTS = [
  ["THOUGHT", "INTERACTIVE", "NEURAL", "KERNEL"],
  ["TENSOR", "INFERENCE", "NEURAL", "KERNEL"],
  ["TOOL", "INTEGRATED", "NEURAL", "KERNEL"],
  ["THINKING", "INTERACTIVE", "NETWORK", "KERNEL"],
  ["TACTICAL", "INTENT", "NEURAL", "KERNEL"],
  ["TASK", "INTENT", "NETWORK", "KERNEL"],
];

// Per-column unique word lists for independent rotation.
export const ACRONYM_COLUMNS: string[][] = [0, 1, 2, 3].map((j) =>
  Array.from(new Set(ACRONYM_VARIANTS.map((v) => v[j]))),
);

// Longest word in each column — used to reserve column width so spacing
// stays constant as words swap.
export const ACRONYM_COLUMN_LONGEST: string[] = ACRONYM_COLUMNS.map((words) =>
  words.reduce((a, b) => (b.length > a.length ? b : a), ""),
);

export const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com/jjwallace/tink" },
  { label: "Download", href: "https://github.com/jjwallace/tink/releases/latest" },
  { label: "Disclosure", href: "?page=disclosure" },
];

// Swap to the actual transmission. YouTube ID only (no full URL) — the
// VideoBlock builds the embed URL with lockdown params.
export const VIDEO = {
  youtubeId: "dQw4w9WgXcQ",
  caption: "INTERCEPTED // 11.47 GHz // 2025-03-02",
};
