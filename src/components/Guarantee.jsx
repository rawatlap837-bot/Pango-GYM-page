import Button from './Button'
import { content } from '../content'

/* ===== Section copy (everything lives in this one file) =====
   headline = short title under each outcome label (edit or delete freely)
   bold     = important words in heavier weight
   mark     = the ONE key promise/risk per block, shown with a yellow highlighter */
const copy = {
  title: 'There Are Only 2 Possible Outcomes After The Call:',
  options: [
    {
      headline: 'Not Useful? Get Your ₹97 Back',
      text: "You Attend The Call, But You Don't Find It Useful. Just Message Us, And We'll Refund Your ₹97 Within 1 Hour.",
      bold: ["You Don't Find It Useful", 'Just Message Us'],
      mark: ['Refund Your ₹97 Within 1 Hour'],
    },
    {
      headline: 'Useful? Double Your Profit In 90 Days',
      text: "You Attend The Call, Understand The Strategies, Take Notes, And Start Implementing What You Learn In Your Gym. And Within 90 Days, You Double Your Gym's Profit.",
      bold: ['Understand The Strategies', 'Start Implementing', 'Within 90 Days'],
      mark: ["Double Your Gym's Profit"],
    },
  ],
  choice: {
    text: "The Choice Is Yours. Either Way, You Have Nothing To Lose. It's A Win-Win Situation For You.",
    bold: ['The Choice Is Yours.', 'Win-Win'],
    mark: ['Nothing To Lose'],
  },
  risk: {
    intro: {
      text: "But If You Don't Take Action Today, Your Gym's Situation Won't Change. In Fact, It Could Get Worse Day By Day.",
      bold: ["Don't Take Action Today", "Won't Change"],
      mark: ['Worse Day By Day'],
    },
    worstCaseLabel: 'And The Worst-Case Scenario:',
    paragraphs: [
      {
        text: 'If Your Competitors Book The Call, Learn These Strategies, And Start Implementing Them Before You Do?',
        bold: ['Competitors', 'Before You Do'],
        mark: [],
      },
      {
        text: 'They Could Make It Even Harder For Your Gym To Survive. You Might Even Be Forced To Shut Down Your Gym.',
        bold: ['Even Harder'],
        mark: ['Forced To Shut Down Your Gym'],
      },
    ],
  },
  closing: {
    text: 'So, Book The Call Before Your Competitors Do.',
    bold: ['Book The Call'],
    mark: ['Before Your Competitors Do'],
  },
}

/* ===== Styles (scoped, no other CSS file needed) ===== */
const css = `
/* One calm emphasis system: bold = weight only, mark = yellow highlighter */
.guarantee-section strong,
.guarantee-section .gx-bold {
  font-weight: 700;
  color: inherit;
}
.guarantee-section .gx-mark {
  color: inherit;
  font-weight: 700;
  padding: 0 0.15em;
  border-radius: 0.2em;
  background: linear-gradient(transparent 55%, rgba(255, 214, 0, 0.65) 55%);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* Outcome cards: headline under the "Outcome n" pill */
.guarantee-section .guarantee-card h3 {
  text-wrap: balance;
  letter-spacing: -0.02em;
}
.guarantee-section .section-heading h2 {
  font-family: var(--font-heading) !important;
  font-size: 25px;
  font-weight: 400 !important;
  line-height: 28px;
  letter-spacing: 0.02em;
}
.guarantee-section .guarantee-card p {
  text-wrap: pretty;
  line-height: 1.65;
}

/* "The choice is yours" */
.guarantee-choice {
  max-width: 44rem;
  margin: 2.5rem auto 0;
  padding: 1.15rem 1.5rem 1.3rem;
  text-align: center;
  text-wrap: balance;
  font-size: clamp(1.1rem, 2.4vw, 1.4rem);
  font-weight: 600;
  line-height: 1.45;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid rgba(255, 214, 0, 0.6);
  box-shadow: 0 14px 34px -16px rgba(30, 16, 56, 0.28), inset 0 -4px 0 var(--accent, #ffd600);
}

/* Cost of not acting + worst case */
.guarantee-risk {
  max-width: 44rem;
  margin: 1.5rem auto 0;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
  text-align: left;
  font-size: clamp(0.98rem, 1.9vw, 1.08rem);
  line-height: 1.65;
  border-radius: 1.1rem;
  border: 1px solid rgba(239, 68, 68, 0.22);
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03));
}
.guarantee-risk-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  color: #dc2626;
  background: rgba(239, 68, 68, 0.14);
}
.guarantee-risk-body {
  display: grid;
  gap: 0.85rem;
}
.guarantee-risk-body p { margin: 0; }
.guarantee-risk-label {
  margin-top: 0.35rem !important;
  padding-top: 1rem;
  font-weight: 800;
  color: #b91c1c;
  border-top: 1px dashed rgba(239, 68, 68, 0.35);
}

/* Closing panel + CTA */
.guarantee-final {
  max-width: 44rem;
  margin: 1.75rem auto 0;
  padding: clamp(1.75rem, 4vw, 2.6rem) 1.5rem;
  text-align: center;
  color: #fff;
  border-radius: 1.4rem;
  background: linear-gradient(135deg, #1e1038, #3b1a78);
  box-shadow: 0 26px 50px -26px rgba(30, 16, 56, 0.75);
}
.guarantee-closing {
  margin: 0;
  text-wrap: balance;
  font-size: clamp(1.35rem, 3.6vw, 2rem);
  font-weight: 800;
  line-height: 1.25;
}
.guarantee-final .gx-bold { color: #fff; }
.guarantee-final .gx-mark {
  padding: 0;
  color: var(--accent, #ffd600);
  background: none;
}
.guarantee-final .center-action { margin-top: 1.6rem; }

@media (max-width: 640px) {
  .guarantee-choice { padding: 1rem 1rem 1.15rem; }
  .guarantee-risk {
    grid-template-columns: 1fr;
    gap: 0.9rem;
    padding: 1.25rem 1.1rem;
  }
  .guarantee-section .guarantee-card,
  .guarantee-section .guarantee-card:last-child {
    padding-bottom: 0 !important;
    overflow: hidden;
  }
  .guarantee-section .guarantee-card .guarantee-illustration,
  .guarantee-section .guarantee-card:last-child .guarantee-illustration {
    margin-top: auto;
    margin-bottom: 0 !important;
    object-position: center bottom;
    transform: translateY(4px);
  }
}
`

/* Wraps important phrases: bold -> <strong>, mark -> highlighter <mark> */
function rich(text, bold = [], mark = []) {
  const matches = [
    ...bold.map((phrase) => ({ phrase, type: 'bold', index: text.indexOf(phrase) })),
    ...mark.map((phrase) => ({ phrase, type: 'mark', index: text.indexOf(phrase) })),
  ]
    .filter((m) => m.index >= 0)
    .sort((a, b) => a.index - b.index)

  if (!matches.length) return text

  const parts = []
  let cursor = 0
  matches.forEach(({ phrase, type, index }) => {
    if (index < cursor) return // skip overlaps
    parts.push(text.slice(cursor, index))
    parts.push(
      type === 'mark' ? (
        <mark key={`${index}-${phrase}`} className="gx-mark">{phrase}</mark>
      ) : (
        <strong key={`${index}-${phrase}`} className="gx-bold">{phrase}</strong>
      ),
    )
    cursor = index + phrase.length
  })
  parts.push(text.slice(cursor))
  return parts
}

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17v.01" />
  </svg>
)

export default function Guarantee() {
  /* Illustrations are still read from your existing content.js (guarantee.options[i].image / imageAlt) */
  const existing = content.guarantee?.options ?? []

  return (
    <section className="section-pad guarantee-section">
      <style>{css}</style>

      <div className="site-width">
        <div className="section-heading">
          <h2>{copy.title}</h2>
        </div>

        {/* ===== The 2 outcomes ===== */}
        <div className="guarantee-grid">
          {copy.options.map((item, i) => (
            <article className="guarantee-card" key={item.headline}>
              <span>{`Outcome ${i + 1}`}</span>
              <h3>{item.headline}</h3>
              <p>{rich(item.text, item.bold, item.mark)}</p>
              {existing[i]?.image && (
                <img
                  className="guarantee-illustration"
                  src={existing[i].image}
                  alt={existing[i].imageAlt ?? ''}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </article>
          ))}
        </div>

        {/* ===== "The choice is yours" ===== */}
        <p className="guarantee-choice">
          {rich(copy.choice.text, copy.choice.bold, copy.choice.mark)}
        </p>

        {/* ===== Cost of not acting + worst case ===== */}
        <div className="guarantee-risk">
          <span className="guarantee-risk-icon">
            <WarningIcon />
          </span>
          <div className="guarantee-risk-body">
            <p>{rich(copy.risk.intro.text, copy.risk.intro.bold, copy.risk.intro.mark)}</p>
            <p className="guarantee-risk-label">{copy.risk.worstCaseLabel}</p>
            {copy.risk.paragraphs.map((p) => (
              <p key={p.text}>{rich(p.text, p.bold, p.mark)}</p>
            ))}
          </div>
        </div>

        {/* ===== Closing panel + CTA ===== */}
        <div className="guarantee-final">
          <p className="guarantee-closing">
            {rich(copy.closing.text, copy.closing.bold, copy.closing.mark)}
          </p>
          <div className="center-action">
            <Button href={content.cta.href}>{content.cta.label}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
