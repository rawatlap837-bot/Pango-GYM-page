import { content } from '../content'
import Button from './Button'
import GymLogoCarousel from './GymLogoCarousel'
import HeroAtmosphere from './HeroAtmosphere'

/* Vimeo: https://vimeo.com/1246565018/4f1007867d
   The part after the video ID is the privacy hash, passed as ?h= in the embed URL. */
const VIMEO_ID = '1246565018'
const VIMEO_HASH = '4f1007867d'
const VIDEO_SRC = `https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_HASH}&autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1`

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

@media (max-width: 640px) {
  .hero > .hero-topbar {
    width: calc(100% - 32px);
    gap: 20px;
  }
  .hero > .hero-topbar .brand-mark {
    flex: 0 1 auto;
    min-width: 0;
  }
  .hero > .hero-topbar > .button-primary {
    flex: 0 0 auto;
    margin-left: auto;
  }
}

/* ---------- Video section ---------- */
.hero-video-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 12px;
  color: #ffe47a;
  font-size: 16px;
  font-weight: 800;
  font-family: cursive;
  text-transform: capitalize;
  text-align: center;
}
.hero-video-arrow {
  display: inline-flex;
  flex: 0 0 22px;
  width: 22px;
  height: 28px;
  color: #ffe47a;
  animation: hero-prompt-arrow 0.8s ease-in-out infinite alternate;
}
.hero-video-arrow:last-child {
  animation-delay: 0.2s;
}
.hero-video-arrow svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 5px #ffe47a66);
}
@keyframes hero-prompt-arrow {
  to { transform: translateY(5px); }
}
.hero-video {
  width: min(100%, 880px);
  margin-inline: auto;
}
.hero-action-below-video {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  width: min(100% - 36px, 880px);
  margin: 0 auto 28px;
  padding: 12px 18px;
  text-align: center;
}
.hero-action-below-video p { max-width: none; margin: 0; font-size: 16px; }
@media (max-width: 640px) {
  .hero-action-below-video {
    flex-direction: column;
    gap: 11px;
    width: calc(100% - 32px);
    margin-bottom: 22px;
    padding: 16px 12px;
  }
  .hero-action-below-video .button-primary { width: min(100%, 420px); }
  .hero-action-below-video p { font-size: 13px; }
}
.hero-subtitle {
  color: #fff;
  font-weight: 600;
}
.hero-video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background: #1a0b3d linear-gradient(135deg, #2c1368, #11062b);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: none;
}
.hero-video-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: #000;
}
`

export default function Hero() {
  const { eyebrow, headline, highlight, subheadline, note } = content.hero
  const parts = headline.split(highlight)

  return (
    <section className="hero" id="top">
      <style>{HERO_OVERLAY_CSS}</style>

      <HeroAtmosphere />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-decoration hero-decoration-one" aria-hidden="true" />
      <div className="hero-decoration hero-decoration-two" aria-hidden="true" />
      <div className="site-width hero-layout">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-light"><i />{eyebrow}</span>
          <h1>{parts[0]}<span>{highlight}</span>{parts[1]}</h1>
          <p className="hero-subtitle">{subheadline}</p>
        </div>

        <div className="hero-video">
          <p className="hero-video-prompt">
            <span className="hero-video-arrow" aria-hidden="true"><svg viewBox="0 0 24 32"><path d="M12 2v23M4 17l8 8 8-8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            Click Below To Watch First
            <span className="hero-video-arrow" aria-hidden="true"><svg viewBox="0 0 24 32"><path d="M12 2v23M4 17l8 8 8-8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </p>
          <div className="hero-video-frame">
            <iframe
              className="hero-video-iframe"
              src={VIDEO_SRC}
              title="Growth call video"
              loading="eager"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="hero-action hero-action-below-video">
        <Button href={content.cta.href}>{content.cta.label}</Button>
        <p>{note}</p>
      </div>
      <div className="hero-logos">
        <GymLogoCarousel />
      </div>
    </section>
  )
}
