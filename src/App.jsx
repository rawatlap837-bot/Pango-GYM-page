import Hero from './components/Hero'
import Features from './components/Features'
import BeforeAfter from './components/BeforeAfter'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { content } from './content'
import Button from './components/Button'
import TestimonialCarousel, { VideoTestimonialCarousel } from './components/TestimonialCarousel'
import Guarantee from './components/Guarantee'
import MentorVideo from './components/MentorVideo'
import UrgencyNotice from './components/UrgencyNotice'
import { useEffect, useState } from 'react'
import { animate } from 'animejs'

export default function App() {
  const [showMobileCta, setShowMobileCta] = useState(false)
  const [visitSecondsLeft, setVisitSecondsLeft] = useState(120)

  useEffect(() => {
    let intervalId
    intervalId = window.setInterval(() => {
      setVisitSecondsLeft((remaining) => {
        if (remaining <= 1) return 120
        return remaining - 1
      })
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileCta(!entry.isIntersecting)
    })

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const visitTimer = `${Math.floor(visitSecondsLeft / 60)}:${String(visitSecondsLeft % 60).padStart(2, '0')}`

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
      <UrgencyNotice />
      <main>
        <Hero />
        <Features />
        <section className="section-pad proof-section" id="testimonials">
          <div className="site-width proof-gallery-layout">
            <header className="proof-gallery-heading">
              <h2>{content.proof.title}</h2>
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
          <div className="site-width host-card">
            <header className="host-intro">
              <h2 className="host-section-heading">{content.about.eyebrow}</h2>
            </header>
            <div className="host-portrait-wrap">
              <img className="host-avatar" src="/Mentor.png" alt={content.about.title} loading="lazy" decoding="async" />
            </div>
            <div className="host-profile-copy">
              <h3>{content.about.title}</h3>
              <span className="host-role">Gym Growth Mentor &amp; Business Strategist</span>
              <p className="host-bio">{content.about.bio.map((part, index) => part.highlight ? <strong className="host-bio-highlight" key={index}>{part.text}</strong> : <span key={index}>{part.text}</span>)}</p>
              <div className="host-proof-points"><span><b>20+</b> Years Experience</span><span><b>1000s</b> Gym Businesses</span><span><b>Growth</b> Focused Strategies</span></div>
              <MentorVideo />
            </div>
            <Button href={content.cta.href}>{content.cta.label}</Button>
          </div>
        </section>
        <BeforeAfter />
        <Contact />
        <Guarantee />

        <Faq />
      </main>
      <Footer />
      {showMobileCta && (
        <div className="mobile-cta">
          <Button className="mobile-cta-button" href={content.cta.href}>
            <span className="mobile-cta-content">
              <span className="mobile-cta-label">Register Now</span>
              <span className="mobile-cta-meta">
                <del>₹2,999</del>
                <span>Only <strong className="mobile-cta-price">₹97</strong></span>
                <span aria-hidden="true">·</span>
                <span aria-label={`Visit timer: ${visitTimer} remaining`}>Visit timer {visitTimer}</span>
              </span>
            </span>
          </Button>
        </div>
      )}
    </>
  )
}

