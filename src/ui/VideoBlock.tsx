import { useState } from "react";
import { VIDEO } from "../lore";

/**
 * Inline transmission player. Shows a poster + play button until clicked,
 * then lazy-loads a YouTube iframe with branding suppressed.
 *
 * The lazy-load matters: the YouTube iframe pulls ~700 kB of player JS
 * the moment it mounts. Holding it behind a click keeps first paint fast.
 */
export function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}` +
    `?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;

  return (
    <section className="block video-block">
      <div className="video-frame">
        {playing ? (
          <iframe
            className="video-iframe"
            src={embedUrl}
            title="Intercepted transmission"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-poster"
            onClick={() => setPlaying(true)}
            aria-label="Play transmission"
          >
            <span className="video-play-icon" aria-hidden="true">
              <svg viewBox="0 0 28 28" width="40" height="40">
                <polygon points="9,6 23,14 9,22" fill="currentColor" />
              </svg>
            </span>
            <span className="video-play-label">PLAY TRANSMISSION</span>
          </button>
        )}
      </div>
      <div className="video-caption">{VIDEO.caption}</div>
    </section>
  );
}
