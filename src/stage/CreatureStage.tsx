import { useEffect, useRef } from "react";
import { Creature } from "@shared/src/creature";
import { S } from "@shared/src/creature/store";

let creaturePosProvider: (() => { x: number; y: number; hue: number } | null) | null = null;
export function getCreaturePosProvider() {
  return creaturePosProvider;
}

/**
 * Mounts the Pixi creature and runs a never-ending flight loop:
 * figure-8s at random positions across the viewport, occasionally
 * leaving + re-entering from a random edge. Always visible on top.
 */
export function CreatureStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    S.companions = true;
    S.companionCount = 0;
    S.interactive = true;

    const creature = new Creature();
    let alive = true;
    let cycleTimer: number | undefined;
    let reentryTimer: number | undefined;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // A spread of "interesting" anchor points across the viewport so the
    // creature never just sits in the middle. Mixing edges + corners +
    // center keeps her visually roaming.
    const pickPoint = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const px = rand(0.15, 0.85);
      const py = rand(0.15, 0.75);
      return { x: w * px, y: h * py };
    };

    let stepCount = 0;
    const stepCycle = () => {
      if (!alive) return;
      stepCount++;
      // Every ~4th step: full exit + re-entry for the "in and out" feel.
      if (stepCount % 4 === 0) {
        creature.dispatch({ type: "leave-screen", target: { x: 0, y: 0 } });
        reentryTimer = window.setTimeout(() => {
          if (!alive) return;
          creature.dispatch({
            type: "idle-figure8",
            target: pickPoint(),
            radius: rand(200, 340),
            speed: rand(0.7, 1.1),
          });
        }, 1400);
      } else {
        creature.dispatch({
          type: "idle-figure8",
          target: pickPoint(),
          radius: rand(180, 340),
          speed: rand(0.55, 1.0),
        });
      }
    };

    creature.start(host).then(() => {
      if (!alive) {
        creature.stop();
        return;
      }
      stepCycle();
      cycleTimer = window.setInterval(stepCycle, 5500);
      creaturePosProvider = () => creature.getMotherPos();
    });

    return () => {
      alive = false;
      if (cycleTimer !== undefined) window.clearInterval(cycleTimer);
      if (reentryTimer !== undefined) window.clearTimeout(reentryTimer);
      creaturePosProvider = null;
      creature.stop();
    };
  }, []);

  return <div ref={hostRef} className="stage stage-creature" aria-hidden="true" />;
}
