import { Navigate, Route, Routes } from 'react-router-dom'
import CoverPage from './pages/CoverPage'
import SectionDetailPage from './pages/SectionDetailPage'
import SectionsIndexPage from './pages/SectionsIndexPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CoverPage />} />
      <Route path="/sections" element={<SectionsIndexPage />} />
      <Route path="/section/:sectionId" element={<SectionDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
