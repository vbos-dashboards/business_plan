import { Link } from 'react-router-dom'

export function PageNav() {
  return (
    <nav className="page-nav" aria-label="Site">
      <Link to="/" className="page-nav-link">
        Cover
      </Link>
      <span className="page-nav-sep" aria-hidden>
        ·
      </span>
      <Link to="/sections" className="page-nav-link">
        All sections
      </Link>
    </nav>
  )
}
