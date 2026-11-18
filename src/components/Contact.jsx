import { content } from '../content'
import Button from './Button'

const css = `
.offer-section .offer-content {
  position: relative;
  z-index: 1;
  max-width: 620px;
  margin: 0 auto;
}
.offer-section .offer-orbit {
  pointer-events: none;
}
.offer-section .offer-eyebrow-wrap {
  text-align: center;
  margin-bottom: 18px;
}
.offer-section .offer-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 999px;
  background: rgba(241, 201, 53, 0.14);
  border: 1px solid rgba(241, 201, 53, 0.42);
  color: #ffd84d;
  font-size: clamp(12.5px, 3.4vw, 15px);
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
}
.offer-section .offer-heading {
  margin: 0 auto 28px;
  text-align: center;
  text-wrap: balance;
  font-size: clamp(26px, 4.4vw, 42px);
  line-height: 1.2;
}
.offer-section .offer-highlight-price {
  color: #f1c935;
  font-size: 1.08em;
  font-weight: 900;
  text-shadow: 0 2px 14px rgba(241, 201, 53, 0.45);
}
.offer-section .offer-box {
  margin-top: 0;
  max-width: 620px;
  padding: 26px 24px 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(14px);
}
.offer-section .offer-box-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}
.offer-section .offer-badge-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: clamp(12px, 3vw, 13.5px);
  font-weight: 850;
  letter-spacing: 0.08em;
  color: #ffffff;
  text-transform: uppercase;
  white-space: nowrap;
}
.offer-section .offer-badge-label::before {
  content: '★';
  color: #f1c935;
  font-size: 13px;
}
.offer-section .offer-total-val {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(14px, 3.4vw, 19px);
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.offer-section .offer-val-amount {
  color: #f1c935;
  font-size: clamp(16px, 3.8vw, 22px);
  font-weight: 900;
  text-decoration: line-through;
  opacity: 0.9;
}
.offer-section .offer-val-free {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 7px;
  background: #f1c935;
  color: #240d3a;
  font-size: clamp(12.5px, 3.2vw, 14px);
  font-weight: 950;
  letter-spacing: 0.05em;
}

@media (max-width: 520px) {
  .offer-section .offer-box-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding-bottom: 14px;
  }
  .offer-section .offer-badge-label {
    white-space: normal;
    letter-spacing: 0.09em;
  }
}

/* Bonus List */
.offer-section .offer-bonus-list {
  display: grid;
  gap: 10px;
  margin: 20px 0 22px;
  padding: 0;
  list-style: none;
}
.offer-section .offer-bonus-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.offer-section .offer-bonus-item:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(241, 201, 53, 0.4);
}
.offer-section .offer-bonus-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 1 auto;
  min-width: 0;
}
.offer-section .offer-bonus-num {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(241, 201, 53, 0.18);
  color: #f1c935;
  font-size: 12px;
  font-weight: 850;
  flex-shrink: 0;
}
.offer-section .offer-bonus-title {
  color: #ffffff;
  font-size: clamp(14px, 3.4vw, 16px);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0;
  text-align: left;
}
.offer-section .offer-bonus-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #f1c935;
  color: #240d3a;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(241, 201, 53, 0.38);
}
.offer-section .offer-bonus-badge strong {
  font-size: 18px;
  font-weight: 950;
  letter-spacing: 0.02em;
}

@media (max-width: 520px) {
  .offer-section .offer-box {
    padding: 20px 14px 22px;
  }
  .offer-section .offer-bonus-item {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px;
    padding: 11px 12px;
  }
  .offer-section .offer-bonus-main {
    flex: 1 1 100%;
  }
  .offer-section .offer-bonus-badge {
    margin-left: 38px;
    font-size: 13px;
    padding: 5px 12px;
  }
  .offer-section .offer-bonus-badge strong {
    font-size: 17px;
  }
}

.offer-section .offer-box .button-primary {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 12px 14px;
  font-size: clamp(14px, 4vw, 17px);
}
@media (max-width: 640px) {
  .offer-section .offer-box .button-primary {
    font-size: clamp(12px, 3.8vw, 15px) !important;
  }
}
`

export default function Contact() {
  const { eyebrow, totalValue, bonuses, reassurance } = content.offer

  return (
    <section id="register" className="offer-section section-pad">
      <style>{css}</style>
      <div className="offer-orbit offer-orbit-one" aria-hidden="true" />
      <div className="offer-orbit offer-orbit-two" aria-hidden="true" />

      <div className="site-width offer-content">
        {eyebrow && (
          <div className="offer-eyebrow-wrap">
            <span className="offer-eyebrow">{eyebrow}</span>
          </div>
        )}

        <h2 className="offer-heading">
          Wait! There's More – Get 7 Exclusive Bonuses Worth{' '}
          <span className="offer-highlight-price">{totalValue}</span> FREE!
        </h2>

        <div className="offer-box">
          <div className="offer-box-top">
            <span className="offer-badge-label">7 EXCLUSIVE BONUSES INCLUDED</span>
            <strong className="offer-total-val">
              WORTH <span className="offer-val-amount">{totalValue}</span>{' '}
              <span className="offer-val-free">FREE</span>
            </strong>
          </div>

          <ul className="offer-bonus-list">
            {bonuses.map((b) => (
              <li key={b.id} className="offer-bonus-item">
                <div className="offer-bonus-main">
                  <span className="offer-bonus-num">{b.id}</span>
                  <span className="offer-bonus-title">{b.title}</span>
                </div>
                <span className="offer-bonus-badge">
                  Value: <strong>{b.value}</strong>
                </span>
              </li>
            ))}
          </ul>

          <Button href={content.cta.href} arrow={false}>
            {content.cta.label}
          </Button>
          {reassurance && <p className="offer-reassurance">{reassurance}</p>}
        </div>
      </div>
    </section>
  )
}
