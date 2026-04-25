import { useEffect } from 'react'
import { X } from 'lucide-react'

const RESOURCES = [
  {
    emoji: '🏥',
    name: 'UMD Counseling Center',
    desc: 'Free, confidential counseling',
    contact: '(301) 314-7651',
    href: 'tel:3013147651',
  },
  {
    emoji: '🚨',
    name: 'UMD Campus Police',
    desc: 'Emergency & non-emergency',
    contact: '(301) 405-3333',
    href: 'tel:3014053333',
  },
  {
    emoji: '💬',
    name: 'Crisis Text Line',
    desc: 'Text HOME to 741741',
    contact: 'Text HOME to 741741',
    href: 'sms:741741&body=HOME',
  },
  {
    emoji: '📞',
    name: '988 Suicide & Crisis Lifeline',
    desc: 'Call or text anytime, 24/7',
    contact: 'Call or text 988',
    href: 'tel:988',
  },
]

export default function CrisisModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="crisis-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crisis-sheet">
        <div className="crisis-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>💙</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>You're not alone</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
              These UMD-specific resources are here for you, right now.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--border)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        {RESOURCES.map((r) => (
          <a key={r.name} href={r.href} className="crisis-resource">
            <span className="crisis-resource-icon">{r.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--umd-red)', marginTop: 2 }}>
                {r.contact}
              </div>
            </div>
          </a>
        ))}

        <p style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 16,
          lineHeight: 1.6,
        }}>
          Reaching out takes courage. These people <em>want</em> to hear from you. 🐢❤️
        </p>
      </div>
    </div>
  )
}
