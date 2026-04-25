import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import CrisisModal from './components/CrisisModal'
import Home from './pages/Home'
import Journal from './pages/Journal'
import Mood from './pages/Mood'
import Wellness from './pages/Wellness'

export default function App() {
  const [crisisOpen, setCrisisOpen] = useState(false)

  return (
    <Router>
      <div className="app">
        {crisisOpen && <CrisisModal onClose={() => setCrisisOpen(false)} />}
        <Routes>
          <Route path="/" element={<Home onCrisis={() => setCrisisOpen(true)} />} />
          <Route path="/journal" element={<Journal onCrisis={() => setCrisisOpen(true)} />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/wellness" element={<Wellness />} />
        </Routes>
        <Navigation onCrisis={() => setCrisisOpen(true)} />
      </div>
    </Router>
  )
}
