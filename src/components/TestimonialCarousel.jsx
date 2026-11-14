import { useEffect, useRef, useState } from 'react'
import { content } from '../content'

const SPEED = 32          // auto-scroll speed in pixels per second
const VIDEO_SPEED = SPEED // keep video testimonials moving at the same pace as image testimonials
const RESUME_DELAY = 1500 // ms without user activity before auto-scroll restarts
const ACTIVE_COPY = 1     // the middle copy is the "real" one: it is interactive and visible on load

/* ---------- desktop layout (PC only) ---------- */
const DESKTOP_MIN_WIDTH = 1024 // px - at or above this width the cards-per-view rule applies
const IMAGES_PER_VIEW = 4      // image testimonials visible at once on PC
const VIDEOS_PER_VIEW = 3      // video testimonials visible at once on PC
const CARD_GAP = 24            // px between cards on PC

// Each card gets an equal share of the carousel width, so exactly N cards fit on screen.
// Below DESKTOP_MIN_WIDTH nothing here applies, so phones/tablets keep your existing CSS.
const CARD_WIDTH = 'calc((100cqw - (var(--proof-cards) - 1) * var(--proof-gap)) / var(--proof-cards))'
const LAYOUT_CSS = `
@media (min-width: ${DESKTOP_MIN_WIDTH}px) {
  .proof-carousel.proof-carousel--images { --proof-cards: ${IMAGES_PER_VIEW}; }
  .proof-carousel.proof-carousel--videos { --proof-cards: ${VIDEOS_PER_VIEW}; }

  .proof-carousel.proof-carousel--images,
  .proof-carousel.proof-carousel--videos {
    --proof-gap: ${CARD_GAP}px;
    container-type: inline-size;
  }

  .proof-carousel.proof-carousel--images .proof-carousel-track,
  .proof-carousel.proof-carousel--videos .proof-carousel-track {
    display: flex;
    gap: 0;
    width: max-content;
  }

  /* padding-right keeps the spacing equal where the loop repeats */
  .proof-carousel.proof-carousel--images .proof-carousel-set,
  .proof-carousel.proof-carousel--videos .proof-carousel-set {
    display: flex;
    flex: none;
    gap: var(--proof-gap);
    padding-right: var(--proof-gap);
  }

  .proof-carousel.proof-carousel--images .proof-image-card,
  .proof-carousel.proof-carousel--videos .proof-video-card {
    flex: 0 0 ${CARD_WIDTH};
    width: ${CARD_WIDTH};
    min-width: 0;
    max-width: none;
  }
}
`

/* ------------------------------------------------------------------ */
/*  Shared auto-scroll hook                                            */
/*  - scrolls continuously (left -> right through the cards)           */
/*  - loops forever using 3+ copies of the cards                       */
/*  - pauses ONLY on user interaction, then resumes by itself          */
/* ------------------------------------------------------------------ */
function useAutoScroll({
  speed = SPEED,
  pauseOnHover = false,        // pause while a mouse is over the carousel (desktop)
  respectReducedMotion = true, // honour the OS "reduce motion" setting
} = {}) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [copies, setCopies] = useState(3)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let cycle = 0        // width of ONE full set of cards (the loop length)
    let pos = 0          // our own precise scroll position (can be fractional)
    let lastWritten = 0  // last position we wrote from code, to tell our scrolls from the user's
    let lastTime = 0
    let raf = 0
    let resumeAt = 0     // auto-scroll stays paused until this time
    let touching = false
    let dragging = false
    let moved = false
    let hovered = false
    let keyboardFocus = false
    let inView = true
    let startX = 0
    let lastX = 0

    // Make sure CSS can't fight the animation (smooth-scroll or snapping breaks it)
    viewport.style.scrollBehavior = 'auto'
    viewport.style.scrollSnapType = 'none'
    viewport.style.overscrollBehaviorX = 'contain'

    const holdOff = () => { resumeAt = performance.now() + RESUME_DELAY }

    /* ---------- measure one loop length ---------- */
    const measure = () => {
      const sets = track.children
      if (sets.length < 2) return
      // distance between the start of set 0 and set 1 (includes any gap)
      const next = sets[1].getBoundingClientRect().left - sets[0].getBoundingClientRect().left
      if (next <= 0) return

      // make sure there is always enough content to scroll through, even on wide screens
      const needed = Math.max(3, Math.ceil(viewport.clientWidth / next) + 2)
      setCopies((n) => (n === needed ? n : needed))

      const prev = cycle
      cycle = next
      if (!prev) {
        // start in the middle set so we can scroll both directions
        viewport.scrollLeft = cycle
        pos = cycle
        lastWritten = cycle
      } else if (Math.abs(prev - next) > 0.5) {
        // size changed (resize / images loaded): keep the same visual spot
        const x = (viewport.scrollLeft * next) / prev
        viewport.scrollLeft = x
        pos = x
        lastWritten = x
      }
    }

    /* ---------- auto-scroll loop ---------- */
    const tick = (time) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(time - (lastTime || time), 50)
      lastTime = time

      if (!cycle) return

      const userBusy =
        touching || dragging || keyboardFocus || (pauseOnHover && hovered) || time < resumeAt

      if (userBusy) {
        // follow wherever the user took the carousel, so we resume from that spot
        pos = viewport.scrollLeft
        return
      }

      if (!inView || document.hidden) return
      if (respectReducedMotion && reducedMotion.matches) return

      // if something else moved the scroll, continue from there
      if (Math.abs(pos - viewport.scrollLeft) > 2) pos = viewport.scrollLeft

      pos += (speed * dt) / 1000
      if (pos >= cycle * 1.5) pos -= cycle
      viewport.scrollLeft = pos
      lastWritten = pos
    }

    /* ---------- infinite loop for manual scrolling ---------- */
    const onScroll = () => {
      const x = viewport.scrollLeft
      // not our own write, so the user is scrolling
      if (Math.abs(x - lastWritten) > 2) holdOff()
      if (!cycle) return

      if (x < cycle * 0.5 || x >= cycle * 1.5) {
        const nx = x < cycle * 0.5 ? x + cycle : x - cycle
        viewport.scrollLeft = nx
        pos = nx
        lastWritten = nx
      }
    }

    /* ---------- touch (phones / tablets) ---------- */
    const onTouchStart = () => { touching = true }
    const onTouchEnd = () => { touching = false; holdOff() }

    /* ---------- mouse: hover pause + drag to scroll on desktop ---------- */
    const onPointerEnter = (e) => { if (e.pointerType === 'mouse') hovered = true }
    const onPointerLeave = (e) => {
      if (e.pointerType !== 'mouse') return
      hovered = false
      holdOff()
    }
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      moved = false
      startX = lastX = e.clientX
    }
    const onPointerMove = (e) => {
      if (!dragging) return
      if (!moved && Math.abs(e.clientX - startX) < 4) return
      moved = true
      viewport.style.cursor = 'grabbing'
      viewport.style.userSelect = 'none'
      viewport.scrollLeft -= e.clientX - lastX
      lastX = e.clientX
    }
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      viewport.style.cursor = ''
      viewport.style.userSelect = ''
      holdOff()
    }
    // after a drag, don't open the link under the cursor
    const onClick = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    const onDragStart = (e) => e.preventDefault()

    /* ---------- trackpad / wheel / keyboard focus ---------- */
    const onWheel = () => holdOff()
    const onFocusIn = (e) => {
      // pause only for keyboard focus, not after a mouse click on a card
      if (e.target.matches && e.target.matches(':focus-visible')) keyboardFocus = true
    }
    const onFocusOut = () => { keyboardFocus = false; holdOff() }

    /* ---------- only animate while visible ---------- */
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting })
      : null
    if (io) io.observe(viewport)

    /* ---------- re-measure when sizes change ---------- */
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    if (ro) {
      ro.observe(viewport)
      if (track.children[0]) ro.observe(track.children[0])
    } else {
      window.addEventListener('resize', measure)
    }

    measure()
    raf = requestAnimationFrame(tick)

    viewport.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('touchstart', onTouchStart, { passive: true })
    viewport.addEventListener('touchend', onTouchEnd, { passive: true })
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true })
    viewport.addEventListener('pointerenter', onPointerEnter)
    viewport.addEventListener('pointerleave', onPointerLeave)
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('click', onClick, true)
    viewport.addEventListener('dragstart', onDragStart)
    viewport.addEventListener('wheel', onWheel, { passive: true })
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(raf)
      if (io) io.disconnect()
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', measure)

      viewport.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchend', onTouchEnd)
      viewport.removeEventListener('touchcancel', onTouchEnd)
      viewport.removeEventListener('pointerenter', onPointerEnter)
      viewport.removeEventListener('pointerleave', onPointerLeave)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('click', onClick, true)
      viewport.removeEventListener('dragstart', onDragStart)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)

      viewport.style.scrollBehavior = ''
      viewport.style.scrollSnapType = ''
      viewport.style.overscrollBehaviorX = ''
      viewport.style.cursor = ''
      viewport.style.userSelect = ''
    }
  }, [speed, pauseOnHover, respectReducedMotion])

  return { viewportRef, trackRef, copies }
}

// Works on every React version (18 and 19) - the extra copies are not clickable or tabbable
const markInert = (copy) => (el) => {
  if (!el) return
  if (copy === ACTIVE_COPY) el.removeAttribute('inert')
  else el.setAttribute('inert', '')
}

/* ------------------------------------------------------------------ */
/*  Video card                                                         */
/* ------------------------------------------------------------------ */
function VideoTestimonialCard({ item, interactive }) {
  const [playerLoaded, setPlayerLoaded] = useState(item.platform === 'Instagram Reel')
  const tab = interactive ? 0 : -1

  return (
    <article className={`proof-video-card${item.platform === 'YouTube' ? ' proof-video-card-youtube' : ''}`}>
      <div className="proof-video-frame">
        {playerLoaded ? (
          <iframe
            src={item.embed}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            tabIndex={tab}
          />
        ) : (
          <a
            className="proof-video-preview"
            data-platform={item.platform === 'YouTube' ? 'youtube' : 'instagram'}
            href={item.href}
            onClick={(event) => { event.preventDefault(); setPlayerLoaded(true) }}
            tabIndex={tab}
            aria-label={`Play ${item.title}`}
          >
            {item.thumbnail && <img src={item.thumbnail} alt="" loading="lazy" decoding="async" />}
            <span className="proof-video-play" aria-hidden="true">▶</span>
            <span className="proof-video-preview-platform">{item.platform}</span>
          </a>
        )}
      </div>
      <div className="proof-video-copy">
        <span>{item.platform}</span>
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
        <a href={item.href} target="_blank" rel="noreferrer" tabIndex={tab}>
          Open Video <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/*  Image testimonials                                                 */
/* ------------------------------------------------------------------ */
export default function TestimonialCarousel() {
  const { viewportRef, trackRef, copies } = useAutoScroll({
    speed: SPEED,
    pauseOnHover: false,
    respectReducedMotion: true,
  })

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <div
        className="proof-carousel proof-carousel--images"
        ref={viewportRef}
        aria-label="Gym owner testimonials"
        tabIndex={0}
      >
        <div className="proof-carousel-track" ref={trackRef}>
          {Array.from({ length: copies }, (_, copy) => {
            const interactive = copy === ACTIVE_COPY
            return (
              <div className="proof-carousel-set" key={copy} ref={markInert(copy)}>
                {content.proof.items.map((item) => (
                  <a
                    className="proof-image-card"
                    href={item.src}
                    target="_blank"
                    rel="noreferrer"
                    key={`${copy}-${item.src}`}
                    tabIndex={interactive ? 0 : -1}
                    aria-label={interactive ? `${item.alt}; open full image` : undefined}
                  >
                    <span
                      className="proof-image-scroll"
                      aria-label="Scroll testimonial image vertically"
                      tabIndex={interactive ? 0 : -1}
                    >
                      <img src={item.src} alt={interactive ? item.alt : ''} loading="lazy" decoding="async" />
                    </span>
                  </a>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Video testimonials                                                 */
/*  Scrolls on its own, smoothly and non-stop. It stops only while the */
/*  user hovers (mouse), touches, drags, uses the wheel or keyboard,   */
/*  and starts again by itself RESUME_DELAY ms after they let go.      */
/* ------------------------------------------------------------------ */
export function VideoTestimonialCarousel() {
  const { viewportRef, trackRef, copies } = useAutoScroll({
    speed: VIDEO_SPEED,
    pauseOnHover: true,
    respectReducedMotion: false, // set to true if you want the OS "reduce motion" setting to stop it
  })

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <div
        className="proof-carousel proof-video-carousel proof-carousel--videos"
        ref={viewportRef}
        aria-label="Gym owner video testimonials"
        tabIndex={0}
      >
        <div className="proof-carousel-track" ref={trackRef}>
          {Array.from({ length: copies }, (_, copy) => (
            <div className="proof-carousel-set" key={copy} ref={markInert(copy)}>
              {content.proof.videoItems.map((item) => (
                <VideoTestimonialCard
                  item={item}
                  interactive={copy === ACTIVE_COPY}
                  key={`${copy}-${item.href}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}