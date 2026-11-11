import Hero from './components/Hero'
import Features from './components/Features'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { content } from './content'
import Button from './components/Button'
import { useEffect } from 'react'
import { animate } from 'animejs'

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
        <section className="section-pad" id="outcomes">
          <div className="site-width">
            <div className="section-heading">
              <span className="eyebrow">{content.outcomes.eyebrow}</span>
              <h2>{content.outcomes.title}</h2>
              <p>{content.outcomes.intro}</p>
            </div>
            <div className="outcome-panel">
              {content.outcomes.items.map((item, index) => <div className="outcome-row" key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><b aria-hidden="true">?</b></div>)}
              <p className="outcome-close">{content.outcomes.closing}</p>
              <Button href={content.cta.href}>{content.cta.label}</Button>
            </div>
          </div>
        </section>
        <section className="section-pad proof-section" id="testimonials">
          <div className="site-width proof-grid">
            <div><span className="eyebrow">Proof From The Community</span><h2>{content.proof.title}</h2><p>{content.proof.intro}</p><p className="placeholder-note">{content.proof.placeholder}</p></div>
            <div className="quote-placeholder"><span aria-hidden="true">“</span><p>{content.proof.placeholder}</p></div>
          </div>
        </section>
        <section className="section-pad" id="about">
          <div className="site-width host-card"><div className="host-avatar" aria-hidden="true">AS</div><div><span className="eyebrow">{content.about.eyebrow}</span><h2>{content.about.title}</h2><p>{content.about.bio}</p><p className="placeholder-note">{content.about.placeholder}</p></div></div>
        </section>
        <section className="section-pad guarantee-section">
          <div className="site-width">
            <div className="section-heading"><span className="eyebrow">{content.guarantee.eyebrow}</span><h2>{content.guarantee.title}</h2><p>{content.guarantee.intro}</p></div>
            <div className="guarantee-grid">{content.guarantee.options.map((item) => <article className="guarantee-card" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
            <p className="fine-print">{content.guarantee.note}</p>
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

