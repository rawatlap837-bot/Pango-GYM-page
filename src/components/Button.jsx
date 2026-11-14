import { useEffect, useRef } from 'react'
import { content } from '../content'
import { animate } from 'animejs'

/* ---------- Styles (injected once, no separate CSS file needed) ---------- */
const STYLES = `
a.button-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 1.9rem;
  border-radius: 0.8rem;
  background: linear-gradient(180deg, #ffd84d 0%, #f2c230 100%);
  color: #2a0f5c;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  will-change: transform;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -2px 0 rgba(0, 0, 0, 0.08),
    0 10px 24px -8px rgba(250, 204, 21, 0.55),
    0 2px 6px rgba(20, 0, 60, 0.35);
  transition: filter 0.2s ease, box-shadow 0.2s ease;
}
a.button-primary:hover {
  filter: brightness(1.05);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -2px 0 rgba(0, 0, 0, 0.08),
    0 16px 32px -8px rgba(250, 204, 21, 0.7),
    0 4px 10px rgba(20, 0, 60, 0.4);
}
a.button-primary:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}
.button-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}
.button-shine-clip {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.button-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  height: 100%;
}
.button-shine::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: skewX(-20deg);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
}
.button-label,
.button-arrow {
  position: relative;
  z-index: 1;
  display: inline-flex;
}
`

if (typeof document !== 'undefined' && !document.getElementById('button-primary-styles')) {
  const tag = document.createElement('style')
  tag.id = 'button-primary-styles'
  tag.textContent = STYLES
  document.head.appendChild(tag)
}

/* ---------- Helpers ---------- */
const motionAllowed = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14m0 0-6-6m6 6-6 6"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ---------- Component ---------- */
export default function Button({
  href = content.cta.href,
  children = content.cta.label,
  className = '',
  arrow = true,
  glow = '250, 204, 21', // RGB of the pulse ring (yellow)
}) {
  const ringRef = useRef(null)
  const shineRef = useRef(null)
  const arrowRef = useRef(null)
  const loopsRef = useRef([])

  const isPlaceholder = href === content.offer?.linkPlaceholder

  // Remove a trailing "→" from the label, the component adds its own arrow
  const label =
    typeof children === 'string' ? children.replace(/\s*→\s*$/, '') : children

  // Continuous loop: soft pulse ring + occasional shine sweep
  useEffect(() => {
    if (!motionAllowed()) return

    loopsRef.current = [
      animate(ringRef.current, {
        boxShadow: [`0 0 0 0 rgba(${glow}, 0.45)`, `0 0 0 14px rgba(${glow}, 0)`],
        duration: 1800,
        ease: 'out(2)',
        loop: true,
        loopDelay: 600,
      }),
      animate(shineRef.current, {
        translateX: ['-160%', '480%'],
        duration: 1000,
        ease: 'inOut(2)',
        loop: true,
        loopDelay: 3200,
      }),
    ]

    return () => loopsRef.current.forEach((loop) => loop.revert())
  }, [glow])

  const pauseLoops = () => loopsRef.current.forEach((loop) => loop.pause())
  const resumeLoops = () => loopsRef.current.forEach((loop) => loop.play())

  const lift = (event) => {
    if (!motionAllowed()) return
    pauseLoops()
    animate(event.currentTarget, { translateY: -3, scale: 1.03, duration: 220, ease: 'out(3)' })
    if (arrowRef.current)
      animate(arrowRef.current, { translateX: 5, duration: 220, ease: 'out(3)' })
  }

  const rest = (event) => {
    if (!motionAllowed()) return
    resumeLoops()
    animate(event.currentTarget, { translateY: 0, scale: 1, duration: 260, ease: 'out(3)' })
    if (arrowRef.current)
      animate(arrowRef.current, { translateX: 0, duration: 260, ease: 'out(3)' })
  }

  const press = (event) => {
    if (motionAllowed())
      animate(event.currentTarget, { scale: 0.97, translateY: 0, duration: 100, ease: 'out(2)' })
  }

  const release = (event) => {
    if (!motionAllowed()) return
    // Touch screens have no hover, so go back to normal after a tap
    const isMouse = event.pointerType === 'mouse'
    animate(event.currentTarget, {
      translateY: isMouse ? -3 : 0,
      scale: isMouse ? 1.03 : 1,
      duration: 180,
      ease: 'out(3)',
    })
  }

  // Only lift on keyboard focus, not on mouse click focus
  const focusLift = (event) => {
    if (event.currentTarget.matches(':focus-visible')) lift(event)
  }

  return (
    <a
      href={href}
      onClick={isPlaceholder ? (event) => {
        // The CTA still has a working destination until a registration URL is configured.
        event.preventDefault()
        document.getElementById(content.cta.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      } : undefined}
      onPointerEnter={lift}
      onPointerLeave={rest}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={rest}
      onFocus={focusLift}
      onBlur={rest}
      aria-label={isPlaceholder ? `${label} (Registration Link To Be Added)` : undefined}
      className={`button-primary ${className}`}
    >
      {/* Pulse ring */}
      <span ref={ringRef} aria-hidden="true" className="button-ring" />

      {/* Shine sweep, clipped inside the button */}
      <span aria-hidden="true" className="button-shine-clip">
        <span ref={shineRef} className="button-shine" />
      </span>

      <span className="button-label">{label}</span>
      {arrow && (
        <span ref={arrowRef} className="button-arrow">
          <ArrowIcon />
        </span>
      )}
    </a>
  )
}
