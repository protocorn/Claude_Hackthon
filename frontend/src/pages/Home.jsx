import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { HomeIllustration } from '../components/Illustrations'

const HOUR_GREETING = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const MOOD_EMOJI = (score) => {
  if (score <= 2) return '😔'
  if (score <= 4) return '😕'
  if (score <= 6) return '😐'
  if (score <= 8) return '🙂'
  return '😊'
}

const TREND_CONFIG = {
  improving: { icon: TrendingUp,   color: 'var(--success)', label: 'Improving' },
  declining:  { icon: TrendingDown, color: 'var(--danger)',  label: 'Declining' },
  stable:     { icon: Minus,        color: 'var(--secondary)', label: 'Stable'  },
  mixed:      { icon: Minus,        color: 'var(--warning)', label: 'Mixed'     },
}

export default function Home({ onCrisis }) {
  const [moodData,    setMoodData]    = useState(null)
  const [journalData, setJournalData] = useState(null)
  const [trendKey,    setTrendKey]    = useState(null)

  useEffect(() => {
    const moods    = JSON.parse(localStorage.getItem('tm_mood')    || '[]')
    const journals = JSON.parse(localStorage.getItem('tm_journal') || '[]')
    if (moods.length    > 0) setMoodData(moods[moods.length - 1])
    if (journals.length > 0) setJournalData(journals[journals.length - 1])

    if (moods.length >= 2) {
      const last = moods.slice(-3).map(m => m.score)
      const diff = last[last.length - 1] - last[0]
      if (diff >= 1.5) setTrendKey('improving')
      else if (diff <= -1.5) setTrendKey('declining')
      else setTrendKey('stable')
    }
  }, [])

  const TrendIcon = trendKey ? TREND_CONFIG[trendKey]?.icon : null

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero-card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="hero-greeting">{HOUR_GREETING()}, Terp</div>
            <div className="hero-title">
              {moodData
                ? `You're feeling ${MOOD_EMOJI(moodData.score)} today`
                : 'How are you feeling?'}
            </div>
            <div className="hero-subtitle">
              {moodData
                ? `Last check-in: ${moodData.score}/10 · ${new Date(moodData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                : 'TerpMind is here to listen, reflect, and support you.'}
            </div>

            {trendKey && TrendIcon && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
                background: 'rgba(255,255,255,0.18)', padding: '6px 14px',
                borderRadius: 20, fontSize: 13, fontWeight: 600,
              }}>
                <TrendIcon size={14} />
                {TREND_CONFIG[trendKey].label} trend
              </div>
            )}
          </div>
          <HomeIllustration size={130} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-grid">
        <Link to="/journal" className="quick-card">
          <span className="quick-card-icon">📔</span>
          <div className="quick-card-title">Journal</div>
          <div className="quick-card-desc">Write freely. I'll reflect it back with care.</div>
        </Link>
        <Link to="/mood" className="quick-card">
          <span className="quick-card-icon">📊</span>
          <div className="quick-card-title">Mood Check-in</div>
          <div className="quick-card-desc">Log how you feel and spot your patterns.</div>
        </Link>
        <Link to="/wellness" className="quick-card">
          <span className="quick-card-icon">✨</span>
          <div className="quick-card-title">Wellness</div>
          <div className="quick-card-desc">Personalized micro-actions for right now.</div>
        </Link>
        <button
          onClick={onCrisis}
          className="quick-card"
          style={{ border: '1.5px solid rgba(224,60,49,0.25)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="quick-card-icon">🆘</span>
          <div className="quick-card-title" style={{ color: 'var(--umd-red)' }}>Crisis Help</div>
          <div className="quick-card-desc">UMD resources available 24/7.</div>
        </button>
      </div>

      {/* Recent journal — full width */}
      {journalData && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
              📔 Latest Journal Entry
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {new Date(journalData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
            "{journalData.entry.slice(0, 200)}{journalData.entry.length > 200 ? '…' : ''}"
          </p>
          {journalData.themes?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {journalData.themes.map((t) => (
                <span key={t} className="badge badge-purple">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px', gap: 12, alignItems: 'center' }}>
        <div className="umd-tag">🐢 University of Maryland</div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Built with ❤️ for Terps
        </p>
      </div>
    </div>
  )
}
