const APPLE = (
  <svg viewBox="0 0 24 24" width="28" height="28">
    <path
      fill="currentColor"
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"
    />
  </svg>
);

const WINDOWS = (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <path
      fill="currentColor"
      d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"
    />
  </svg>
);

const LINUX = (
  <svg viewBox="0 0 32 32" width="28" height="28">
    {/* Tux silhouette: head + body in currentColor, belly white, beak + feet orange */}
    <ellipse cx="16" cy="20" rx="9" ry="10" fill="currentColor" />
    <ellipse cx="16" cy="9" rx="6" ry="6.5" fill="currentColor" />
    <ellipse cx="16" cy="22" rx="4.5" ry="7" fill="#f4f4f4" />
    <ellipse cx="13.2" cy="8.2" rx="1.6" ry="2" fill="#f4f4f4" />
    <ellipse cx="18.8" cy="8.2" rx="1.6" ry="2" fill="#f4f4f4" />
    <circle cx="13.4" cy="8.6" r="0.85" fill="#111" />
    <circle cx="18.6" cy="8.6" r="0.85" fill="#111" />
    <path d="M13.6 11.5 L16 13.6 L18.4 11.5 Z" fill="#ff9a2e" />
    <ellipse cx="11" cy="30" rx="3.4" ry="1.5" fill="#ff9a2e" />
    <ellipse cx="21" cy="30" rx="3.4" ry="1.5" fill="#ff9a2e" />
  </svg>
);

const DOWNLOAD_GLYPH = (
  <svg viewBox="0 0 16 16" width="14" height="14">
    <path
      d="M8 1 L8 11 M3 7 L8 12 L13 7 M2 14 L14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    />
  </svg>
);

const RELEASE_URL = "https://github.com/jjwallace/tink/releases/latest/download/Tink_0.2.0_aarch64.dmg";

export function DownloadCTA() {
  return (
    <section className="block download-block">
      <a href={RELEASE_URL} className="download-btn">
        <span className="download-glyph" aria-hidden="true">
          {DOWNLOAD_GLYPH}
        </span>
        <span>Download for Mac</span>
        <span className="download-platform" aria-label="macOS">{APPLE}</span>
      </a>

      <span className="download-btn is-disabled" aria-disabled="true">
        <span className="download-glyph" aria-hidden="true">
          {DOWNLOAD_GLYPH}
        </span>
        <span>Coming Soon</span>
        <span className="download-platform" aria-label="Windows">{WINDOWS}</span>
      </span>

      <span className="download-btn is-disabled" aria-disabled="true">
        <span className="download-glyph" aria-hidden="true">
          {DOWNLOAD_GLYPH}
        </span>
        <span>Coming Soon</span>
        <span className="download-platform" aria-label="Linux">{LINUX}</span>
      </span>
    </section>
  );
}
