const iconPaths = {
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M7 6V4h10v2" /><path d="M16 14h.01" /></>,
  coins: <><circle cx="8" cy="8" r="5" /><path d="M3 8v4a5 5 0 0 0 9.5 2M8 3v10M5.5 5.5h5M5.5 8.5h5" /><path d="M14 7.5a5 5 0 1 1 0 9M14 12h5" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 6-7" /><path d="M16 6h4v4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  tag: <><path d="M20.6 13.4 11 3.8A2.7 2.7 0 0 0 9.1 3H4a1 1 0 0 0-1 1v5.1a2.7 2.7 0 0 0 .8 1.9l9.6 9.6a2 2 0 0 0 2.8 0l4.4-4.4a2 2 0 0 0 0-2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /><path d="M8.5 11h5M11 8.5v5" /></>,
  checklist: <><path d="m3 6 2 2 3-3M11 6h10M3 12l2 2 3-3M11 12h10M3 18l2 2 3-3M11 18h10" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /><path d="m13 11 7-7M16 4h4v4" /></>,
  route: <><circle cx="6" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><path d="M9 18h2a4 4 0 0 0 4-4V10a4 4 0 0 1 4-4" /></>,
}

export default function LineIcon({ name, className = '' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name] ?? iconPaths.target}
    </svg>
  )
}
