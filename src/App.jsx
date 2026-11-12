import Hero from './components/Hero'
import Features from './components/Features'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { content } from './content'
import Button from './components/Button'
import LineIcon from './components/LineIcon'
import TestimonialCarousel, { VideoTestimonialCarousel } from './components/TestimonialCarousel'
import { useEffect } from 'react'
import { animate } from 'animejs'

function emphasizeText(text, phrases = []) {
  const remaining = text
  const matches = phrases
    .map((phrase) => ({ phrase, index: remaining.indexOf(phrase) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index)

  if (!matches.length) return text
  const parts = []
  let cursor = 0
  matches.forEach(({ phrase, index }) => {
    if (index < cursor) return
    parts.push(text.slice(cursor, index), <strong key={`${index}-${phrase}`}>{phrase}</strong>)
    cursor = index + phrase.length
  })
  parts.push(text.slice(cursor))
  return parts
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const isIcon = entry.target.matches('.pain-line-icon, .step-line-icon')
        const isStepCard = entry.target.matches('.step-card')
        const cardIndex = isStepCard ? Array.from(document.querySelectorAll('.step-card')).indexOf(entry.target) : 0
        animate(entry.target, isIcon ? {
          opacity: [0, 1],
          scale: [0.55, 1],
          rotate: [-12, 0],
          duration: 520,
          ease: 'out(3)',
        } : isStepCard ? {
          opacity: [0, 1],
          translateY: [22, 0],
          scale: [0.97, 1],
          duration: 620,
          delay: cardIndex * 90,
          ease: 'out(3)',
        } : {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 520,
          ease: 'out(3)',
        })
        activeObserver.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    const textElements = document.querySelectorAll('main h1, main h2, main h3, main p, main .eyebrow')
    const icons = document.querySelectorAll('main .pain-line-icon, main .step-line-icon')
    const stepCards = document.querySelectorAll('main .step-card')
    textElements.forEach((element) => observer.observe(element))
    icons.forEach((element) => observer.observe(element))
    stepCards.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <main>
        <Hero />
        <Features />
        <section className="section-pad outcomes-section" id="outcomes">
          <div className="site-width">
            <div className="section-heading">
              <h2>{content.outcomes.title}</h2>
            </div>
            <div className="outcome-panel">
              {content.outcomes.items.map((item, index) => <div className="outcome-row" key={item}><span className="outcome-index">{String(index + 1).padStart(2, '0')}</span><p>{item}</p><b aria-hidden="true"><LineIcon name={['chart', 'users', 'wallet', 'target', 'route'][index]} className="outcome-icon" /></b></div>)}
              <p className="outcome-close">{content.outcomes.closing}</p>
              <Button href={content.cta.href}>{content.cta.label}</Button>
            </div>
          </div>
        </section>
        <section className="section-pad proof-section" id="testimonials">
          <div className="site-width proof-gallery-layout">
            <header className="proof-gallery-heading">
              <span className="eyebrow">Proof From The Community</span>
              <h2>{content.proof.title}</h2>
              <p>{content.proof.intro}</p>
            </header>
            <TestimonialCarousel />
            <div className="proof-video-heading">
              <span className="eyebrow">Video Testimonials</span>
              <h3>Watch Gym Owners Share Their Results</h3>
            </div>
            <VideoTestimonialCarousel />
          </div>
        </section>
        <section className="section-pad" id="about">
          <div className="site-width host-card"><span className="host-eyebrow eyebrow">{content.about.eyebrow}</span><img className="host-avatar" src="/Mentor.JPG" alt={content.about.title} loading="lazy" decoding="async" /><div><span className="host-info-eyebrow eyebrow">{content.about.eyebrow}</span><h2>{content.about.title}</h2><p className="host-bio">{content.about.bio.map((part, index) => part.highlight ? <strong className="host-bio-highlight" key={index}>{part.text}</strong> : <span key={index}>{part.text}</span>)}</p></div></div>
        </section>
        <section className="section-pad guarantee-section">
          <div className="site-width">
            <div className="section-heading"><span className="eyebrow">{content.guarantee.eyebrow}</span><h2>{content.guarantee.title}</h2><p>{content.guarantee.intro}</p></div>
            <div className="guarantee-grid">{content.guarantee.options.map((item) => <article className="guarantee-card" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{emphasizeText(item.text, item.emphasis)}</p><img className="guarantee-illustration" src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" /></article>)}</div>
            <p className="fine-print">{emphasizeText(content.guarantee.note, content.guarantee.noteEmphasis)}</p>
            <div className="center-action"><Button href={content.cta.href}>{content.cta.label}</Button></div>
          </div>
        </section>
        <Contact />
        <Faq />
      </main>
      <Footer />
      <div className="mobile-cta"><Button href={content.cta.href}>{content.cta.label}</Button></div>
    </>
  )
}

