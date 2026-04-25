import { NavLink } from 'react-router-dom'
import { Home, BookOpen, BarChart2, Sparkles, Phone } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',         icon: Home,      label: 'Home'     },
  { to: '/journal',  icon: BookOpen,  label: 'Journal'  },
  { to: '/mood',     icon: BarChart2, label: 'Mood'     },
  { to: '/wellness', icon: Sparkles,  label: 'Wellness' },
]

export default function Navigation({ onCrisis }) {
  return (
    <>
      {/* ── Desktop top nav ─────────────────────────────────────────── */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          <NavLink to="/" className="top-nav-logo">
            🐢 TerpMind
          </NavLink>

          <div className="top-nav-links">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `top-nav-item${isActive ? ' active' : ''}`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              University of Maryland
            </span>
            <button className="top-nav-crisis" onClick={onCrisis}>
              <Phone size={14} />
              Crisis Help
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom nav ───────────────────────────────────────── */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
        <button className="nav-item crisis-btn" onClick={onCrisis} aria-label="Crisis help">
          <Phone className="nav-icon" />
          <span className="nav-label">Help</span>
        </button>
      </nav>
    </>
  )
}
