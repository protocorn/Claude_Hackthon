import { useState, useEffect } from 'react'
import { Send, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { JournalIllustration } from '../components/Illustrations'

const API = 'http://localhost:8000'
const MAX_CHARS = 1000

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const THEME_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#CCFBF1', text: '#0F766E' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#D1FAE5', text: '#065F46' },
]

function ThemeBadge({ label, idx }) {
  const c = THEME_COLORS[idx % THEME_COLORS.length]
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: c.bg, color: c.text,
      marginRight: 6, marginBottom: 6,
    }}>
      {label}
    </span>
  )
}

function EntryCard({ item, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      background: 'white', borderRadius: 16, marginBottom: 12,
      overflow: 'hidden', border: '1.5px solid var(--border)',
      transition: 'box-shadow 0.2s',
      boxShadow: open ? 'var(--card-shadow-lg)' : 'var(--card-shadow)',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', padding: '16px 18px',
          cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 14,
          alignItems: 'flex-start', fontFamily: 'inherit',
        }}
      >
        {/* Date badge */}
        <div style={{
          flexShrink: 0, width: 48, height: 48, borderRadius: 12,
          background: 'var(--primary-bg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
            {new Date(item.date).getDate()}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', opacity: 0.7, textTransform: 'uppercase' }}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
            {formatDate(item.date)} · {formatTime(item.date)}
          </div>
          <p style={{
            fontSize: 14, lineHeight: 1.5, color: 'var(--text)', fontWeight: 500,
            overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: open ? 'unset' : 2, WebkitBoxOrient: 'vertical',
          }}>
            {item.entry}
          </p>
          {item.themes?.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
              {item.themes.map((t, i) => <ThemeBadge key={t} label={t} idx={i} />)}
            </div>
          )}
        </div>

        <div style={{ flexShrink: 0, color: 'var(--text-muted)', marginTop: 2 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="fade-in" style={{ padding: '0 18px 18px' }}>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text)', marginBottom: 16, fontStyle: 'italic' }}>
            "{item.entry}"
          </p>

          {item.reflection && (
            <div style={{
              background: 'linear-gradient(135deg, #F5F3FF 0%, #F0FDF4 100%)',
              borderRadius: 12, padding: '16px 18px', marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🐢</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  TerpMind's Reflection
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginBottom: item.insight ? 12 : 0 }}>
                {item.reflection}
              </p>
              {item.insight && (
                <div style={{
                  borderTop: '1px solid rgba(124,58,237,0.12)', paddingTop: 10,
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: '#6B7280', fontStyle: 'italic' }}>
                    {item.insight}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit', padding: '4px 0',
            }}
          >
            <Trash2 size={13} /> Delete entry
          </button>
        </div>
      )}
    </div>
  )
}

export default function Journal({ onCrisis }) {
  const [entry,    setEntry]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [response, setResponse] = useState(null)
  const [error,    setError]    = useState('')
  const [history,  setHistory]  = useState([])

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('tm_journal') || '[]').reverse())
  }, [])

  const pastThemes = history.slice(0, 5).flatMap(h => h.themes || [])
    .filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 8)

  const handleSubmit = async () => {
    if (!entry.trim() || loading) return
    setLoading(true); setError(''); setResponse(null)

    try {
      const res = await fetch(`${API}/api/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entry.trim(), past_themes: pastThemes }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResponse(data)
      if (data.crisis) onCrisis()

      const record = { id: Date.now(), date: new Date().toISOString(), entry: entry.trim(), reflection: data.reflection, themes: data.themes || [], insight: data.insight }
      const stored = JSON.parse(localStorage.getItem('tm_journal') || '[]')
      localStorage.setItem('tm_journal', JSON.stringify([...stored, record]))
      setHistory([record, ...history])
      setEntry('')
    } catch {
      setError('Could not reach TerpMind server. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    localStorage.setItem('tm_journal', JSON.stringify([...updated].reverse()))
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }

  return (
    <div className="page">
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Daily Journal</div>
          <h1 className="page-title">What's on your mind?</h1>
          <p className="page-subtitle">Write freely — no judgment, no grades, just you.</p>
        </div>
        <div style={{ opacity: 0.85 }}><JournalIllustration size={100} /></div>
      </div>

      {/* Two-column on desktop */}
      <div className="page-two-col-wide">

        {/* LEFT: entry form + AI response */}
        <div>
          <div className="card">
            <textarea
              value={entry}
              onChange={e => setEntry(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Start writing… How was your day? What's weighing on you? What made you smile? There's no wrong answer."
              rows={8}
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: entry.length > 900 ? 'var(--warning)' : 'var(--text-muted)' }}>
                {entry.length}/{MAX_CHARS} · ⌘↵ to send
              </span>
              <button
                className="btn btn-primary"
                style={{ width: 'auto', paddingLeft: 22, paddingRight: 22 }}
                onClick={handleSubmit}
                disabled={loading || entry.trim().length < 10}
              >
                {loading ? <span className="spinner" /> : <Send size={15} />}
                {loading ? 'Reflecting…' : 'Share with TerpMind'}
              </button>
            </div>
            {error && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--danger-bg)', borderRadius: 8, fontSize: 13, color: 'var(--danger)' }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Fresh AI Response */}
          {response && (
            <div className="card card-elevated fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>🐢</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>TerpMind's Reflection</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>just now</div>
                </div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--text)', marginBottom: 14 }}>{response.reflection}</p>
              {response.themes?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Themes I noticed</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {response.themes.map((t, i) => <ThemeBadge key={t} label={t} idx={i} />)}
                  </div>
                </div>
              )}
              {response.insight && (
                <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(13,148,136,0.06) 100%)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{response.insight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: history */}
        <div>
          {history.length > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Past Entries</h2>
                <span style={{ fontSize: 12, fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 20 }}>
                  {history.length}
                </span>
              </div>
              {history.map(item => <EntryCard key={item.id} item={item} onDelete={handleDelete} />)}
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, opacity: 0.55 }}>
                <JournalIllustration size={70} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Your journal is empty</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Write your first entry. After a few,<br />TerpMind will spot your emotional patterns.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
