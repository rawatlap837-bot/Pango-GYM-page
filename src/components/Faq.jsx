import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { content } from '../content'

// Uses brand-new class names (fq-*) so old .faq-* rules in your CSS can't hide anything.
const css = `
.fq-section {
  --fq-ink: #17141f;
  --fq-muted: #4a4658;
  --fq-line: #d9d6e0;
  --fq-accent: #6d28d9;
}
.fq-list { margin: 0; padding: 0; }
.fq-item {
  display: block;
  border-bottom: 1px solid var(--fq-line);
  opacity: 1;
}
.fq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  cursor: pointer;
  list-style: none;
  color: var(--fq-ink);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  opacity: 1;
}
.fq-item summary::-webkit-details-marker { display: none; }
.fq-item summary::marker { content: ''; }
.fq-item summary:focus-visible {
  outline: 2px solid var(--fq-accent);
  outline-offset: 4px;
  border-radius: 4px;
}
.fq-question { flex: 1; color: var(--fq-ink); }
.fq-icon {
  position: relative;
  flex: none;
  width: 14px;
  height: 14px;
}
.fq-icon::before,
.fq-icon::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 6px;
  height: 2px;
  background: var(--fq-accent);
  transition: transform 0.25s ease;
}
.fq-icon::after { transform: rotate(90deg); }
.fq-item[open] .fq-icon::after { transform: rotate(0deg); }
.fq-answer {
  padding: 0 0 1.25rem;
  max-width: 65ch;
  color: var(--fq-muted);
  line-height: 1.65;
}
.fq-answer p { margin: 0; color: var(--fq-muted); }
.fq-item summary { transition: color 0.2s ease; }
.fq-item summary:hover .fq-question { color: var(--fq-accent); }

/* Smooth open and close (Chrome, Edge, newer Safari; others open instantly) */
@supports (interpolate-size: allow-keywords) {
  .fq-item { interpolate-size: allow-keywords; }
  .fq-item::details-content {
    block-size: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      block-size 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease,
      content-visibility 0.35s allow-discrete;
  }
  .fq-item[open]::details-content {
    block-size: auto;
    opacity: 1;
  }
}

/* One soft entrance when the section scrolls into view */
.fq-list.fq-pending .fq-item {
  opacity: 0;
  transform: translateY(12px);
}
.fq-list .fq-item {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fq-list.fq-shown .fq-item { opacity: 1; transform: none; }
.fq-list.fq-shown .fq-item:nth-child(1) { transition-delay: 0ms; }
.fq-list.fq-shown .fq-item:nth-child(2) { transition-delay: 60ms; }
.fq-list.fq-shown .fq-item:nth-child(3) { transition-delay: 120ms; }
.fq-list.fq-shown .fq-item:nth-child(4) { transition-delay: 180ms; }
.fq-list.fq-shown .fq-item:nth-child(5) { transition-delay: 240ms; }
.fq-list.fq-shown .fq-item:nth-child(n+6) { transition-delay: 300ms; }

@media (prefers-reduced-motion: reduce) {
  .fq-icon::before,
  .fq-icon::after,
  .fq-item::details-content,
  .fq-list .fq-item,
  .fq-item summary { transition: none !important; }
  .fq-list.fq-pending .fq-item { opacity: 1; transform: none; }
}
`

export default function Faq() {
  const groupName = useId() // keeps only one answer open at a time
  const { title, items = [] } = content.faq

  // Fade the list in once, the first time it scrolls into view
  const listRef = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = listRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Accept either q/a or question/answer in your content file
  const rows = items.map((item) => ({
    q: item.q ?? item.question ?? '',
    a: item.a ?? item.answer ?? '',
  }))

  // FAQ structured data so search engines can show answers as rich results
  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: rows.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  )

  if (!rows.length) return null

  return (
    <section id="faq" className="section-pad fq-section" aria-labelledby="faq-title">
      <style>{css}</style>

      <div className="site-width faq-layout">
        <div className="faq-heading">
          <h2 id="faq-title">{title}</h2>
        </div>

        <div ref={listRef} className={`fq-list ${shown ? 'fq-shown' : 'fq-pending'}`}>
          {rows.map(({ q, a }, i) => (
            <details key={q || i} name={groupName} className="fq-item">
              <summary>
                <span className="fq-question">{q}</span>
                <span className="fq-icon" aria-hidden="true" />
              </summary>
              <div className="fq-answer">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  )
}