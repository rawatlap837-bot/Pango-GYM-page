import { useEffect, useRef, useState } from 'react'
import { content } from '../content'
import Button from './Button'

/* ------------------------------------------------------------------
   DATA  (edit text here; case is controlled by --ba-case in the CSS)
------------------------------------------------------------------- */
const TITLE = 'Your Gym Before And After The Call'
const SUB = 'Where your gym is today, and where it goes in 90 days.'
const CLOSING = 'Which side of this page is your gym on?'

const PAIRS = [
    { before: 'Barely Any Profit After Bills', after: 'Real Profit You Deserve' },
    { before: 'Discounts Just To Fill Memberships', after: 'Memberships Fill At Full Price' },
    { before: 'Stressing About Monthly Expenses', after: 'Sleeping Easy About Your Gym' },
]

/* ------------------------------------------------------------------
   HOOK: flips to true once an element scrolls into view
------------------------------------------------------------------- */
function useInView(threshold = 0.25) {
    const ref = useRef(null)
    const [seen, setSeen] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setSeen(true); io.disconnect() }
        }, { threshold })
        io.observe(el)
        return () => io.disconnect()
    }, [threshold])
    return [ref, seen]
}

/* ------------------------------------------------------------------
   CHART: one graph, two lines. Both start at "today",
   one drifts down, one climbs to 2X by day 90.
------------------------------------------------------------------- */
const X0 = 40, X1 = 330, Y_TOP = 24, Y_BASE = 150
const UP = `M${X0} 90 C90 88 120 80 160 64 S270 30 ${X1} 26`
const DOWN = `M${X0} 90 C90 92 120 100 160 108 S270 124 ${X1} 130`

function Chart() {
    const [ref, seen] = useInView(0.3)
    return (
        <div ref={ref} className={`ba-chart-card ${seen ? 'is-in' : ''}`}>
            <div className="ba-legend">
                <span className="ba-key ba-key-down">Before the call</span>
                <span className="ba-key ba-key-up">After the call</span>
            </div>

            <svg
                className="ba-chart"
                viewBox="0 0 360 178"
                role="img"
                aria-label="Profit over 90 days: without the system profit slowly falls, with it profit reaches 2X target."
            >
                <defs>
                    <linearGradient id="ba-fill-up" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#f5b800" stopOpacity=".38" />
                        <stop offset="1" stopColor="#f5b800" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="ba-fill-down" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ff6b6b" stopOpacity="0" />
                        <stop offset="1" stopColor="#ff6b6b" stopOpacity=".2" />
                    </linearGradient>
                </defs>

                {/* grid + axes */}
                <g className="ba-grid">
                    {[Y_TOP, 66, 108, Y_BASE].map((y) => (
                        <line key={y} x1={X0} x2={X1} y1={y} y2={y} />
                    ))}
                </g>
                <text className="ba-axis" x={X0 - 8} y={Y_TOP + 3} textAnchor="end">High</text>
                <text className="ba-axis" x={X0 - 8} y={Y_BASE + 3} textAnchor="end">Low</text>
                {[['Day 1', X0, 'start'], ['Day 30', X0 + (X1 - X0) / 3, 'middle'], ['Day 60', X0 + ((X1 - X0) * 2) / 3, 'middle'], ['Day 90', X1, 'end']].map(([t, x, a]) => (
                    <text key={t} className="ba-axis" x={x} y={Y_BASE + 18} textAnchor={a}>{t}</text>
                ))}

                {/* areas */}
                <path className="ba-area ba-area-down" d={`${DOWN} L${X1} ${Y_BASE} L${X0} ${Y_BASE}Z`} fill="url(#ba-fill-down)" />
                <path className="ba-area ba-area-up" d={`${UP} L${X1} ${Y_BASE} L${X0} ${Y_BASE}Z`} fill="url(#ba-fill-up)" />

                {/* gap bracket between the two end points */}
                <line className="ba-gap" x1={X1 + 10} x2={X1 + 10} y1="26" y2="130" />

                {/* lines */}
                <path className="ba-line ba-line-down" d={DOWN} pathLength="1" />
                <path className="ba-line ba-line-up" d={UP} pathLength="1" />

                {/* points */}
                <circle className="ba-dot ba-dot-start" cx={X0} cy="90" r="4" />
                <circle className="ba-dot ba-dot-down" cx={X1} cy="130" r="4.5" />
                <circle className="ba-dot ba-dot-up" cx={X1} cy="26" r="5.5" />

                {/* labels */}
                <text className="ba-note ba-note-start" x={X0 + 8} y="78">Today</text>
                <text className="ba-note ba-note-down" x={X1 - 8} y="148" textAnchor="end">Barely any profit</text>
                <text className="ba-note ba-note-up" x={X1 - 10} y="14" textAnchor="end">2X target</text>
            </svg>
        </div>
    )
}

/* ------------------------------------------------------------------
   PAIR: compact before -> after row
------------------------------------------------------------------- */
function Pair({ item, index }) {
    const [ref, seen] = useInView(0.4)
    return (
        <article ref={ref} className={`ba-pair ${seen ? 'is-in' : ''}`} style={{ '--i': index }}>
            <div className="ba-card ba-before">
                <span className="ba-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7l6 6 4-4 8 8" /><path d="M15 17h6v-6" />
                    </svg>
                </span>
                <p><span className="ba-strike"><span className="ba-sr">Before: </span>{item.before}</span></p>
            </div>

            <span className="ba-link" aria-hidden="true">
                <span className="ba-chip">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </span>

            <div className="ba-card ba-after">
                <span className="ba-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" />
                    </svg>
                </span>
                <p><span className="ba-sr">After: </span>{item.after}</p>
            </div>
        </article>
    )
}

/* ------------------------------------------------------------------
   STYLES
------------------------------------------------------------------- */
const CSS = `
.ba-section {
  --ba-case: capitalize;
  --gold: #f5b800; --red: #ff6b6b; --ink: #2c1368;
  position: relative; overflow: hidden; color: #fff;
  padding: 56px 16px 64px;
  background: linear-gradient(165deg, #1a0a45 0%, #2c1368 55%, #3b1a8c 100%);
}
.ba-section *, .ba-section *::before, .ba-section *::after { box-sizing: border-box; }
.ba-section *:not(svg *) { text-transform: var(--ba-case); }
.ba-section svg text { text-transform: var(--ba-case); }
.ba-wrap { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }
.ba-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.ba-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.ba-orb-1 { width: 260px; height: 260px; background: #7c3aed; opacity: .45; top: -90px; left: -90px; }
.ba-orb-2 { width: 220px; height: 220px; background: var(--gold); opacity: .12; bottom: -90px; right: -70px; }

/* ---------- heading ---------- */
.ba-head { text-align: center; }
.ba-title { margin: 0 0 8px; font-size: clamp(28px, 6.5vw, 44px); line-height: 1.12; font-weight: 800; text-wrap: balance; }
.ba-sub { margin: 0 auto; max-width: 480px; color: rgba(255,255,255,.75); font-size: 15px; line-height: 1.5; }

/* ---------- chart ---------- */
.ba-chart-card {
  margin: 26px auto 0; max-width: 640px; padding: 14px 14px 8px;
  border-radius: 18px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14);
  opacity: 0; transform: translateY(12px);
}
.ba-chart-card.is-in { animation: ba-up .6s ease forwards; }
.ba-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; padding: 0 4px 4px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.85); }
.ba-key { display: inline-flex; align-items: center; gap: 7px; }
.ba-key::before { content: ""; width: 14px; height: 4px; border-radius: 4px; }
.ba-key-down::before { background: var(--red); }
.ba-key-up::before { background: var(--gold); }

.ba-chart { display: block; width: 100%; height: auto; overflow: visible; }
.ba-grid line { stroke: rgba(255,255,255,.1); stroke-width: 1; stroke-dasharray: 3 4; }
.ba-axis { fill: rgba(255,255,255,.5); font-size: 9.5px; font-weight: 600; }
.ba-note { font-size: 10.5px; font-weight: 800; }
.ba-note-start { fill: rgba(255,255,255,.85); }
.ba-note-down { fill: #ff9a9a; }
.ba-note-up { fill: var(--gold); font-size: 12px; }

.ba-line { fill: none; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
.ba-line-up { stroke: var(--gold); stroke-width: 3.4; }
.ba-line-down { stroke: var(--red); }
.ba-gap { stroke: rgba(255,255,255,.35); stroke-width: 1.5; stroke-dasharray: 2 3; opacity: 0; }
.ba-area, .ba-dot, .ba-note-down, .ba-note-up { opacity: 0; }
.ba-dot { transform-box: fill-box; transform-origin: center; }
.ba-dot-start { fill: #fff; opacity: 1; }
.ba-dot-down { fill: var(--red); }
.ba-dot-up { fill: var(--gold); }

.ba-chart-card.is-in .ba-line-down { animation: ba-draw 1.6s .3s ease-out forwards; }
.ba-chart-card.is-in .ba-line-up { animation: ba-draw 2.2s .3s cubic-bezier(.4,.1,.2,1) forwards; }
.ba-chart-card.is-in .ba-area { animation: ba-fade .8s 1.8s ease forwards; }
.ba-chart-card.is-in .ba-dot-down, .ba-chart-card.is-in .ba-note-down { animation: ba-pop .4s 1.9s ease forwards; }
.ba-chart-card.is-in .ba-dot-up, .ba-chart-card.is-in .ba-note-up { animation: ba-pop .4s 2.5s ease forwards; }
.ba-chart-card.is-in .ba-gap { animation: ba-fade .5s 2.6s ease forwards; }
.ba-chart-card.is-in .ba-dot-up { animation: ba-pop .4s 2.5s ease forwards, ba-pulse 2.2s 3.2s ease-out infinite; }

@keyframes ba-draw { to { stroke-dashoffset: 0; } }
@keyframes ba-fade { to { opacity: 1; } }
@keyframes ba-pop { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
@keyframes ba-pulse { 0% { filter: drop-shadow(0 0 0 rgba(245,184,0,.8)); } 100% { filter: drop-shadow(0 0 10px rgba(245,184,0,0)); } }
@keyframes ba-up { to { opacity: 1; transform: none; } }

/* ---------- pairs ---------- */
.ba-list { display: grid; gap: 14px; margin: 26px auto 0; max-width: 720px; }
.ba-pair { display: grid; align-items: center; opacity: 0; transform: translateY(12px); }
.ba-pair.is-in { animation: ba-up .5s calc(var(--i) * .12s) ease forwards; }

.ba-card { display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 10px 14px; border-radius: 14px; }
.ba-card p { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.3; }
.ba-badge { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; }
.ba-before { background: rgba(255,255,255,.05); border: 1px solid rgba(255,107,107,.4); color: #ffd9d9; }
.ba-before .ba-badge { background: rgba(255,107,107,.16); color: #ff8a8a; }
.ba-after { background: linear-gradient(135deg, rgba(245,184,0,.2), rgba(124,58,237,.4)); border: 1px solid rgba(245,184,0,.7); }
.ba-after .ba-badge { background: var(--gold); color: var(--ink); }

.ba-strike { background: linear-gradient(var(--red), var(--red)) 0 55% / 0% 2px no-repeat; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.ba-pair.is-in .ba-strike { animation: ba-strike .5s calc(var(--i) * .12s + .6s) ease forwards; }
@keyframes ba-strike { to { background-size: 100% 2px; } }

/* compact connector: small chip, overlaps the cards on mobile, narrow column on desktop */
.ba-link { position: relative; z-index: 1; display: grid; place-items: center; height: 14px; }
.ba-chip { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--gold); color: var(--ink); box-shadow: 0 0 0 3px #2c1368; transform: rotate(90deg); }
@media (min-width: 640px) {
  .ba-list { gap: 12px; }
  .ba-pair { grid-template-columns: 1fr 34px 1fr; }
  .ba-link { height: auto; }
  .ba-chip { transform: none; }
  .ba-card { min-height: 56px; }
}

/* ---------- closing + button ---------- */
.ba-cta { display: flex; flex-direction: column; align-items: center; gap: 16px; margin: 36px auto 0; text-align: center; opacity: 0; transform: translateY(12px); }
.ba-cta.is-in { animation: ba-up .6s ease forwards; }
.ba-cta p { margin: 0; font-size: clamp(19px, 4.6vw, 26px); font-weight: 800; line-height: 1.25; text-wrap: balance; }
.ba-cta-btn { display: flex; justify-content: center; width: 100%; max-width: 360px; }
.ba-cta-btn > * { width: 100%; justify-content: center; text-align: center; }
@media (min-width: 640px) { .ba-cta-btn { width: auto; max-width: none; } .ba-cta-btn > * { width: auto; } }

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .ba-section *, .ba-section *::before, .ba-section *::after { animation: none !important; }
  .ba-chart-card, .ba-pair, .ba-cta { opacity: 1 !important; transform: none !important; }
  .ba-line { stroke-dashoffset: 0 !important; }
  .ba-area, .ba-dot, .ba-gap, .ba-note-down, .ba-note-up { opacity: 1 !important; }
  .ba-strike { background-size: 100% 2px !important; }
}
`

/* ------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------- */
export default function BeforeAfter() {
    const [ctaRef, ctaSeen] = useInView(0.4)

    return (
        <section id="before-after" className="ba-section" aria-labelledby="ba-title">
            <style>{CSS}</style>
            <span className="ba-orb ba-orb-1" aria-hidden="true" />
            <span className="ba-orb ba-orb-2" aria-hidden="true" />

            <div className="ba-wrap">
                <div className="ba-head">
                    <h2 id="ba-title" className="ba-title">{TITLE}</h2>
                    <p className="ba-sub">{SUB}</p>
                </div>

                <Chart />

                <div className="ba-list">
                    {PAIRS.map((item, i) => <Pair key={item.before} item={item} index={i} />)}
                </div>

                <div ref={ctaRef} className={`ba-cta ${ctaSeen ? 'is-in' : ''}`}>
                    <p>{CLOSING}</p>
                    <div className="ba-cta-btn">
                        <Button href={content.cta.href}>{content.fit.ctaLabel}</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}