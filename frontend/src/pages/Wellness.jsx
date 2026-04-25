import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { WellnessIllustration } from '../components/Illustrations'

const API = 'http://localhost:8000'

const CATEGORY_CONFIG = {
  breathing: { color: 'var(--secondary)', bg: 'rgba(13,148,136,0.08)',  label: 'Breathing' },
  movement:  { color: '#8B5CF6',          bg: 'rgba(139,92,246,0.08)', label: 'Movement'  },
  grounding: { color: 'var(--warning)',   bg: 'rgba(245,158,11,0.08)', label: 'Grounding' },
  social:    { color: 'var(--primary)',   bg: 'rgba(124,58,237,0.08)', label: 'Social'    },
  academic:  { color: 'var(--umd-red)',   bg: 'rgba(224,60,49,0.08)',  label: 'Academic'  },
}

function ActionCard({ action, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const cfg = CATEGORY_CONFIG[action.category] || CATEGORY_CONFIG.grounding

  return (
    <div className={`action-card${open ? ' expanded' : ''}`} onClick={() => setOpen(!open)}>
      <div className="action-card-header">
        <span className="action-emoji">{action.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{action.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
            <span className="badge badge-purple">⏱ {action.duration}</span>
          </div>
        </div>
        {open
          ? <ChevronUp size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          : <ChevronDown size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        }
      </div>

      {open && (
        <div className="action-steps" onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.65 }}>
            {action.description}
          </p>
          {action.instructions?.map((step, i) => (
            <div key={i} className="action-step">
              <span className="step-num">{i + 1}</span>
              <span style={{ color: 'var(--text)', lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const getMoodEmoji = (score) => {
  if (score <= 2) return '😔'
  if (score <= 4) return '😕'
  if (score <= 6) return '😐'
  if (score <= 8) return '🙂'
  return '😊'
}

export default function Wellness() {
  const [actions,     setActions]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [contextInfo, setContextInfo] = useState(null)

  useEffect(() => { fetchActions() }, [])

  const fetchActions = async () => {
    setLoading(true); setError('')
    const moods    = JSON.parse(localStorage.getItem('tm_mood')    || '[]')
    const journals = JSON.parse(localStorage.getItem('tm_journal') || '[]')
    const latestMood    = moods.length    > 0 ? moods[moods.length - 1]    : null
    const latestJournal = journals.length > 0 ? journals[journals.length - 1] : null
    const moodScore  = latestMood?.score ?? 6
    const themes     = latestJournal?.themes ?? []
    const recentNote = latestMood?.note ?? ''
    setContextInfo({ moodScore, themes, recentNote })

    try {
      const res = await fetch(`${API}/api/wellness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_score: moodScore, themes, recent_note: recentNote }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setActions(data.actions || [])
    } catch {
      setError('Could not load wellness actions. Make sure the backend is running on port 8000.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 8 }}>
        <div>
          <div className="page-eyebrow">Wellness Actions</div>
          <h1 className="page-title">Just for you, right now ✨</h1>
          <p className="page-subtitle">Personalized micro-actions based on your mood and journal.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={fetchActions} disabled={loading}>
              <RefreshCw size={13} style={{ animation: loading ? 'spin 0.75s linear infinite' : 'none' }} />
              Refresh actions
            </button>
            {contextInfo && (
              <>
                <span className="badge badge-purple">{getMoodEmoji(contextInfo.moodScore)} Mood {contextInfo.moodScore}/10</span>
                {contextInfo.themes.map(t => <span key={t} className="badge badge-teal">{t}</span>)}
              </>
            )}
          </div>
        </div>
        <div style={{ opacity: 0.85, flexShrink: 0 }}><WellnessIllustration size={100} /></div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 32 }}>
          <div className="spinner spinner-lg" />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Crafting your actions…</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Reading your mood and journal to find the perfect fit.</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ padding: 16, background: 'var(--danger-bg)', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--danger)', marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Action cards — 3-column grid on desktop */}
      {!loading && actions.length > 0 && (
        <div className="wellness-grid fade-in">
          {actions.map((action, i) => (
            <ActionCard key={i} action={action} defaultOpen={i === 0} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && actions.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, opacity: 0.6 }}>
            <WellnessIllustration size={90} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Nothing here yet</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Log a mood or write a journal entry first —<br />then TerpMind will craft actions just for you.
          </div>
        </div>
      )}

      {!loading && actions.length > 0 && (
        <p style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Tap any card to expand the steps. Small actions, consistently, beat big changes rarely. 🐢
        </p>
      )}
    </div>
  )
}
