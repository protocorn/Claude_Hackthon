import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MoodIllustration } from '../components/Illustrations'

const API = 'http://localhost:8000'

const MOOD_MAP = [
  { min: 1,  max: 2,  emoji: '😔', label: 'Very Low', color: '#EF4444' },
  { min: 3,  max: 4,  emoji: '😕', label: 'Low',      color: '#F97316' },
  { min: 5,  max: 6,  emoji: '😐', label: 'Okay',     color: '#F59E0B' },
  { min: 7,  max: 8,  emoji: '🙂', label: 'Good',     color: '#34D399' },
  { min: 9,  max: 10, emoji: '😊', label: 'Great',    color: '#10B981' },
]

function getMoodInfo(score) {
  return MOOD_MAP.find(m => score >= m.min && score <= m.max) || MOOD_MAP[2]
}

const TREND_ICONS = {
  improving: { icon: TrendingUp,   color: 'var(--success)',    bg: 'rgba(16,185,129,0.1)', label: '↗ Improving' },
  declining:  { icon: TrendingDown, color: 'var(--danger)',     bg: 'rgba(239,68,68,0.1)',  label: '↘ Declining' },
  stable:     { icon: Minus,        color: 'var(--secondary)',  bg: 'rgba(13,148,136,0.1)', label: '→ Stable'    },
  mixed:      { icon: Minus,        color: 'var(--warning)',    bg: 'rgba(245,158,11,0.1)', label: '~ Mixed'     },
  no_data:    { icon: Minus,        color: 'var(--text-muted)', bg: 'var(--border)',        label: 'No data yet' },
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const info = getMoodInfo(d.score)
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontWeight: 700 }}>{info.emoji} {d.score}/10 — {info.label}</div>
      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{d.dateLabel}</div>
      {d.note && <div style={{ color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>"{d.note}"</div>}
    </div>
  )
}

export default function Mood() {
  const [score,     setScore]     = useState(6)
  const [note,      setNote]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis,  setAnalysis]  = useState(null)
  const [history,   setHistory]   = useState([])
  const [saved,     setSaved]     = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tm_mood') || '[]')
    setHistory(stored)
    if (stored.length >= 2) analyzeHistory(stored)
  }, [])

  const info = getMoodInfo(score)

  const analyzeHistory = async (hist) => {
    setAnalyzing(true)
    try {
      const res = await fetch(`${API}/api/mood/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: hist }),
      })
      if (!res.ok) throw new Error()
      setAnalysis(await res.json())
    } catch { /* silently fail */ }
    finally { setAnalyzing(false) }
  }

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true); setSaved(false)
    const record = { date: new Date().toISOString(), score, note: note.trim() }
    const stored = JSON.parse(localStorage.getItem('tm_mood') || '[]')
    const updated = [...stored, record]
    localStorage.setItem('tm_mood', JSON.stringify(updated))
    setHistory(updated); setNote(''); setSaved(true); setLoading(false)
    await analyzeHistory(updated)
    setTimeout(() => setSaved(false), 3000)
  }

  const chartData = history.slice(-14).map(h => ({
    score: h.score, note: h.note,
    dateLabel: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const trendCfg = analysis ? TREND_ICONS[analysis.trend] ?? TREND_ICONS.stable : null
  const TrendIcon = trendCfg?.icon

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Mood Tracker</div>
          <h1 className="page-title">How are you feeling?</h1>
          <p className="page-subtitle">A quick check-in builds your emotional map over time.</p>
        </div>
        <div style={{ opacity: 0.85 }}><MoodIllustration size={100} /></div>
      </div>

      {/* Two-column on desktop */}
      <div className="page-two-col">

        {/* LEFT: slider + log */}
        <div>
          <div className="card card-elevated">
            <div className="mood-display">
              <span className="mood-emoji">{info.emoji}</span>
              <div className="mood-score-text" style={{ color: info.color }}>{score}/10</div>
              <div className="mood-label-text">{info.label}</div>
            </div>

            <input
              type="range" min={1} max={10} step={1}
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="mood-slider"
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 18 }}>
              <span>😔 Very Low</span>
              <span>😊 Great</span>
            </div>

            <textarea
              value={note}
              onChange={e => setNote(e.target.value.slice(0, 200))}
              placeholder="Optional: what's influencing this? (e.g. 'exam stress', 'great lunch with friends')"
              rows={3}
              style={{ marginBottom: 14 }}
            />

            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" /> : '✓'}
              {loading ? 'Saving…' : 'Log Mood'}
            </button>

            {saved && (
              <p style={{ textAlign: 'center', color: 'var(--success)', fontSize: 13, marginTop: 10, fontWeight: 600 }}>
                ✓ Mood logged! Keep the streak going 🔥
              </p>
            )}
          </div>

          {/* AI analysis panel */}
          {analyzing && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="spinner" />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Analyzing your patterns…</span>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="card fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🐢</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>Mood Insights</span>
                {trendCfg && TrendIcon && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: trendCfg.bg, color: trendCfg.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginLeft: 'auto' }}>
                    <TrendIcon size={12} />{trendCfg.label}
                  </div>
                )}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text)', marginBottom: 10 }}>{analysis.insight}</p>
              {analysis.pattern && (
                <div style={{ background: 'rgba(124,58,237,0.06)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-secondary)', borderLeft: '3px solid var(--primary)' }}>
                  💡 {analysis.pattern}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: chart + history summary */}
        <div>
          {chartData.length >= 2 ? (
            <div className="card">
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                Your Mood — Last {chartData.length} Check-ins
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={5} stroke="var(--border)" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: 'var(--primary)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent entries list */}
              <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent</div>
                {history.slice(-5).reverse().map((h, i) => {
                  const mi = getMoodInfo(h.score)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: 20 }}>{mi.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{mi.label} · {h.score}/10</div>
                        {h.note && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{h.note}</div>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, opacity: 0.6 }}>
                <MoodIllustration size={80} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No mood data yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Log your first check-in. After 2–3 entries,<br />you'll see your emotional patterns come to life.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
