import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Settings - everything lives in this one file                       */
/* ------------------------------------------------------------------ */
const FIRST_DELAY = 3000 // ms before the first popup appears
const VISIBLE_MS = 4500  // how long each popup stays on screen
const GAP_MS = 8000      // average ms between popups (varies a little each time)
const LINK = '#register'
const MESSAGE = 'just registered'

// Replace these with your own names, cities and times (add or remove rows freely)
const SIGNUPS = [
    { name: 'Aditya', city: 'Noida', ago: '8 seconds ago' },
    { name: 'Priya', city: 'Delhi', ago: '25 seconds ago' },
    { name: 'Rahul', city: 'Greater Noida', ago: '1 minute ago' },
    { name: 'Neha', city: 'Ghaziabad', ago: '2 minutes ago' },
    { name: 'Rohit', city: 'Gurugram', ago: '3 minutes ago' },
    { name: 'Ankit', city: 'Meerut', ago: '4 minutes ago' },
    { name: 'Pooja', city: 'Lucknow', ago: '6 minutes ago' },
    { name: 'Vikram', city: 'Faridabad', ago: '7 minutes ago' },
    { name: 'Sneha', city: 'Jaipur', ago: '9 minutes ago' },
    { name: 'Mohit', city: 'Noida', ago: '11 minutes ago' },
    { name: 'Kavita', city: 'Dehradun', ago: '13 minutes ago' },
    { name: 'Arjun', city: 'Chandigarh', ago: '15 minutes ago' },
    { name: 'Deepak', city: 'Delhi', ago: '18 minutes ago' },
    { name: 'Simran', city: 'Ludhiana', ago: '21 minutes ago' },
    { name: 'Karan', city: 'Agra', ago: '24 minutes ago' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function UrgencyNotice() {
    const [current, setCurrent] = useState(null)
    const [visible, setVisible] = useState(false)
    const [closed, setClosed] = useState(false)

    useEffect(() => {
        if (closed || SIGNUPS.length === 0) return undefined

        let index = 0
        let showTimer = 0
        let hideTimer = 0

        const show = () => {
            setCurrent(SIGNUPS[index % SIGNUPS.length])
            setVisible(true)

            hideTimer = window.setTimeout(() => {
                setVisible(false)
                index += 1
                // slightly different gap every time so it feels natural
                showTimer = window.setTimeout(show, GAP_MS * (0.75 + Math.random() * 0.5))
            }, VISIBLE_MS)
        }

        showTimer = window.setTimeout(show, FIRST_DELAY)
        return () => {
            window.clearTimeout(showTimer)
            window.clearTimeout(hideTimer)
        }
    }, [closed])

    if (closed || SIGNUPS.length === 0) return null

    const initial = current ? current.name.trim().charAt(0).toUpperCase() : ''
    const details = current ? [current.city, current.ago].filter(Boolean).join(' · ') : ''

    return (
        <div
            className="pointer-events-none fixed left-3 top-3 z-[90] sm:left-5 sm:top-5"
            role="status"
            aria-live="polite"
        >
            {current && (
                <div
                    aria-hidden={!visible}
                    className={`flex w-max max-w-[min(16rem,calc(100vw-1.5rem))] items-center gap-2 rounded-xl border border-slate-200 bg-white/95 py-1.5 pl-1.5 pr-1 shadow-lg shadow-slate-950/15 backdrop-blur transition duration-300 ease-out motion-reduce:transition-none ${visible ? 'pointer-events-auto translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                        }`}
                >
                    <a
                        href={LINK}
                        tabIndex={visible ? 0 : -1}
                        className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                        <span
                            className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
                            aria-hidden="true"
                        >
                            {initial}
                        </span>
                        <span className="min-w-0 leading-tight">
                            <span className="block truncate text-xs text-slate-700">
                                <span className="font-semibold text-slate-900">{current.name}</span> {MESSAGE}
                            </span>
                            {details && <span className="block truncate text-[11px] text-slate-500">{details}</span>}
                        </span>
                    </a>
                    <button
                        type="button"
                        onClick={() => setClosed(true)}
                        tabIndex={visible ? 0 : -1}
                        aria-label="Dismiss notification"
                        className="grid size-5 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
                    >
                        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}