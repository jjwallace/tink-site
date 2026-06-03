const STEP_LABEL: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  color: "var(--accent, #a78bfa)",
  marginBottom: "6px",
  fontFamily: "var(--mono)",
};

const CODE: React.CSSProperties = {
  display: "block",
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  padding: "10px 14px",
  fontFamily: "var(--mono)",
  fontSize: "13px",
  color: "rgba(255,255,255,0.9)",
  userSelect: "all" as const,
  cursor: "text",
  marginTop: "6px",
  overflowX: "auto" as const,
};

const NOTE: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.45)",
  marginTop: "6px",
  lineHeight: 1.5,
  fontFamily: "var(--sans, system-ui, sans-serif)",
};

const steps = [
  {
    n: "01",
    title: "Download",
    body: (
      <>
        <p style={NOTE}>macOS · Apple Silicon (M1 – M4)</p>
        <a
          href="https://github.com/jjwallace/tink/releases/latest"
          style={{ ...CODE, textDecoration: "none", display: "inline-block", color: "#a78bfa" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/jjwallace/tink/releases/latest ↗
        </a>
      </>
    ),
  },
  {
    n: "02",
    title: "Install",
    body: (
      <>
        <p style={NOTE}>Open the DMG and drag Tink into Applications.</p>
        <p style={{ ...NOTE, marginTop: 8 }}>Then remove the quarantine flag — required because Tink isn't from the App Store:</p>
        <code style={CODE}>xattr -cr /Applications/Tink.app</code>
      </>
    ),
  },
  {
    n: "03",
    title: "Grant Accessibility",
    body: (
      <>
        <p style={NOTE}>
          Launch Tink. It opens System Settings automatically. Find Tink in the list and toggle it on.
        </p>
        <code style={CODE}>
          System Settings → Privacy &amp; Security → Accessibility
        </code>
        <p style={{ ...NOTE, marginTop: 8 }}>
          This is required for the push-to-talk hotkey to work system-wide.
        </p>
      </>
    ),
  },
  {
    n: "04",
    title: "Wait for models",
    body: (
      <>
        <p style={NOTE}>
          On first launch Tink downloads three local AI models (~200 MB total):
        </p>
        <ul style={{ ...NOTE, paddingLeft: "1.2em", marginTop: 6 }}>
          <li>Alba — Scottish voice (TTS)</li>
          <li>Moonshine Tiny — speech recognition (STT)</li>
          <li>SmolLM2 360M — narration summarizer</li>
        </ul>
        <p style={{ ...NOTE, marginTop: 8 }}>
          Open Settings from the tray icon to watch progress. Once downloaded, they live offline in
          <code style={{ fontFamily: "var(--mono)", fontSize: "11px", opacity: 0.7 }}> ~/Library/Application Support/com.wolfgames.tink/</code>
        </p>
      </>
    ),
  },
  {
    n: "05",
    title: "Set your hotkey",
    body: (
      <>
        <p style={NOTE}>
          Open Settings → Text to Speech → click the hotkey chiclet and press your chosen key.
          F-keys and arrow keys work bare. Letters/digits need a modifier (e.g. Cmd+Shift+Space).
        </p>
        <p style={{ ...NOTE, marginTop: 8 }}>
          Hold the key to speak. Release to paste the transcription.
        </p>
      </>
    ),
  },
];

import React from "react";

export function InstallGuide() {
  return (
    <section className="block install-block" style={{ maxWidth: 640, margin: "0 auto", padding: "48px 0" }}>
      <div style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        marginBottom: "24px",
        fontFamily: "var(--mono)",
      }}>
        // install_sequence
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: "flex", gap: "20px" }}>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              minWidth: "24px",
              paddingTop: "1px",
            }}>
              {s.n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={STEP_LABEL}>{s.title}</div>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
