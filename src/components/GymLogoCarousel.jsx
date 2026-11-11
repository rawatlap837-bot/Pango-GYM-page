import { content } from '../content'

function LogoTrack({ items, direction = 'left' }) {
  return (
    <div className={`gym-logo-track gym-logo-track-${direction}`}>
      {[0, 1].map((copy) => (
        <div className="gym-logo-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
          {items.map((logo, index) => (
            <div className="gym-logo-card" key={`${copy}-${logo.src}-${index}`}>
              <img src={logo.src} alt={copy === 0 ? logo.name : ''} loading="lazy" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function GymLogoCarousel() {
  const { items } = content.gymLogos
  const firstLane = items.filter((_, index) => index % 2 === 0)
  const secondLane = items.filter((_, index) => index % 2 === 1)

  return (
    <section className="gym-logos-section" aria-label="Gym Logos">
      <div className="gym-logo-marquee">
        <LogoTrack items={firstLane} direction="left" />
        <LogoTrack items={secondLane} direction="right" />
      </div>
    </section>
  )
}
