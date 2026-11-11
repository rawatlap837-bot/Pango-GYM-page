import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

export default function HeroAtmosphere() {
  const atmosphereRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const orbs = atmosphereRef.current?.querySelectorAll('.hero-orb')
    if (!orbs?.length) return undefined

    const motions = [
      animate(orbs[0], { translateX: [0, 34], translateY: [0, -22], scale: [1, 1.12], duration: 9000, alternate: true, loop: true, ease: 'inOut(2)' }),
      animate(orbs[1], { translateX: [0, -28], translateY: [0, 24], scale: [1, 1.08], duration: 11000, alternate: true, loop: true, ease: 'inOut(2)' }),
      animate(orbs[2], { rotate: [0, 12], scale: [1, 1.06], duration: 13000, alternate: true, loop: true, ease: 'inOut(2)' }),
    ]

    return () => motions.forEach((motion) => motion.cancel())
  }, [])

  return (
    <div className="hero-atmosphere" ref={atmosphereRef} aria-hidden="true">
      <span className="hero-orb hero-orb-violet" />
      <span className="hero-orb hero-orb-blue" />
      <span className="hero-orb hero-orb-yellow" />
      <span className="hero-atmosphere-ring" />
      <span className="hero-atmosphere-ring hero-atmosphere-ring-inner" />
    </div>
  )
}
