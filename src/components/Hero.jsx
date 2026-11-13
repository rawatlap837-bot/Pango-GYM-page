import { useEffect, useState } from 'react'
import { content } from '../content'
import Button from './Button'
import GymLogoCarousel from './GymLogoCarousel'
import HeroAtmosphere from './HeroAtmosphere'

/* Vimeo: https://vimeo.com/1246565018/4f1007867d
   The part after the video ID is the privacy hash, passed as ?h= in the embed URL. */
const VIMEO_URL = 'https://vimeo.com/1246565018/4f1007867d'
const VIMEO_ID = '1246565018'
const VIMEO_HASH = '4f1007867d'
const VIDEO_SRC = `https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_HASH}&autoplay=1&title=0&byline=0&portrait=0&dnt=1`
const OEMBED_URL = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(VIMEO_URL)}&width=1280`

/* Optional: put your own thumbnail here (e.g. '/video-thumbnail.jpg' from /public).
   If left empty, the thumbnail is loaded automatically from Vimeo. */
const CUSTOM_THUMBNAIL = ''

/* ================================================================
   Overlay styles. Edit the variables in the first block.
   ================================================================ */
const HERO_OVERLAY_CSS = `
.hero {
  --hero-overlay-color: 44, 19, 104;   /* R, G, B of your overlay colour (deep purple) */
  --hero-overlay-top: 0.5;             /* 50% transparent at the top */
  --hero-overlay-bottom: 0.5;          /* 50% transparent at the bottom */
  position: relative;
}

/* colour overlay on top of the background, below the content */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(900px 480px at 80% 10%, rgba(139, 92, 246, 0.35), transparent 70%),
    linear-gradient(
      180deg,
      rgba(var(--hero-overlay-color), var(--hero-overlay-top)) 0%,
      rgba(var(--hero-overlay-color), var(--hero-overlay-bottom)) 100%
    );
}

/* everything real sits above the overlay */
.hero > .hero-topbar,
.hero > .hero-glow,
.hero > .hero-decoration,
.hero > .hero-layout,
.hero > .hero-logos {
  position: relative;
  z-index: 2;
}
/* glow and decorations are decorative shapes: keep them absolute if your CSS positions them that way */
.hero > .hero-glow,
.hero > .hero-decoration {
  position: absolute;
}

/* ---------- Video section ---------- */
.hero-video {
  width: min(100%, 880px);
  margin-inline: auto;
}
.hero-video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background: #1a0b3d linear-gradient(135deg, #2c1368, #11062b);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 60px rgba(6, 2, 20, 0.55);
}
.hero-video-thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-video-play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(10, 4, 30, 0.05), rgba(10, 4, 30, 0.35));
}
.hero-video-play-icon {
  display: grid;
  place-items: center;
  width: clamp(56px, 9vw, 84px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: #f2c92b;
  color: #1a0b3d;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  transition: transform 0.2s ease;
}
.hero-video-play:hover .hero-video-play-icon { transform: scale(1.08); }
.hero-video-play:focus-visible { outline: 3px solid #fff; outline-offset: -6px; }
.hero-video-play-icon svg { display: block; width: 44%; height: 44%; }
.hero-video-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: #000;
}
@media (prefers-reduced-motion: reduce) {
  .hero-video-play-icon { transition: none; }
}
`

export default function Hero() {
  const { eyebrow, headline, highlight, subheadline, note } = content.hero
  const parts = headline.split(highlight)
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnail, setThumbnail] = useState(CUSTOM_THUMBNAIL)

  // Load the thumbnail from Vimeo unless a custom one is set
  useEffect(() => {
    if (CUSTOM_THUMBNAIL) return
    const controller = new AbortController()
    fetch(OEMBED_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('oEmbed failed'))))
      .then((data) => setThumbnail(data.thumbnail_url || ''))
      .catch(() => { }) // falls back to the purple gradient
    return () => controller.abort()
  }, [])

  return (
    <section className="hero" id="top">
      <style>{HERO_OVERLAY_CSS}</style>

      <HeroAtmosphere />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="site-width hero-topbar">
        <a href="#top" className="brand-mark">
          <span className="brand-icon" aria-hidden="true">G</span>
          <span>{content.brand}<small>WITH AZHAR ALI SAYED</small></span>
        </a>
        <Button href={content.cta.href} arrow={false}>{content.cta.navLabel}</Button>
      </div>
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-decoration hero-decoration-one" aria-hidden="true" />
      <div className="hero-decoration hero-decoration-two" aria-hidden="true" />
      <div className="site-width hero-layout">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-light"><i />{eyebrow}</span>
          <h1>{parts[0]}<span>{highlight}</span>{parts[1]}</h1>
          <p className="hero-subtitle">{subheadline}</p>
          <div className="hero-action">
            <Button href={content.cta.href}>{content.cta.label}</Button>
            <p>{note}</p>
          </div>
        </div>

        <div className="hero-video">
          <div className="hero-video-frame">
            {isPlaying ? (
              <iframe
                className="hero-video-iframe"
                src={VIDEO_SRC}
                title="Growth call video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {thumbnail && (
                  <img className="hero-video-thumb" src={thumbnail} alt="" loading="eager" decoding="async" />
                )}
                <button
                  type="button"
                  className="hero-video-play"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play growth call video"
                >
                  <span className="hero-video-play-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8 5 8 19 19 12" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hero-logos">
        <GymLogoCarousel />
      </div>
    </section>
  )
}