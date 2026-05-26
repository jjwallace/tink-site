import { useEffect, useState, useCallback } from "react";
import { setSfxMuted } from "../audio/sfx";
import { setMuted as setSynthMuted } from "../audio/voice";

interface MenuState {
  open: boolean;
  x: number;
  y: number;
}

interface PerfWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

function readHeap(): string {
  const p = performance as PerfWithMemory;
  if (!p.memory) return "Heap: —";
  const mb = p.memory.usedJSHeapSize / (1024 * 1024);
  if (mb >= 900) return `Heap: ${(mb / 1024).toFixed(2)} GB`;
  return `Heap: ${mb.toFixed(0)} MB`;
}

/**
 * Right-click menu on the anchor — adapted from the native tray menu
 * (tray.rs). Items are the same shape; actions translate to website-
 * appropriate behavior (Pause mutes site audio, Quit smooth-scrolls to
 * footer, etc.). Styling mimics a macOS context menu.
 */
export function AnchorContextMenu(props: {
  registerOpener: (fn: (x: number, y: number) => void) => () => void;
}) {
  const [state, setState] = useState<MenuState>({ open: false, x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const [heapLabel, setHeapLabel] = useState(readHeap());
  const [toast, setToast] = useState<string | null>(null);

  const open = useCallback((x: number, y: number) => {
    setHeapLabel(readHeap());
    setState({ open: true, x, y });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  useEffect(() => {
    return props.registerOpener(open);
  }, [props, open]);

  useEffect(() => {
    if (!state.open) return;
    const onDoc = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt?.closest(".anchor-context-menu")) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [state.open, close]);

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    setSfxMuted(next);
    setSynthMuted(next);
    setHeapLabel(readHeap());
  };

  const flashToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2400);
  };

  const onSettings = () => {
    flashToast("No settings. T.I.N.K configures itself.");
    close();
  };
  const onCheckUpdates = () => {
    flashToast("Running latest classified build.");
    close();
  };
  const onQuit = () => {
    close();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      {state.open && (
        <div
          className="anchor-context-menu"
          role="menu"
          style={{ left: state.x, top: state.y }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className={`acm-item acm-check ${paused ? "acm-on" : ""}`}
            onClick={togglePause}
          >
            <span className="acm-check-mark">{paused ? "✓" : " "}</span>
            <span>Pause</span>
          </button>
          <button type="button" className="acm-item acm-status" onClick={() => setHeapLabel(readHeap())}>
            <span className="acm-check-mark"> </span>
            <span>{heapLabel}</span>
          </button>
          <div className="acm-sep" />
          <button type="button" className="acm-item" onClick={onSettings}>
            <span className="acm-check-mark"> </span>
            <span>Settings…</span>
          </button>
          <div className="acm-sep" />
          <button type="button" className="acm-item" onClick={onCheckUpdates}>
            <span className="acm-check-mark"> </span>
            <span>Check for Updates…</span>
          </button>
          <div className="acm-sep" />
          <button type="button" className="acm-item" onClick={onQuit}>
            <span className="acm-check-mark"> </span>
            <span>Quit</span>
          </button>
        </div>
      )}
      {toast && <div className="acm-toast">{toast}</div>}
    </>
  );
}
