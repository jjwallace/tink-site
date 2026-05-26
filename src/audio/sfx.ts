import { Howl } from "howler";
import orbHoverUrl from "@shared/assets/sfx/sfx-orb-hover.mp3?url";
import hummingUrl from "@shared/assets/sfx/sfx-hummin.mp3?url";
import arrivalUrl from "@shared/assets/sfx/start-mystery.wav?url";
import chirpUrl from "@shared/assets/sfx/record-on-crt.mp3?url";

// Silenced for now per design call — toggle with setSfxMuted(false) to re-enable.
let muted = true;
export function setSfxMuted(m: boolean) {
  muted = m;
}

const orbHover = new Howl({ src: [orbHoverUrl], volume: 0.35 });
const arrival = new Howl({ src: [arrivalUrl], volume: 0.45 });
const chirp = new Howl({ src: [chirpUrl], volume: 0.25 });
const hum = new Howl({ src: [hummingUrl], volume: 0, loop: true });

let humStarted = false;

export function playArrival() {
  if (muted) return;
  arrival.play();
}

export function playHoverChirp() {
  if (muted) return;
  orbHover.play();
}

export function playRecordChirp() {
  if (muted) return;
  chirp.play();
}

export function setHumLevel(level: number) {
  if (muted) level = 0;
  if (!humStarted) {
    hum.play();
    humStarted = true;
  }
  hum.volume(Math.max(0, Math.min(0.18, level)));
}
