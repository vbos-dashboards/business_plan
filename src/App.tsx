import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteBanner } from './components/SiteBanner'
import CoverPage from './pages/CoverPage'
import SectionDetailPage from './pages/SectionDetailPage'
import SectionsIndexPage from './pages/SectionsIndexPage'
import './App.css'

export default function App() {
  const { pathname } = useLocation()
  const showBanner = pathname !== '/' && pathname !== ''

  return (
    <>
      {showBanner && <SiteBanner />}
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/sections" element={<SectionsIndexPage />} />
        <Route path="/section/:sectionId" element={<SectionDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
