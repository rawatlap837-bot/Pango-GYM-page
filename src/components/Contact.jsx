import { content } from '../content'
import Button from './Button'

const confirmations = [
  'Instant confirmation after payment',
  'Joining details sent on WhatsApp & email',
  'Your seat is reserved once payment is complete',
]

const css = `
.offer-section .offer-content {
  max-width: 520px;
  margin: 0 auto;
}
.offer-section .offer-heading {
  margin: 0 auto 24px;
  text-align: center;
  text-wrap: balance;
}
.offer-section .offer-box {
  margin-top: 0;
}

/* Bigger date / bonus lines */
.offer-section .offer-box ul.offer-details {
  display: grid;
  gap: 12px;
  margin: 18px 0 20px;
  padding: 0;
  list-style: none;
}
.offer-section .offer-box ul.offer-details li {
  font-size: clamp(16px, 4.6vw, 19px);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0;
  text-align: left;
}

/* Confirmation texts */
.offer-section .offer-box ul.offer-confirm {
  display: grid;
  gap: 10px;
  margin: 0 0 22px;
  padding: 16px 0 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}
.offer-section .offer-box ul.offer-confirm li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: clamp(14px, 4vw, 16px);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  text-align: left;
}
.offer-section .offer-confirm-icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  background: #f1c935;
  color: #2b1836;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
}

/* Highlighted redirect notice */
.offer-section .offer-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin: 22px auto 0;
  padding: 14px 20px;
  border-radius: 16px;
  background: #f1c935;
  color: #2b1836;
  font-size: clamp(13px, 3.6vw, 15px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-align: center;
  text-wrap: balance;
  box-shadow: 0 10px 32px rgba(241, 201, 53, 0.35);
  animation: offerRedirectPulse 2.2s ease-in-out infinite;
}
.offer-section .offer-redirect-icon {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2b1836;
  color: #f1c935;
  font-size: 13px;
  font-weight: 900;
  flex-shrink: 0;
}
.offer-section .offer-redirect strong {
  font-weight: 900;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

@keyframes offerRedirectPulse {
  0%, 100% { box-shadow: 0 10px 32px rgba(241, 201, 53, 0.35); }
  50%      { box-shadow: 0 10px 40px rgba(241, 201, 53, 0.65); }
}
@media (prefers-reduced-motion: reduce) {
  .offer-section .offer-redirect { animation: none; }
}
`

export default function Contact() {
  const { price, date, bonus, reassurance } = content.offer

  return (
    <section id="register" className="offer-section section-pad">
      <style>{css}</style>
      <div className="offer-orbit offer-orbit-one" aria-hidden="true" />
      <div className="offer-orbit offer-orbit-two" aria-hidden="true" />

      <div className="site-width offer-content">
        <h2 className="offer-heading">Confirm Your Booking Payment</h2>

        <div className="offer-box">
          <div className="offer-box-top">
            <span>WORKSHOP ACCESS</span>
            <strong>{price}</strong>
          </div>

          <ul className="offer-details">
            <li>{date}</li>
            <li>{bonus}</li>
          </ul>

          <ul className="offer-confirm">
            {confirmations.map((item) => (
              <li key={item}>
                <span className="offer-confirm-icon" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button href={content.offer.linkPlaceholder}>
            {content.cta.label}<span aria-hidden="true">↗</span>
          </Button>
          {reassurance && <p className="offer-reassurance">{reassurance}</p>}
        </div>

        <p className="offer-redirect">
          <span className="offer-redirect-icon" aria-hidden="true">↗</span>
          <span>
            You’ll be redirected to the <strong>Workshop Registration Page</strong>
          </span>
        </p>
      </div>
    </section>
  )
}