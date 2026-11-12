import { useEffect, useRef } from 'react'
import { content } from '../content'
import Button from './Button'
import LineIcon from './LineIcon'

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/* Styles for the mobile deck effect. Only affects .steps-grid on screens under 768px. */
const DECK_CSS = `
@media (max-width: 767px) {
  .workshop-section .steps-grid.deck-steps {
    --deck-top: 94px;          /* height of your sticky navbar; increase if cards hide under it */
    --deck-solid: #2c1368;     /* solid colour behind each card; match your card purple */

    display: block !important;     /* cancels the old horizontal swipe layout */
    overflow: visible !important;
    scroll-snap-type: none !important;
    gap: 0 !important;
    padding-bottom: 12px !important;
  }

  .workshop-section .steps-grid.deck-steps > .step-card {
    position: sticky !important;
    top: calc(var(--deck-top) + var(--i) * 14px) !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: none !important;
    flex: none !important;
    margin: 0 0 16px !important;
    scroll-snap-align: none !important;

    /* solid base so cards fully cover each other; your gradient stays on top */
    background-color: var(--deck-solid) !important;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.35);

    transform: scale(var(--deck-scale, 1));
    transform-origin: center top;
    filter: brightness(var(--deck-bright, 1));
    will-change: transform, filter;
  }

  .workshop-section .steps-swipe-hint { display: none !important; }
  .workshop-section .workshop-bottom { padding-bottom: 76px; }
}

@media (prefers-reduced-motion: reduce) {
  .workshop-section .steps-grid.deck-steps > .step-card {
    transform: none !important;
    filter: none !important;
  }
}
`

/*
  Mobile deck effect for the workshop cards.
  1. Switches overflow hidden/auto/scroll on parent elements to "clip"
     (those silently break position: sticky), and restores them on cleanup.
  2. As the next card slides over a card, that card shrinks and darkens.
*/
function useDeckScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mobile = window.matchMedia(MOBILE_QUERY)
    const reduced = window.matchMedia(REDUCED_QUERY)
    let frame = 0
    let changed = []

    const unblockSticky = () => {
      let node = el.parentElement
      while (node) {
        const s = getComputedStyle(node)
        const blocks = [s.overflowX, s.overflowY].some(
          (v) => v === 'hidden' || v === 'auto' || v === 'scroll'
        )
        if (blocks) {
          const isRoot = node === document.body || node === document.documentElement
          changed.push([node, node.style.overflowX, node.style.overflowY])
          node.style.overflowX = 'clip'
          if (!isRoot) node.style.overflowY = 'clip'
        }
        node = node.parentElement
      }
    }

    const revert = () => {
      changed.forEach(([node, x, y]) => {
        node.style.overflowX = x
        node.style.overflowY = y
      })
      changed = []
    }

    const update = () => {
      frame = 0
      const cards = Array.from(el.children)
      const active = mobile.matches && !reduced.matches

      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!active || !next) {
          card.style.removeProperty('--deck-scale')
          card.style.removeProperty('--deck-bright')
          return
        }
        const stickyTop = parseFloat(getComputedStyle(card).top) || 0
        const distance = next.getBoundingClientRect().top - stickyTop
        const span = Math.min(card.offsetHeight, 320)
        const progress = Math.min(1, Math.max(0, 1 - distance / span))

        card.style.setProperty('--deck-scale', String(1 - progress * 0.06))
        card.style.setProperty('--deck-bright', String(1 - progress * 0.35))
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const sync = () => {
      revert()
      if (mobile.matches) unblockSticky()
      update()
    }

    sync()
    mobile.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    window.addEventListener('resize', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })

    return () => {
      mobile.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scroll', onScroll, { capture: true })
      if (frame) cancelAnimationFrame(frame)
      revert()
    }
  }, [])

  return ref
}

export default function Features() {
  const stepsRef = useDeckScroll()

  return (
    <>
      <style>{DECK_CSS}</style>

      {/* ---------- FIT SECTION (unchanged) ---------- */}
      <section id="fit" className="section-pad fit-section">
        <div className="site-width">
          <div className="section-heading"><span className="eyebrow">{content.fit.eyebrow}</span><h2>{content.fit.title}</h2><p>{content.fit.intro}</p></div>
          <div className="pain-list">{content.fit.pains.map((item, i) => {
            const phrase = content.fit.painEmphasis[i]
            const [before, after = ''] = item.split(phrase)
            return <article className="pain-item" key={item}><span className="pain-index">0{i + 1}</span><p>{before}<strong className="pain-emphasis">{phrase}</strong>{after}</p><span className="pain-mark"><LineIcon name={content.fit.painIcons[i]} className="pain-line-icon" /></span></article>
          })}</div>
          <p className="fit-transition">{content.fit.transition}</p>
          <div className="center-action"><Button href={content.cta.href}>{content.cta.label}</Button></div>
        </div>
      </section>

      {/* ---------- WORKSHOP SECTION (deck scroll on mobile) ---------- */}
      <section id="workshop" className="section-pad workshop-section">
        <div className="site-width">
          <div className="section-heading"><span className="eyebrow">{content.workshop.eyebrow}</span><h2>{content.workshop.title}</h2><p>{content.workshop.intro}</p></div>

          <div className="steps-grid deck-steps" ref={stepsRef} aria-label="Workshop Steps">
            {content.workshop.steps.map((step, index) => {
              const [titleBefore, titleAfter = ''] = step.title.split(step.highlight)
              const [textBefore, textAfter = ''] = step.text.split(step.textHighlight)
              return (
                <article className="step-card" key={step.number} style={{ '--i': index }}>
                  <span className="step-number"><i><LineIcon name={content.workshop.stepIcons[index]} className="step-line-icon" /></i></span>
                  <div className="step-rule" />
                  <h3>{titleBefore}<span className="step-highlight">{step.highlight}</span>{titleAfter}</h3>
                  <p>{textBefore}<strong>{step.textHighlight}</strong>{textAfter}</p>
                </article>
              )
            })}
          </div>

          <div className="workshop-bottom"><p>{content.workshop.ctaNote}</p><Button href={content.cta.href}>{content.cta.label}</Button></div>
        </div>
      </section>
    </>
  )
}
