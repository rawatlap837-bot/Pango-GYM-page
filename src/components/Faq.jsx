import { content } from '../content'

export default function Faq() {
  return (
    <section id="faq" className="section-pad faq-section">
      <div className="site-width faq-layout">
        <div className="faq-heading"><span className="eyebrow">THE DETAILS</span><h2>{content.faq.title}</h2><p>Find Out What To Expect Before You Reserve Your Place.</p></div>
        <div className="faq-list">{content.faq.items.map((item) => <details key={item.q} className="faq-item"><summary>{item.q}<b aria-hidden="true">+</b></summary><p>{item.a}</p></details>)}</div>
      </div>
    </section>
  )
}
