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

  // Minimal chrome: play + scrub bar, nothing else.
  //   modestbranding=1   no YouTube logo on the control bar
  //   rel=0              no related-video grid at the end
  //   iv_load_policy=3   no annotations
  //   cc_load_policy=0   no captions
  //   fs=0               no fullscreen button
  //   disablekb=1        no keyboard handlers
  //   playsinline=1      inline on iOS
  // The title overlay at the top is part of YouTube's player chrome and
  // can't be turned off via params — a CSS mask (.video-title-mask) hides
  // it on top of the iframe.
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}` +
    `?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3` +
    `&cc_load_policy=0&fs=0&disablekb=1&playsinline=1` +
    `&start=${VIDEO.startSeconds ?? 0}`;

  return (
    <section className="block video-block">
      <div className="video-frame">
        {playing ? (
          <>
            <iframe
              className="video-iframe"
              src={embedUrl}
              title="Intercepted transmission"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
            <div className="video-title-mask" aria-hidden="true" />
          </>
        ) : (
          <button
            type="button"
            className="video-poster"
            onClick={() => setPlaying(true)}
            aria-label="Play transmission"
          >
            <img
              className="video-poster-thumb"
              src={`https://img.youtube.com/vi/${VIDEO.youtubeId}/maxresdefault.jpg`}
              alt=""
              aria-hidden="true"
            />
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
