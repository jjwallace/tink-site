# Tink — Landing Site

Marketing site for **[Tink](https://github.com/jjwallace/tink)** — voice + overlay companion for Claude Code.

**Live:** [jjwallace.github.io/tink-site/](https://jjwallace.github.io/tink-site/)

```bash
git clone https://github.com/jjwallace/tink-site
cd tink-site
bun install
bun run dev    # http://localhost:5181
```

## What it is

A single-page scroll-driven dark site. A Pixi canvas hosts three actors —
sphere, anchor, creature (Tink) — choreographed against scroll progress.
Real SFX (lifted from native) play at set-pieces; a Web Audio chirp synth
provides the "voice" without shipping any audio files for it.

```
nest/site/
├── public/                  static (favicon)
├── src/
│   ├── main.tsx             React entry
│   ├── App.tsx              composes Stage + UI + audio + scroll
│   ├── App.css              dark theme, typography
│   ├── lore.ts              hero / disclosure / footer copy
│   ├── scroll/scroll.ts     Lenis smooth scroll + progress emitter
│   ├── stage/
│   │   ├── Stage.tsx        Pixi canvas + per-frame choreography
│   │   ├── anchor.ts        glowing orb
│   │   ├── sphere.ts        UAP sprite (from @shared/sphere)
│   │   ├── creature.ts      tentacled Tink (uses tentacle.ts physics)
│   │   ├── tentacle.ts      Verlet-chain physics (lifted from native)
│   │   └── store.ts         creature tunables (S singleton)
│   ├── audio/
│   │   ├── voice.ts         Web Audio chirp synth (no assets)
│   │   └── sfx.ts           Howler-loaded SFX (from @shared/sfx)
│   └── ui/
│       ├── Hero.tsx         CLASSIFIED block (A copy)
│       ├── Disclosure.tsx   "For decades they denied it..." (B copy)
│       └── Footer.tsx
└── vite.config.ts           @shared alias → ../shared/assets
```

## Shared assets

Assets used by more than one nest sibling live in
`repos/nest/shared/assets/`. The Vite alias `@shared/*` resolves there.
See `repos/nest/shared/README.md`.

Improvements to the sphere SVG or SFX in `shared/` automatically appear here.

## Scroll choreography

The Stage maps page scroll progress (0..1) to actor positions across
five acts. Adjust in `src/stage/Stage.tsx → choreograph()`.

| Range | What happens |
|---|---|
| 0.00..0.05 | Anchor streaks in from top-right, hits bottom-center |
| 0.05..0.30 | Anchor hovers, gentle pulse |
| 0.30..0.55 | Anchor rises; A copy fades |
| 0.55..0.85 | Tink emerges, orbits the anchor; B copy fades in |
| 0.85..1.00 | Settles into the footer |

## Audio

Two layers:

1. **Real SFX** (Howler, `@shared/sfx/*.mp3|.wav`) for one-shot moments:
   arrival, hover chirp, ambient hum.
2. **Web Audio synthesis** for the "Tink voice" — no audio files. Each
   chirp is a short FM-modulated oscillator with a sharp envelope.
   Tweak in `src/audio/voice.ts`.

Audio context unlocks on first pointer/key/touch (iOS/Safari requirement).

## Known follow-ups

- Anchor visual is a simplified stand-in. Port full native anchor
  (`repos/nest/native/src/features/voice-anchor/`) for higher fidelity.
- Sphere is a placeholder SVG. Iterate in `shared/sphere/sphere.svg`.
- Add a real GitHub/download link in `src/lore.ts → FOOTER_LINKS`.
- Mobile: scroll choreography assumes desktop viewport; needs a tighter
  layout breakpoint pass.

## Deploy

Auto-deploys to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main`. To enable on a fresh repo: **Settings → Pages →
Source: "GitHub Actions"**.

Static build for self-hosting: `bun run build` → `dist/`.
