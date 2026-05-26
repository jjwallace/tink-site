import { useEffect, useRef, useState } from "react";
import { SiteVoiceAnchor } from "@shared/src/voice-anchor/site-anchor";
import { getCreaturePosProvider } from "./CreatureStage";
import { AnchorContextMenu } from "../ui/AnchorContextMenu";

/**
 * Mounts the SiteVoiceAnchor at a fixed position near the top of the
 * viewport. No scroll choreography, no entrance animation. Right-click
 * still pops the context menu.
 */
export function AnchorView() {
  const hostRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<((x: number, y: number) => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Pinned to the far-left of the viewport — bookend off the Hero's
    // left margin, partly off-screen is fine. Clears the title text.
    const ax = () => 10;
    const ay = () => 90;
    const anchor = new SiteVoiceAnchor(host, {
      x: ax(w),
      y: ay(),
      iconSrc: "/tink-concept-too-shiney.png",
    });
    anchor.setMotherPosProvider(() => getCreaturePosProvider()?.() ?? null);
    anchor.setContextMenuHandler((x, y) => openerRef.current?.(x, y));
    setReady(true);

    const onResize = () => {
      anchor.setPosition(ax(window.innerWidth), ay());
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      anchor.destroy();
    };
  }, []);

  return (
    <>
      <div ref={hostRef} className="anchor-host" aria-hidden="true" />
      {ready && (
        <AnchorContextMenu
          registerOpener={(fn) => {
            openerRef.current = fn;
            return () => {
              if (openerRef.current === fn) openerRef.current = null;
            };
          }}
        />
      )}
    </>
  );
}
