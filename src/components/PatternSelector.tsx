'use client'

import { PATTERNS, CATEGORY_LABELS } from '@/lib/patterns'
import type { EmotionalPattern } from '@/types'

interface Props {
  selectedId: string
  onSelect: (id: string) => void
}

const CATEGORY_ORDER = ['humor', 'emotion', 'tension', 'interaction', 'stable'] as const

export function PatternSelector({ selectedId, onSelect }: Props) {
  const selected = PATTERNS.find((p) => p.id === selectedId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          background: 'var(--bg-elev)',
          maxHeight: 280,
          overflowY: 'auto',
        }}
      >
        {CATEGORY_ORDER.map((cat) => {
          const patterns = PATTERNS.filter((p) => p.category === cat)
          return (
            <div key={cat}>
              <div
                style={{
                  padding: '8px 12px 4px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg-subtle)',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </div>
              {patterns.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    background: selectedId === p.id ? 'var(--accent-bg)' : 'transparent',
                    border: 'none',
                    color: selectedId === p.id ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: 13,
                    textAlign: 'left',
                    fontWeight: selectedId === p.id ? 500 : 400,
                    borderBottom: '1px solid var(--border)',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span>{p.name}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: selectedId === p.id ? 'var(--accent)' : 'var(--text-faint)',
                    }}
                  >
                    {p.trajectoryType}
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {selected && (
        <div
          style={{
            background: 'var(--accent-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>
              {selected.name}
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                background: 'var(--accent)',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: 100,
              }}
            >
              {selected.trajectoryType}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'monospace' }}>
              {selected.dynamics}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {selected.description}
          </p>
        </div>
      )}
    </div>
  )
}
