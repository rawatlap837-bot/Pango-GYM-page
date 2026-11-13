import { useEffect, useRef, useState } from 'react'
import { content } from '../content'

const SPEED = 32          // auto-scroll speed in pixels per second
const VIDEO_SPEED = 20    // slower motion for the larger video cards
const RESUME_DELAY = 1500 // ms without user activity before auto-scroll restarts

function VideoTestimonialCard({ item, copy }) {
  const [playerLoaded, setPlayerLoaded] = useState(item.platform === 'Instagram Reel')

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
            tabIndex={copy === 0 ? 0 : -1}
          />
        ) : (
          <a
            className="proof-video-preview"
            data-platform={item.platform === 'YouTube' ? 'youtube' : 'instagram'}
            href={item.href}
            onClick={(event) => { event.preventDefault(); setPlayerLoaded(true) }}
            tabIndex={copy === 0 ? 0 : -1}
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
        <a href={item.href} target="_blank" rel="noreferrer" tabIndex={copy === 0 ? 0 : -1}>
          Open Video <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default function TestimonialCarousel() {
  const trackRef = useRef(null)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let cycle = 0        // distance of one full set of cards (the loop length)
    let pos = 0          // our own precise scroll position (can be fractional)
    let lastWritten = 0  // last position we set from code, to tell our scrolls from the user's
    let lastTime = 0
    let raf = 0
    let userUntil = 0    // auto-scroll stays paused until this time
    let touching = false
    let dragging = false
    let moved = false
    let focusHeld = false
    let inView = true
    let startX = 0
    let lastX = 0

    // Make sure CSS can't fight the animation (smooth-scroll or snapping breaks it)
    viewport.style.scrollBehavior = 'auto'
    viewport.style.scrollSnapType = 'none'
    viewport.style.overscrollBehaviorX = 'contain'

    const now = () => performance.now()
    const holdOff = () => { userUntil = now() + RESUME_DELAY }

    /* ---------- measure one loop length ---------- */
    const measure = () => {
      const sets = track.children
      if (sets.length < 2) return
      // distance between the start of set 1 and set 2 (includes any gap)
      const next = sets[1].getBoundingClientRect().left - sets[0].getBoundingClientRect().left
      if (next <= 0) return

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
      const busy = touching || dragging || focusHeld || time < userUntil
      if (busy || !inView || document.hidden || reducedMotion.matches) return

      // if something else moved the scroll (keyboard, etc.), continue from there
      if (Math.abs(pos - viewport.scrollLeft) > 2) pos = viewport.scrollLeft

      pos += (SPEED * dt) / 1000
      if (pos >= cycle * 1.5) pos -= cycle
      viewport.scrollLeft = pos
      lastWritten = pos
    }

    /* ---------- infinite loop for manual scrolling ---------- */
    const onScroll = () => {
      const x = viewport.scrollLeft
      // not our own write, so the user is scrolling
      if (Math.abs(x - lastWritten) > 1.5) holdOff()
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

    /* ---------- mouse: drag to scroll on desktop ---------- */
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
      viewport.scrollLeft -= e.clientX - lastX
      lastX = e.clientX
    }
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      holdOff()
    }
    // after a drag, don't open the image link
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
      if (e.target.matches && e.target.matches(':focus-visible')) focusHeld = true
    }
    const onFocusOut = () => { focusHeld = false; holdOff() }

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
    }
  }, [])

  return (
    <div className="proof-carousel" ref={viewportRef} aria-label="Gym owner testimonials" tabIndex={0}>
      <div className="proof-carousel-track" ref={trackRef}>
        {[0, 1, 2].map((copy) => (
          <div className="proof-carousel-set" key={copy} inert={copy !== 0}>
            {content.proof.items.map((item) => (
              <a
                  className="proof-image-card"
                  href={item.src}
                  target="_blank"
                  rel="noreferrer"
                  key={`${copy}-${item.src}`}
                  tabIndex={copy === 0 ? 0 : -1}
                  aria-label={copy === 0 ? `${item.alt}; open full image` : undefined}
                >
                  <span className="proof-image-scroll" aria-label="Scroll testimonial image vertically" tabIndex={copy === 0 ? 0 : -1}>
                    <img src={item.src} alt={copy === 0 ? item.alt : ''} loading="lazy" decoding="async" />
                  </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function VideoTestimonialCarousel() {
  const trackRef = useRef(null)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cycle = 0
    let position = 0
    let lastWritten = 0
    let lastTime = 0
    let frame = 0
    let pauseUntil = 0
    let active = true
    let touch = false
    let drag = false
    let startX = 0
    let lastX = 0

    const measure = () => {
      if (track.children.length < 2) return
      const next = track.children[1].getBoundingClientRect().left - track.children[0].getBoundingClientRect().left
      if (!next) return
      const previous = cycle
      cycle = next
      if (!previous) position = viewport.scrollLeft = lastWritten = cycle
      else if (Math.abs(previous - next) > 0.5) position = viewport.scrollLeft = lastWritten = viewport.scrollLeft * next / previous
    }
    const hold = () => { pauseUntil = performance.now() + RESUME_DELAY }
    const onScroll = () => {
      const x = viewport.scrollLeft
      if (Math.abs(x - lastWritten) > 1.5) hold()
      if (!cycle) return
      if (x < cycle * 0.5 || x >= cycle * 1.5) {
        position = viewport.scrollLeft = lastWritten = x < cycle * 0.5 ? x + cycle : x - cycle
      }
    }
    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      drag = true
      startX = lastX = event.clientX
    }
    const onPointerMove = (event) => {
      if (!drag) return
      if (Math.abs(event.clientX - startX) >= 4) viewport.scrollLeft -= event.clientX - lastX
      lastX = event.clientX
    }
    const onPointerUp = () => { if (drag) { drag = false; hold() } }
    const tick = (time) => {
      frame = requestAnimationFrame(tick)
      const delta = Math.min(time - (lastTime || time), 50)
      lastTime = time
      if (!cycle || !active || touch || drag || time < pauseUntil || document.hidden) return
      if (Math.abs(position - viewport.scrollLeft) > 2) position = viewport.scrollLeft
      position += VIDEO_SPEED * delta / 1000
      if (position >= cycle * 1.5) position -= cycle
      viewport.scrollLeft = lastWritten = position
    }
    const visibility = new IntersectionObserver(([entry]) => { active = entry.isIntersecting })
    const resize = new ResizeObserver(measure)
    visibility.observe(viewport)
    resize.observe(viewport)
    resize.observe(track.children[0])
    viewport.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('touchstart', () => { touch = true }, { passive: true })
    viewport.addEventListener('touchend', () => { touch = false; hold() }, { passive: true })
    viewport.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    viewport.addEventListener('wheel', hold, { passive: true })
    measure()
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resize.disconnect()
      viewport.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('wheel', hold)
    }
  }, [])

  return (
    <div className="proof-carousel proof-video-carousel" ref={viewportRef} aria-label="Gym owner video testimonials" tabIndex={0}>
      <div className="proof-carousel-track" ref={trackRef}>
        {[0, 1, 2].map((copy) => (
          <div className="proof-carousel-set" key={copy} inert={copy !== 1}>
            {content.proof.videoItems.map((item) => (
              <VideoTestimonialCard item={item} copy={copy} key={`${copy}-${item.href}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
