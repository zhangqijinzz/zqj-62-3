import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import ArchivePage from './pages/ArchivePage'
import PackingPage from './pages/PackingPage'
import TimelinePage from './pages/TimelinePage'
import ParkourPage from './pages/ParkourPage'
import StoriesPage from './pages/StoriesPage'
import IdentityPage from './pages/IdentityPage'
import CommunityPage from './pages/CommunityPage'

function App() {
  return (
    <div className="min-h-screen paper-texture">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/scanner/archive" element={<ArchivePage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/packing/timeline" element={<TimelinePage />} />
          <Route path="/parkour" element={<ParkourPage />} />
          <Route path="/parkour/stories" element={<StoriesPage />} />
          <Route path="/identity" element={<IdentityPage />} />
          <Route path="/identity/community" element={<CommunityPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
