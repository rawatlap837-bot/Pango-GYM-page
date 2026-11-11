import { content } from '../content'

export default function Footer() {
  return <footer className="site-footer"><div className="site-width footer-inner"><a href="#top" className="brand-mark"><span className="brand-icon" aria-hidden="true">G</span><span>{content.brand}<small>WITH AZHAR ALI SAYED</small></span></a><p>{content.footer.text}</p><a href="#top">Back To Top ↑</a></div><div className="footer-bottom site-width"><span>WORKSHOP FOR GYM OWNERS</span><span>STRATEGY · CLARITY · GROWTH</span></div></footer>
}
