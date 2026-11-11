import { content } from '../content'
import Button from './Button'

export default function Contact() {
  const { eyebrow, title, text, price, date, bonus, reassurance } = content.offer
  return (
    <section id="register" className="offer-section section-pad">
      <div className="offer-orbit offer-orbit-one" aria-hidden="true"/><div className="offer-orbit offer-orbit-two" aria-hidden="true"/>
      <div className="site-width offer-content">
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h2>{title}</h2><p className="offer-copy">{text}</p>
        <div className="offer-box">
          <div className="offer-box-top"><span>WORKSHOP ACCESS</span><strong>{price}</strong></div>
          <ul><li>{date}</li><li>{bonus}</li></ul>
          <Button href={content.offer.linkPlaceholder}>{content.cta.label}<span aria-hidden="true">↗</span></Button>
          <p className="offer-reassurance">{reassurance}</p>
        </div>
        <p className="offer-footnote">You’ll Be Redirected To The Workshop Registration Page.</p>
      </div>
    </section>
  )
}
