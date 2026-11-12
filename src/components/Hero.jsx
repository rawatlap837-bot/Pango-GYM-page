import { content } from '../content'
import Button from './Button'
import GymLogoCarousel from './GymLogoCarousel'
import HeroAtmosphere from './HeroAtmosphere'

export default function Hero() {
  const { eyebrow, headline, highlight, subheadline, videoLabel, videoNote, note } = content.hero
  const parts = headline.split(highlight)

  return (
    <section className="hero" id="top">
      <HeroAtmosphere />
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
        <div className="workshop-visual">
          <div className="video-frame">
            <div className="video-toolbar"><span><i /><i /><i /></span><small>{videoLabel}</small><b>01:30</b></div>
            <div className="video-screen">
              <div className="video-grid" aria-hidden="true" />
              <div className="play-button" aria-label="Workshop video preview" />
              <span className="video-caption">{videoNote}</span>
            </div>
          </div>
          <div className="float-chip chip-one"><span>04</span> Four Clear Steps</div>
          <div className="float-chip chip-two"><span>GYM</span> Built For Gym Owners</div>
          <div className="visual-caption"><span>WORKSHOP OVERVIEW</span><b>Strategy. Clarity. Sustainable Growth.</b></div>
        </div>
      </div>
      <GymLogoCarousel />
    </section>
  )
}
