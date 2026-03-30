import { Link } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'

const COVER_IMG = `${import.meta.env.BASE_URL}images/vbos-2026-business-plan-cover.png`

export default function CoverPage() {
  return (
    <div className="app app--cover">
      <section className="cover cover--landing" aria-label="2026 Business Plan cover">
        <div className="cover-frame">
          <img
            src={COVER_IMG}
            alt="Vanuatu Bureau of Statistics — 2026 Business Plan cover"
            className="cover-image"
            width={1200}
            height={900}
          />
        </div>
        <div className="cover-caption">
          <p className="org-name-fr">Bureau des Statistiques du Vanuatu</p>
          <p className="cover-title">Section monitoring dashboard</p>
          <div className="cover-cta">
            <Link to="/sections" className="cover-cta-button">
              View departmental work plans
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
