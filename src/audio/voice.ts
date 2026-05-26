/**
 * voice.ts — synthesized "Tink voice" using Web Audio API.
 *
 * No audio files needed. Each "syllable" is a short FM-modulated oscillator
 * with a sharp attack and exponential decay. Pitch is derived from a seed
 * (character code or scroll bucket) so it feels speech-like rather than
 * random. Same trick used in Animal Crossing / Undertale / Banjo-Kazooie.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
// Silenced for now per design call — set to false (or call setMuted)
// to re-enable narration chirps + ambient hum.
let muted = true;

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.32;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** Wire up unlock-on-gesture so iOS/Safari starts the audio context. */
export function primeAudio() {
  const unlock = () => {
    getCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("wheel", unlock);
    window.removeEventListener("scroll", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
  window.addEventListener("wheel", unlock, { once: true });
  window.addEventListener("scroll", unlock, { once: true, passive: true });
}

export function setMuted(m: boolean) {
  muted = m;
}

/**
 * Play a short chirp seeded by a number. Use a character code, word index,
 * or scroll bucket — anything that varies in a controlled way.
 */
export function speakChirpForChar(seed: number) {
  if (muted) return;
  const c = getCtx();
  if (!masterGain) return;

  const base = 320 + ((seed * 53) % 11) * 28;
  const startF = base * 1.4;
  const endF = base * 0.85;
  const dur = 0.09 + ((seed * 7) % 5) * 0.012;

  const osc = c.createOscillator();
  osc.type = ((seed * 3) % 3) === 0 ? "triangle" : "sine";
  osc.frequency.setValueAtTime(startF, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endF, c.currentTime + dur);

  const mod = c.createOscillator();
  const modGain = c.createGain();
  mod.frequency.value = 60 + ((seed * 11) % 7) * 14;
  modGain.gain.value = 18;
  mod.connect(modGain);
  modGain.connect(osc.frequency);

  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(1, c.currentTime + 0.006);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2800;
  filter.Q.value = 1.2;

  osc.connect(filter);
  filter.connect(g);
  g.connect(masterGain);

  osc.start();
  mod.start();
  osc.stop(c.currentTime + dur + 0.05);
  mod.stop(c.currentTime + dur + 0.05);
}

/** Optional: ambient hum drone, fades in/out by amplitude. */
export function setAmbient(level: number) {
  if (muted) level = 0;
  ensureAmbient();
  if (ambientGain) ambientGain.gain.value = Math.max(0, Math.min(0.04, level * 0.04));
}

let ambientOsc: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function ensureAmbient() {
  if (ambientOsc) return;
  const c = getCtx();
  if (!masterGain) return;
  ambientGain = c.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(masterGain);

  ambientOsc = c.createOscillator();
  ambientOsc.type = "sine";
  ambientOsc.frequency.value = 80;

  ambientOsc2 = c.createOscillator();
  ambientOsc2.type = "sine";
  ambientOsc2.frequency.value = 81.5;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;

  ambientOsc.connect(lp);
  ambientOsc2.connect(lp);
  lp.connect(ambientGain);

  ambientOsc.start();
  ambientOsc2.start();
}
