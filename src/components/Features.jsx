import { content } from '../content'
import Button from './Button'
import LineIcon from './LineIcon'

export default function Features() {
  return (
    <>
      <section id="fit" className="section-pad fit-section">
        <div className="site-width">
          <div className="section-heading"><span className="eyebrow">{content.fit.eyebrow}</span><h2>{content.fit.title}</h2><p>{content.fit.intro}</p></div>
          <div className="pain-list">{content.fit.pains.map((item, i) => {
            const phrase = content.fit.painEmphasis[i]
            const [before, after = ''] = item.split(phrase)
            return <article className="pain-item" key={item}><span className="pain-index">0{i + 1}</span><p>{before}<strong className="pain-emphasis">{phrase}</strong>{after}</p><span className="pain-mark"><LineIcon name={content.fit.painIcons[i]} className="pain-line-icon" /></span></article>
          })}</div>
          <p className="fit-transition">{content.fit.transition}</p>
          <div className="center-action"><Button href={content.cta.href}>{content.cta.label}</Button></div>
        </div>
      </section>
      <section id="workshop" className="section-pad workshop-section">
        <div className="site-width">
          <div className="section-heading"><span className="eyebrow">{content.workshop.eyebrow}</span><h2>{content.workshop.title}</h2><p>{content.workshop.intro}</p></div>
          <div className="steps-grid" aria-label="Workshop Steps">{content.workshop.steps.map((step, index) => {
            const [titleBefore, titleAfter = ''] = step.title.split(step.highlight)
            const [textBefore, textAfter = ''] = step.text.split(step.textHighlight)
            return <article className="step-card" key={step.number}>
              <span className="step-number"><span>{step.number}</span><i><LineIcon name={content.workshop.stepIcons[index]} className="step-line-icon" /></i></span>
              <div className="step-rule" />
              <h3>{titleBefore}<span className="step-highlight">{step.highlight}</span>{titleAfter}</h3>
              <p>{textBefore}<strong>{step.textHighlight}</strong>{textAfter}</p>
            </article>
          })}</div>
          <p className="steps-swipe-hint">{content.workshop.mobileHint}</p>
          <div className="workshop-bottom"><p>{content.workshop.ctaNote}</p><Button href={content.cta.href}>{content.cta.label}</Button></div>
        </div>
      </section>
    </>
  )
}
