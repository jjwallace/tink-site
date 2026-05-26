/**
 * SiteVoiceAnchor — visual-only port of the native voice anchor.
 *
 * Lifted DOM stack from native: opaque disc + icon sprite + 4 cardinal
 * arrow SVGs + core ring + mother glint. Hover (arrows expand, core fades
 * in) is preserved. The website drives position with `setPosition(x, y)`
 * each frame from its scroll choreographer — there is no drag.
 *
 * What was dropped from the native original (1254 lines → ~270):
 *   - drag + inertia/throw physics
 *   - mode cycling (mute / focus / iterate) and label
 *   - Tauri settings persistence (voice_anchor_x/y, work_mode)
 *   - sound effects (Howler) — site emits its own from sfx.ts
 *   - localStorage anchor recall, drag-count fade
 *
 * Particles still feed the shared ambient-vfx pool. If you mount the
 * creature renderer it will draw those particles automatically.
 */
import gsap from "gsap";
import { emit as emitParticle } from "../ambient-vfx/particles";
import iconUrl from "../../assets/icon-128.png";

export interface SiteAnchorOptions {
  /** Initial center in pixels. */
  x: number;
  y: number;
  /** Icon override. Defaults to the shared icon-128.png. */
  iconSrc?: string;
}

const SIZE = 170;
const CORE_INSET = 50;
const EDGE_SPAWN_MIN = 30;
const EDGE_SPAWN_MAX = 42;
const ARROW_EXPAND_DIST = 80;

const ORB_RADIUS = 27;
const GLINT_RADIUS = ORB_RADIUS * 0.78;
const OCCLUSION_INNER = ORB_RADIUS * 0.55;
const OCCLUSION_OUTER = ORB_RADIUS * 1.05;
const GLINT_FULL_BRIGHT_DIST = 70;
const GLINT_FADE_DIST = 320;
const GLINT_PEAK_OPACITY = 0.95;

const ARROW_SVG = `
  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L22 12 L17 12 L17 22 L7 22 L7 12 L2 12 Z"
          fill="rgba(255,255,255,0.95)"
          stroke="rgba(0,0,0,0.35)" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;

const ARROW_PLACEMENTS = [
  { dx: 0, dy: -ARROW_EXPAND_DIST, rot: 0 },
  { dx: 0, dy: ARROW_EXPAND_DIST, rot: 180 },
  { dx: -ARROW_EXPAND_DIST, dy: 0, rot: 270 },
  { dx: ARROW_EXPAND_DIST, dy: 0, rot: 90 },
];

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export class SiteVoiceAnchor {
  private root: HTMLDivElement;
  private core: HTMLDivElement;
  private arrowEls: HTMLDivElement[] = [];
  private glint: HTMLDivElement;
  private hovering = false;
  private rafId = 0;
  private lastSpawn = 0;
  private cx: number;
  private cy: number;
  private targetX: number;
  private targetY: number;
  private bobY = 0;
  private spawnDrizzle = true;
  private glintOpacity = 0;
  private targetGlintOpacity = 0;
  private glintHue = -1;
  private motherPosProvider:
    | (() => { x: number; y: number; hue?: number } | null)
    | null = null;
  private contextMenuHandler: ((x: number, y: number) => void) | null = null;

  constructor(container: HTMLElement, opts: SiteAnchorOptions) {
    this.cx = opts.x;
    this.cy = opts.y;
    this.targetX = opts.x;
    this.targetY = opts.y;

    this.root = document.createElement("div");
    Object.assign(this.root.style, {
      position: "fixed",
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      "pointer-events": "auto",
      "z-index": "30",
      "user-select": "none",
      cursor: "default",
    } as Partial<CSSStyleDeclaration>);
    container.appendChild(this.root);
    gsap.set(this.root, { xPercent: -50, yPercent: -50 });

    const icon = document.createElement("img");
    icon.src = opts.iconSrc ?? iconUrl;
    icon.draggable = false;
    Object.assign(icon.style, {
      position: "absolute",
      width: "54px",
      height: "54px",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      "border-radius": "50%",
      "object-fit": "cover",
      "z-index": "2",
      "pointer-events": "none",
      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
    } as Partial<CSSStyleDeclaration>);
    this.root.appendChild(icon);

    for (const p of ARROW_PLACEMENTS) {
      const el = document.createElement("div");
      el.innerHTML = ARROW_SVG;
      Object.assign(el.style, {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "22px",
        height: "22px",
        opacity: "0",
        "pointer-events": "none",
        "z-index": "0",
      } as Partial<CSSStyleDeclaration>);
      this.root.appendChild(el);
      gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: p.rot, scale: 0.5 });
      this.arrowEls.push(el);
    }

    this.core = document.createElement("div");
    Object.assign(this.core.style, {
      position: "absolute",
      inset: `${CORE_INSET}px`,
      "border-radius": "50%",
      border: "1.8px solid rgba(255,255,255,0.7)",
      "box-shadow": "0 0 22px rgba(167,139,250,0.55), inset 0 0 12px rgba(255,255,255,0.14)",
      opacity: "0",
      "z-index": "4",
      "pointer-events": "none",
    } as Partial<CSSStyleDeclaration>);
    this.root.appendChild(this.core);

    this.glint = document.createElement("div");
    Object.assign(this.glint.style, {
      position: "absolute",
      width: "5px",
      height: "5px",
      left: "50%",
      top: "50%",
      "border-radius": "50%",
      transform: "translate(-50%, -50%)",
      opacity: "0",
      "pointer-events": "none",
      "mix-blend-mode": "screen",
      "z-index": "5",
      "will-change": "transform, opacity",
    } as Partial<CSSStyleDeclaration>);
    this.applyGlintGradient(320);
    this.root.appendChild(this.glint);

    this.reposition();

    this.root.addEventListener("mouseenter", () => this.onHoverEnter());
    this.root.addEventListener("mouseleave", () => this.onHoverLeave());
    this.root.addEventListener("contextmenu", (e) => this.onContextMenuRaw(e));

    this.startAnim();
  }

  /** Mount the entrance animation: streaks in from above at a slight angle. */
  enterFromAbove(opts?: { delay?: number; angleDeg?: number; from?: number }) {
    const angle = (opts?.angleDeg ?? -25) * Math.PI / 180;
    const from = opts?.from ?? Math.max(window.innerWidth, window.innerHeight);
    const fromX = Math.sin(angle) * from;
    const fromY = -Math.cos(angle) * from;
    gsap.from(this.root, {
      x: fromX,
      y: fromY,
      opacity: 0,
      scale: 0.55,
      duration: 1.1,
      ease: "power3.out",
      delay: opts?.delay ?? 0.15,
    });
  }

  /** Drives the orb to (x,y) screen pixels each frame. Light easing keeps motion soft. */
  setPosition(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  /** Toggle the ambient particle drizzle around the orb edge. */
  setDrizzle(on: boolean) {
    this.spawnDrizzle = on;
  }

  /** Provide a function returning the mother's screen position so the glint can track her. */
  setMotherPosProvider(fn: (() => { x: number; y: number; hue?: number } | null) | null) {
    this.motherPosProvider = fn;
    if (!fn) this.targetGlintOpacity = 0;
  }

  /** Register a handler fired on right-click. Receives the click x,y in viewport coords. */
  setContextMenuHandler(fn: ((x: number, y: number) => void) | null) {
    this.contextMenuHandler = fn;
  }

  private onContextMenuRaw(e: MouseEvent) {
    if (!this.contextMenuHandler) return;
    e.preventDefault();
    this.contextMenuHandler(e.clientX, e.clientY);
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    this.root.remove();
  }

  private reposition() {
    this.root.style.left = `${this.cx}px`;
    this.root.style.top = `${this.cy + this.bobY}px`;
  }

  private startAnim() {
    const tick = (t: number) => {
      this.rafId = requestAnimationFrame(tick);

      this.cx += (this.targetX - this.cx) * 0.18;
      this.cy += (this.targetY - this.cy) * 0.18;

      // Idle bob — same cos-wave breathing the native anchor uses
      // (5.6 s period, ~10 px peak-to-peak). Applied to the rendered
      // position so the orb feels alive even when scroll is still.
      const phase = (t * 0.001 * Math.PI * 2) / 5.6;
      const bob = (-6 + 6 * Math.cos(phase)) / 100 * 170; // 170 = SIZE
      this.bobY = bob;
      this.reposition();

      if (this.spawnDrizzle && t - this.lastSpawn > 70) {
        this.lastSpawn = t;
        this.spawnEdgeParticle();
      }
      this.updateGlint();
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private spawnEdgeParticle() {
    const cy = this.cy + this.bobY;
    const angle = Math.random() * Math.PI * 2;
    const r = EDGE_SPAWN_MIN + Math.random() * (EDGE_SPAWN_MAX - EDGE_SPAWN_MIN);
    const speed = 0.35 + Math.random() * 0.5;
    emitParticle(
      this.cx + Math.cos(angle) * r,
      cy + Math.sin(angle) * r,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    );
  }

  private burst(n: number) {
    const cy = this.cy + this.bobY;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 1.2 + Math.random() * 1.6;
      const r = EDGE_SPAWN_MIN + Math.random() * (EDGE_SPAWN_MAX - EDGE_SPAWN_MIN);
      emitParticle(
        this.cx + Math.cos(angle) * r,
        cy + Math.sin(angle) * r,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
      );
    }
  }

  private updateGlint() {
    const mother = this.motherPosProvider?.() ?? null;
    if (mother) {
      const dx = mother.x - this.cx;
      const dy = mother.y - this.cy;
      const d = Math.hypot(dx, dy);
      const occlusion = smoothstep(OCCLUSION_INNER, OCCLUSION_OUTER, d);
      const outer = Math.max(0, d - ORB_RADIUS);
      const closeness =
        outer <= GLINT_FULL_BRIGHT_DIST
          ? 1
          : Math.max(0, 1 - (outer - GLINT_FULL_BRIGHT_DIST) / GLINT_FADE_DIST);
      this.targetGlintOpacity = occlusion * closeness * GLINT_PEAK_OPACITY;
      const scale = 1 + 1.3 * Math.sqrt(closeness) * occlusion;
      const angle = Math.atan2(dy, dx);
      const ox = Math.cos(angle) * GLINT_RADIUS;
      const oy = Math.sin(angle) * GLINT_RADIUS;
      this.glint.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${scale.toFixed(3)})`;
      if (typeof mother.hue === "number" && Math.abs(mother.hue - this.glintHue) > 0.5) {
        this.applyGlintGradient(mother.hue);
      }
    } else {
      this.targetGlintOpacity = 0;
    }
    const delta = this.targetGlintOpacity - this.glintOpacity;
    if (Math.abs(delta) > 0.001) {
      this.glintOpacity += delta * 0.08;
      this.glint.style.opacity = this.glintOpacity.toFixed(3);
    }
  }

  private applyGlintGradient(hue: number) {
    this.glintHue = hue;
    const h = ((hue % 360) + 360) % 360;
    const core = `hsla(${h}, 70%, 95%, 0.9)`;
    const mid = `hsla(${h}, 85%, 72%, 0.35)`;
    const rim = `hsla(${h}, 85%, 60%, 0)`;
    this.glint.style.background = `radial-gradient(circle at 40% 40%, ${core} 0%, ${mid} 35%, ${rim} 100%)`;
  }

  private onHoverEnter() {
    if (this.hovering) return;
    this.hovering = true;
    gsap.to(this.core, { opacity: 1, duration: 0.25, ease: "power2.out" });
    this.arrowEls.forEach((el, i) => {
      const p = ARROW_PLACEMENTS[i];
      gsap.killTweensOf(el);
      gsap.to(el, {
        x: p.dx,
        y: p.dy,
        rotation: p.rot,
        scale: 1,
        opacity: 1,
        duration: 0.32,
        ease: "back.out(1.8)",
        overwrite: true,
      });
    });
    this.burst(6);
  }

  private onHoverLeave() {
    if (!this.hovering) return;
    this.hovering = false;
    gsap.to(this.core, { opacity: 0, duration: 0.25, ease: "power2.in" });
    this.arrowEls.forEach((el, i) => {
      const p = ARROW_PLACEMENTS[i];
      gsap.killTweensOf(el);
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: p.rot,
        scale: 0.5,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        overwrite: true,
      });
    });
  }
}
