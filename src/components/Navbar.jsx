  import { content } from '../content'
import Button from './Button'

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-width nav-inner" aria-label="Main navigation">
        <a href="#top" className="brand-mark"><span className="brand-icon" aria-hidden="true">G</span><span>{content.brand}<small>WITH AZHAR ALI SAYED</small></span></a>
        <Button className="nav-cta" href={content.cta.href} arrow={false}>
          {content.cta.navLabel}
        </Button>
      </nav>
    </header>
  )
}
