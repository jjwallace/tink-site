import { useEffect, useRef } from "react";
import { Creature } from "@shared/src/creature";
import { S } from "@shared/src/creature/store";

let creaturePosProvider: (() => { x: number; y: number; hue: number } | null) | null = null;
export function getCreaturePosProvider() {
  return creaturePosProvider;
}

/**
 * Mounts the real Pixi creature and dispatches a single idle-figure8 so
 * Tink swims in the center of the page. No scroll choreography — the
 * page is one viewport.
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

    creature.start(host).then(() => {
      if (!alive) {
        creature.stop();
        return;
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      creature.dispatch({
        type: "idle-figure8",
        target: { x: cx, y: cy * 1.05 },
        radius: 320,
        speed: 0.65,
      });
      creaturePosProvider = () => creature.getMotherPos();
    });

    return () => {
      alive = false;
      creaturePosProvider = null;
      creature.stop();
    };
  }, []);

  return <div ref={hostRef} className="stage stage-creature" aria-hidden="true" />;
}
