import { Fragment, useEffect, useRef } from 'react'
import { content } from '../content'
import Button from './Button'

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const NO_MOTION = typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches

/* ------------------------------------------------------------------
  THEME  (purple + gold). Change these to re-theme every icon.
------------------------------------------------------------------- */
const THEME = {
  ink: '#4c1d95',     // icon line colour
  accent: '#f5b800',  // gold highlight
  tint: '#ede7ff',    // light badge background (pain icons)
}

/* ==================================================================
  1) PAIN ICONS  ("Book this one on one call if...")
================================================================== */
const PAIN_ICONS = [
  // 01 wallet: coin drops in
  <>
    <circle className="pi-coin-drop pi-accent-fill" cx="24" cy="9" r="4" />
    <rect x="8" y="16" width="32" height="24" rx="5" />
    <path d="M8 23h32" />
    <rect x="29" y="28" width="11" height="7" rx="3.5" className="pi-accent-fill" />
  </>,
  // 02 coins: bobbing
  <>
    <g className="pi-bob-a">
      <circle cx="18" cy="29" r="9" />
      <circle cx="18" cy="29" r="4.5" className="pi-accent" />
    </g>
    <g className="pi-bob-b">
      <circle cx="31" cy="19" r="9" />
      <circle cx="31" cy="19" r="4.5" className="pi-accent" />
    </g>
  </>,
  // 03 growth chart: line draws itself
  <>
    <path d="M8 8v32h32" />
    <path className="pi-draw pi-accent" d="M14 32l8-8 6 5 11-14" pathLength="1" />
    <path className="pi-arrow pi-accent" d="M32 15h7v7" />
  </>,
  // 04 people: ping ring
  <>
    <circle className="pi-ping pi-accent" cx="34" cy="20" r="5" />
    <circle cx="20" cy="17" r="6" />
    <path d="M8 39c0-7 5-12 12-12s12 5 12 12" />
    <g className="pi-sway">
      <circle cx="34" cy="20" r="4.5" />
      <path d="M34 28c5 0 8 4 8 10" />
    </g>
  </>,
  // 05 tag: swings
  <g className="pi-swing">
    <path d="M10 10h16l14 14-16 16L10 26z" />
    <circle cx="19" cy="19" r="2.5" className="pi-accent-fill" />
    <path d="M22 31l9-9" className="pi-accent" />
  </g>,
]

function PainIcon({ index = 0 }) {
  return (
    <span className="pain-icon" style={{ '--pi-delay': `${index * 0.35}s` }} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="currentColor"
        strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {PAIN_ICONS[index % PAIN_ICONS.length]}
      </svg>
    </span>
  )
}

/* ==================================================================
  2) OUTCOME ICONS  ("Your gym will look like this")
  Every icon has a small human figure in it and its own animation.
  1 chart  : bars grow, person celebrates on top
  2 members: members walk in around you
  3 wallet : relaxed person, coin drops into the wallet
  4 target : person shoots, arrow hits the bullseye
  5 route  : person walks the path to the flag
================================================================== */
const ROUTE = 'M9 40C9 32 20 34 22 27S31 22 36 16'

function OutcomeIcon({ index = 0 }) {
  const d = `${index * 0.3}s`
  let body = null

  if (index === 0) {
    body = (
      <>
        <path d="M4 42h40" />
        {[0, 1, 2].map((k) => (
          <rect
            key={k}
            className={`oi-bar ${k === 2 ? 'oi-fill-gold' : 'oi-fill-soft'}`}
            style={{ '--k': k }}
            x={6 + k * 12} y={[32, 25, 17][k]} width="8" height={[10, 17, 25][k]} rx="2"
          />
        ))}
        <g className="oi-jump">
          <circle cx="34" cy="6" r="2.6" />
          <path d="M34 9.2v4.5M29.5 6L34 10l4.5-4M34 13.7l-1.6 3M34 13.7l1.6 3" />
        </g>
      </>
    )
  } else if (index === 1) {
    body = (
      <>
        <g className="oi-in-l">
          <circle cx="9" cy="24" r="3.5" />
          <path d="M3 40c0-5 3-8 6-8" />
        </g>
        <g className="oi-in-r">
          <circle cx="39" cy="24" r="3.5" />
          <path d="M45 40c0-5-3-8-6-8" />
        </g>
        <circle className="oi-ping pi-accent" cx="24" cy="14" r="5" />
        <circle cx="24" cy="14" r="5" className="oi-fill-gold" />
        <path d="M14 40c0-7 4-12 10-12s10 5 10 12" />
      </>
    )
  } else if (index === 2) {
    body = (
      <>
        <g className="oi-head">
          <circle cx="24" cy="12" r="4.5" />
          <path d="M21.8 13.4q2.2 2 4.4 0" strokeWidth="1.6" />
          <path d="M15.5 25c.5-5 4-8 8.5-8s8 3 8.5 8" />
        </g>
        <g className="oi-wallet">
          <rect x="8" y="26" width="32" height="15" rx="4" className="oi-fill-soft" />
          <path d="M8 32h32" />
          <rect x="30" y="34" width="10" height="5" rx="2.5" className="pi-accent-fill" />
        </g>
        <circle className="oi-coin pi-accent-fill" cx="38" cy="8" r="3.2" />
      </>
    )
  } else if (index === 3) {
    body = (
      <>
        <g className="oi-target">
          <circle cx="31" cy="21" r="11" />
          <circle cx="31" cy="21" r="6.5" />
          <circle cx="31" cy="21" r="2.5" className="pi-accent-fill" />
        </g>
        <path className="oi-arrow pi-accent" d="M17 26L28.5 21.5" />
        <circle cx="9" cy="24" r="3.2" />
        <path d="M9 28v8M9 36l-3 6M9 36l3 6M9 30l7-3" />
      </>
    )
  } else {
    body = (
      <>
        <path d={ROUTE} strokeDasharray="2 3.5" opacity=".55" />
        <circle cx="9" cy="40" r="2" className="pi-accent-fill" />
        <path d="M36 16V6" />
        <path className="oi-flag pi-accent-fill" d="M36 6h8l-2.6 3L44 12h-8z" />
        <g transform={NO_MOTION ? 'translate(22 27)' : undefined}>
          <circle cx="0" cy="-6" r="2.4" />
          <path d="M0 -3.4V3M0 3l-2.2 4.5M0 3l2.2 4.5M-3 -1l3 1 3 -1" />
          {!NO_MOTION && (
            <>
              <animateMotion dur="4s" repeatCount="indefinite" path={ROUTE} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1"
                dur="4s" repeatCount="indefinite" />
            </>
          )}
        </g>
      </>
    )
  }

  return (
    <svg className="outcome-svg" style={{ '--oi-delay': d }} viewBox="0 0 48 48" width="30" height="30"
      fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {body}
    </svg>
  )
}

/* ==================================================================
  3) OUTCOME STRIP  (mobile: the long strip next to the number)
  A little story per card: 3 small steps linked by a dashed track,
  two pulses travelling between them, floating symbols across the
  whole width, a light sweep, and the big animated icon as the
  final result.
  (Classes use the unique "ox-" prefix so they can't clash with
  your site's existing .step-number / .outcome-strip styles.)
================================================================== */
const MINI = {
  dumbbell: <path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" />,
  users: <><circle cx="9" cy="9" r="3" /><path d="M3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5" /><path d="M16 6.5a3 3 0 010 5.5M18 14.8c1.8.7 3 2.3 3 5.2" /></>,
  coin: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v10M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 1.8 0 2.6 5 1.4 5 4 0 1-1 1.8-2.5 1.8-1.1 0-2.1-.5-2.6-1.5" /></>,
  pin: <><path d="M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0112 7.6a4.2 4.2 0 017.5 2.2C19.5 15.4 12 20 12 20z" />,
  userPlus: <><circle cx="10" cy="8" r="3.5" /><path d="M3 20c0-4 3-6 7-6s7 2 7 6M19 7v6M16 10h6" /></>,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="2.5" /><path d="M4 11h16M9 4v4M15 4v4" /></>,
  bill: <><rect x="3" y="7" width="18" height="11" rx="2.5" /><circle cx="12" cy="12.5" r="2.5" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-4.5" /></>,
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  check: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  list: <path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" />,
  flag: <path d="M5 21V4M5 4h12l-2.5 4L17 12H5" />,
}

const STRIPS = [
  { items: ['dumbbell', 'users', 'coin'], glyph: '$', tint: '#fff0bf' },
  { items: ['pin', 'heart', 'userPlus'], glyph: '\u2665', tint: '#dbeafe' },
  { items: ['calendar', 'bill', 'shield'], glyph: '\u2713', tint: '#ffe8d6' },
  { items: ['moon', 'star', 'check'], glyph: '\u2605', tint: '#dcfce7' },
  { items: ['compass', 'list', 'flag'], glyph: '\u2726', tint: '#ffe4e6' },
]

const GLYPH_POS = [6, 16, 27, 38, 49, 60, 71, 82, 92]

function OutcomeStrip({ index = 0 }) {
  const spec = STRIPS[index % STRIPS.length]
  return (
    <i className="outcome-strip" style={{ '--tint': spec.tint }}>
      <span className="ox-sweep" />

      {GLYPH_POS.map((x, k) => (
        <span key={x} className="ox-float" aria-hidden="true"
          style={{
            '--x': `${x}%`,
            '--d': `${(k * 0.45) % 3.6}s`,
            '--dur': `${3 + (k % 3) * 0.7}s`,
            '--c': k % 2 ? THEME.ink : THEME.accent,
          }}>
          {k % 3 === 0 ? spec.glyph : k % 3 === 1 ? '\u2022' : '\u2726'}
        </span>
      ))}

      {spec.items.map((name, k) => (
        <Fragment key={name}>
          <span className="ox-stage" style={{ '--t': `${k}s` }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              {MINI[name]}
            </svg>
          </span>
          <span className="ox-track">
            <span className="ox-pulse" style={{ '--t': `${k + 0.25}s` }} />
            <span className="ox-pulse ox-pulse-2" style={{ '--t': `${k + 0.6}s` }} />
          </span>
        </Fragment>
      ))}

      <span className="oi-main" style={{ '--t': `${spec.items.length}s` }}>
        <OutcomeIcon index={index} />
      </span>
    </i>
  )
}

/* ==================================================================
  STYLES  (pain icons + outcome icons + animated strip + deck effect)
================================================================== */
const CSS = `
  .fit-section { --pi-ink: ${THEME.ink}; --pi-accent: ${THEME.accent}; --pi-tint: ${THEME.tint}; }

  /* ---------- pain icons ---------- */
  .pain-mark { display: grid; place-items: center; flex: none; }
  .pain-icon {
    position: relative; width: 50px; height: 50px;
    display: grid; place-items: center; border-radius: 50%;
    color: var(--pi-ink);
    background: radial-gradient(circle at 30% 25%, #fff 0%, var(--pi-tint) 75%);
    box-shadow: 0 6px 16px color-mix(in srgb, var(--pi-ink) 20%, transparent),
                inset 0 0 0 1px color-mix(in srgb, var(--pi-ink) 12%, transparent);
  }
  .pain-icon::after {
    content: ""; position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid var(--pi-accent); opacity: 0;
    animation: pi-ring 2.8s ease-out infinite; animation-delay: var(--pi-delay);
  }
  .pain-icon svg { overflow: visible; }
  .pain-icon svg * { transform-box: fill-box; transform-origin: center; }
  .pain-icon .pi-accent { stroke: var(--pi-accent); }
  .pain-icon .pi-accent-fill { fill: var(--pi-accent); stroke: none; }
  @keyframes pi-ring { 0% { transform: scale(.9); opacity: .55; } 70%, 100% { transform: scale(1.35); opacity: 0; } }

  .pain-icon .pi-coin-drop { animation: pi-drop 2.4s ease-in infinite; animation-delay: var(--pi-delay); }
  @keyframes pi-drop { 0% { transform: translateY(-4px); opacity: 0; } 20% { opacity: 1; } 70% { transform: translateY(10px); opacity: 1; } 85%, 100% { transform: translateY(12px); opacity: 0; } }
  .pain-icon .pi-bob-a { animation: pi-bob 2.2s ease-in-out infinite; animation-delay: var(--pi-delay); }
  .pain-icon .pi-bob-b { animation: pi-bob 2.2s ease-in-out infinite reverse; animation-delay: var(--pi-delay); }
  @keyframes pi-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  .pain-icon .pi-draw  { stroke-dasharray: 1; stroke-dashoffset: 1; animation: pi-draw 3s ease-in-out infinite; animation-delay: var(--pi-delay); }
  .pain-icon .pi-arrow { opacity: 0; animation: pi-arrow 3s ease-in-out infinite; animation-delay: var(--pi-delay); }
  @keyframes pi-draw  { 0% { stroke-dashoffset: 1; } 45%, 85% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 0; opacity: 0; } }
  @keyframes pi-arrow { 0%, 40% { opacity: 0; transform: scale(.6); } 55%, 85% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }
  .pain-icon .pi-sway { animation: pi-sway 2.6s ease-in-out infinite; animation-delay: var(--pi-delay); }
  .pain-icon .pi-ping { stroke-width: 1.6; animation: pi-ping 2.6s ease-out infinite; animation-delay: var(--pi-delay); }
  @keyframes pi-sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-2px); } }
  @keyframes pi-ping { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(2.2); opacity: 0; } }
  .pain-icon .pi-swing { transform-box: view-box; transform-origin: 19px 19px; animation: pi-swing 2.4s ease-in-out infinite; animation-delay: var(--pi-delay); }
  @keyframes pi-swing { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }

  /* ---------- outcome icons (inside the white badge) ---------- */
  .outcome-svg { overflow: visible; color: ${THEME.ink}; display: block; }
  .outcome-svg * { transform-box: fill-box; transform-origin: center; }
  .outcome-svg .pi-accent { stroke: ${THEME.accent}; }
  .outcome-svg .pi-accent-fill { fill: ${THEME.accent}; stroke: none; }
  .outcome-svg .oi-fill-soft { fill: currentColor; fill-opacity: .13; }
  .outcome-svg .oi-fill-gold { fill: ${THEME.accent}; stroke: ${THEME.ink}; }

  /* 1 chart */
  .outcome-svg .oi-bar { transform-origin: 50% 100%; animation: oi-grow 3.4s ease-in-out infinite; animation-delay: calc(var(--oi-delay) + var(--k) * .18s); }
  .outcome-svg .oi-jump { animation: oi-jump 3.4s ease-in-out infinite; animation-delay: var(--oi-delay); }
  @keyframes oi-grow { 0% { transform: scaleY(.12); } 35%, 80% { transform: scaleY(1); } 100% { transform: scaleY(.12); } }
  @keyframes oi-jump { 0%, 35% { transform: translateY(6px); } 50% { transform: translateY(-2px); } 62% { transform: translateY(0); } 80% { transform: translateY(0); } 100% { transform: translateY(6px); } }

  /* 2 members */
  .outcome-svg .oi-in-l { animation: oi-in-l 3.2s ease-out infinite; animation-delay: var(--oi-delay); }
  .outcome-svg .oi-in-r { animation: oi-in-r 3.2s ease-out infinite; animation-delay: var(--oi-delay); }
  .outcome-svg .oi-ping { stroke-width: 1.6; animation: pi-ping 2.6s ease-out infinite; animation-delay: var(--oi-delay); }
  @keyframes oi-in-l { 0% { transform: translateX(-8px); opacity: 0; } 30%, 85% { transform: translateX(0); opacity: 1; } 100% { opacity: 0; } }
  @keyframes oi-in-r { 0% { transform: translateX(8px); opacity: 0; } 30%, 85% { transform: translateX(0); opacity: 1; } 100% { opacity: 0; } }

  /* 3 wallet */
  .outcome-svg .oi-head { animation: oi-head 3s ease-in-out infinite; animation-delay: var(--oi-delay); }
  .outcome-svg .oi-wallet { animation: oi-wallet 3s ease-in-out infinite; animation-delay: var(--oi-delay); }
  .outcome-svg .oi-coin { animation: oi-coin 3s ease-in infinite; animation-delay: var(--oi-delay); }
  @keyframes oi-head { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
  @keyframes oi-wallet { 0%, 55%, 100% { transform: scale(1); } 66% { transform: scale(1.07); } }
  @keyframes oi-coin { 0% { transform: translateY(-4px); opacity: 0; } 15% { opacity: 1; } 60% { transform: translateY(16px); opacity: 1; } 68%, 100% { transform: translateY(18px); opacity: 0; } }

  /* 4 target */
  .outcome-svg .oi-arrow { animation: oi-shoot 3s ease-in infinite; animation-delay: var(--oi-delay); }
  .outcome-svg .oi-target { animation: oi-hit 3s ease-in-out infinite; animation-delay: var(--oi-delay); }
  @keyframes oi-shoot { 0% { transform: translate(-10px, 4px); opacity: 0; } 15% { opacity: 1; } 40%, 85% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(0, 0); opacity: 0; } }
  @keyframes oi-hit { 0%, 38%, 60%, 100% { transform: scale(1); } 46% { transform: scale(1.1); } }

  /* 5 route */
  .outcome-svg .oi-flag { transform-origin: 0% 50%; animation: oi-wave 1.4s ease-in-out infinite; }
  @keyframes oi-wave { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(.8); } }

  @media (prefers-reduced-motion: reduce) {
    .pain-icon::after, .pain-icon svg *, .outcome-svg * { animation: none !important; }
    .pain-icon .pi-draw { stroke-dashoffset: 0; }
    .pain-icon .pi-arrow { opacity: 1; }
    .pain-icon .pi-coin-drop, .pain-icon .pi-ping, .outcome-svg .oi-ping { opacity: 0; }
  }

  /* ---------- horizontal animated strip ---------- */
  /* desktop: hide strip extras, show only the big icon */
  .outcome-strip .ox-sweep, .outcome-strip .ox-float,
  .outcome-strip .ox-stage, .outcome-strip .ox-track { display: none; }
  .outcome-strip > .oi-main { display: contents; }

  @media (max-width: 767px) {
    .workshop-section .outcome-step-card .step-number { display: flex !important; align-items: center; gap: 12px; width: 100%; min-width: 0; box-sizing: border-box; }
    .workshop-section .outcome-step-card .step-number > span:first-child { flex: none; }
    .workshop-section .outcome-step-card { min-width: 0; max-width: 100%; box-sizing: border-box; }

    .workshop-section .outcome-step-card .outcome-strip {
      position: relative !important; display: flex !important; align-items: center;
      flex: 1 1 0; min-width: 0; width: auto !important; height: 60px !important;
      gap: 4px; padding: 0 8px !important; box-sizing: border-box;
      border-radius: 18px !important; overflow: hidden;
      background: linear-gradient(90deg, #ffffff 0%, var(--tint) 100%) !important;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.25), 0 8px 18px rgba(0,0,0,.22) !important;
    }

    .workshop-section .outcome-step-card .outcome-strip .ox-sweep {
      display: block !important; position: absolute !important; top: 0; bottom: 0; left: 0;
      width: 35% !important; height: auto !important; z-index: 1; border-radius: 0 !important;
      background: linear-gradient(90deg, transparent, rgba(245,184,0,.4), transparent) !important;
      animation: ox-sweep 3.6s ease-in-out infinite;
    }

    .workshop-section .outcome-step-card .outcome-strip .ox-float {
      display: block !important; position: absolute !important; left: var(--x); bottom: -14px;
      width: auto !important; height: auto !important; background: none !important; box-shadow: none !important;
      z-index: 0; font-size: 13px; line-height: 1; font-weight: 700; font-style: normal;
      color: var(--c); opacity: 0; animation: ox-float var(--dur) linear infinite; animation-delay: var(--d);
    }

    .workshop-section .outcome-step-card .outcome-strip .ox-stage {
      display: grid !important; place-items: center; position: relative !important; flex: none;
      width: 30px !important; height: 30px !important; border-radius: 50% !important;
      z-index: 2; color: ${THEME.ink}; background: #fff !important;
      box-shadow: inset 0 0 0 1.5px rgba(76,29,149,.25), 0 3px 8px rgba(76,29,149,.18) !important;
      animation: ox-stage 4.2s ease-in-out infinite; animation-delay: var(--t);
    }
    .outcome-strip .ox-stage svg { display: block; }

    .workshop-section .outcome-step-card .outcome-strip .ox-track {
      display: block !important; position: relative !important; flex: 1 1 6px; min-width: 6px;
      height: 0 !important; z-index: 1; background: none !important; box-shadow: none !important;
      border-top: 2px dashed rgba(76,29,149,.35) !important; border-radius: 0 !important;
    }
    .workshop-section .outcome-step-card .outcome-strip .ox-pulse {
      display: block !important; position: absolute !important; top: -5px; left: 0;
      width: 8px !important; height: 8px !important; border-radius: 50% !important;
      background: ${THEME.accent} !important; box-shadow: 0 0 8px ${THEME.accent} !important; opacity: 0;
      animation: ox-pulse 4.2s ease-in-out infinite; animation-delay: var(--t);
    }
    .outcome-strip .ox-pulse-2 { width: 5px !important; height: 5px !important; top: -3.5px; }

    .outcome-strip > .oi-main {
      display: grid; place-items: center; flex: none; position: relative; z-index: 2;
      width: 44px; height: 44px; animation: ox-pop 4.2s ease-in-out infinite; animation-delay: var(--t);
    }
    .outcome-strip .outcome-svg { width: 40px; height: 40px; }
  }

  @keyframes ox-sweep { 0% { transform: translateX(-110%); } 100% { transform: translateX(310%); } }
  @keyframes ox-float {
    0%   { transform: translateY(0) rotate(0); opacity: 0; }
    15%  { opacity: .9; }
    100% { transform: translateY(-74px) rotate(25deg); opacity: 0; }
  }
  @keyframes ox-stage {
    0%   { transform: scale(.75); opacity: .5; background: #fff; }
    8%   { transform: scale(1.2); opacity: 1; background: ${THEME.accent}; }
    22%, 88% { transform: scale(1); opacity: 1; background: #fff; }
    100% { transform: scale(.75); opacity: .5; background: #fff; }
  }
  @keyframes ox-pop { 0% { transform: scale(.75); opacity: .4; } 8% { transform: scale(1.18); opacity: 1; } 22%, 88% { transform: scale(1); opacity: 1; } 100% { transform: scale(.75); opacity: .4; } }
  @keyframes ox-pulse { 0% { left: 0; opacity: 0; } 3% { opacity: 1; } 16% { left: calc(100% - 8px); opacity: 1; } 19%, 100% { left: calc(100% - 8px); opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .outcome-strip .ox-stage, .outcome-strip .ox-sweep, .outcome-strip .ox-float,
    .outcome-strip .ox-pulse, .outcome-strip > .oi-main { animation: none !important; }
    .outcome-strip .ox-sweep, .outcome-strip .ox-float, .outcome-strip .ox-pulse { opacity: 0 !important; }
  }

  /* ---------- mobile deck effect (screens under 768px only) ---------- */
  @media (max-width: 767px) {
    .workshop-section .steps-grid.deck-steps {
      --deck-top: 94px;          /* height of your sticky navbar; increase if cards hide under it */
      --deck-solid: #2c1368;     /* solid colour behind each card; match your card purple */
      display: block !important;
      overflow: visible !important;
      scroll-snap-type: none !important;
      gap: 0 !important;
      padding-bottom: 12px !important;
    }
    .workshop-section .steps-grid.deck-steps > .step-card {
      position: sticky !important;
      top: calc(var(--deck-top) + var(--i) * 14px) !important;
      width: auto !important; min-width: 0 !important; max-width: none !important;
      flex: none !important;
      margin: 0 0 16px !important;
      scroll-snap-align: none !important;
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
    .workshop-section .steps-grid.deck-steps > .step-card { transform: none !important; filter: none !important; }
  }
  `

/* ==================================================================
  Mobile deck effect: cards stack, previous card shrinks + darkens.
  Also turns overflow hidden/auto/scroll on parents into "clip"
  (those break position: sticky) and restores them on cleanup.
================================================================== */
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
        const blocks = [s.overflowX, s.overflowY].some((v) => v === 'hidden' || v === 'auto' || v === 'scroll')
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

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const sync = () => { revert(); if (mobile.matches) unblockSticky(); update() }

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

/* ==================================================================
  COMPONENT
================================================================== */
export default function Features() {
  const stepsRef = useDeckScroll()

  return (
    <>
      <style>{CSS}</style>

      {/* ---------- FIT SECTION ---------- */}
      <section id="fit" className="section-pad fit-section">
        <div className="site-width">
          <div className="section-heading">
            <h2>{content.fit.title}</h2>
            {content.fit.intro && <p>{content.fit.intro}</p>}
          </div>

          <div className="pain-list">
            {content.fit.pains.map((item, i) => {
              const phrase = content.fit.painEmphasis[i]
              const [before, after = ''] = item.split(phrase)
              return (
                <article className="pain-item" key={item}>
                  <span className="pain-index">0{i + 1}</span>
                  <p>{before}<strong className="pain-emphasis">{phrase}</strong>{after}</p>
                  <span className="pain-mark"><PainIcon index={i} /></span>
                </article>
              )
            })}
          </div>

          <p className="fit-transition">{content.fit.transition}</p>
          <div className="fit-story">
            {content.fit.story.map((paragraph, index) => {
              const emphasis = content.fit.storyEmphasis[index]
              const [before, after = ''] = emphasis ? paragraph.split(emphasis) : [paragraph, '']
              return <p key={paragraph}>{before}{emphasis && <strong>{emphasis}</strong>}{after}</p>
            })}
          </div>
          <div className="center-action">
            <Button href={content.cta.href}>{content.fit.ctaLabel}</Button>
          </div>
        </div>
      </section>

      {/* ---------- OUTCOMES SECTION (deck scroll on mobile) ---------- */}
      <section id="workshop" className="section-pad workshop-section">
        <div className="site-width">
          <div className="section-heading">
            <span className="eyebrow">{content.outcomes.eyebrow}</span>
            <h2>{content.outcomes.title}</h2>
          </div>

          <div className="steps-grid deck-steps" ref={stepsRef} aria-label="After-call outcomes">
            {content.outcomes.items.map((item, index) => {
              const emphasis = content.outcomes.itemEmphasis[index]
              const [before, after = ''] = item.split(emphasis)
              return (
                <article className="step-card outcome-step-card" key={item} style={{ '--i': index }}>
                  <span className="step-number">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <OutcomeStrip index={index} />
                  </span>
                  <div className="step-rule" />
                  <h3>{before}<strong className="outcome-emphasis">{emphasis}</strong>{after}</h3>
                </article>
              )
            })}
          </div>

          <div className="workshop-bottom">
            <p>{content.outcomes.closing.split(/(this is the kind of gym business)/i).map((part, index) => /this is the kind of gym business/i.test(part) ? <strong className="workshop-closing-highlight" key={index}>{part}</strong> : part)}</p>
            <Button href={content.cta.href}>{content.outcomes.ctaLabel}</Button>
          </div>
        </div>
      </section>
    </>
  )
}
