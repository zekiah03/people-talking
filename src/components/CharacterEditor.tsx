'use client'

import type { Character } from '@/types'

interface Props {
  characters: Character[]
  onChange: (characters: Character[]) => void
}

export function CharacterEditor({ characters, onChange }: Props) {
  function addCharacter() {
    const id = crypto.randomUUID()
    onChange([...characters, { id, name: '', personality: '' }])
  }

  function removeCharacter(id: string) {
    onChange(characters.filter((c) => c.id !== id))
  }

  function updateCharacter(id: string, field: 'name' | 'personality', value: string) {
    onChange(characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const COLORS = ['#5b21b6', '#0f766e', '#b45309', '#be185d', '#1d4ed8', '#15803d']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {characters.map((char, i) => (
        <div
          key={char.id}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: COLORS[i % COLORS.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <input
              type="text"
              value={char.name}
              onChange={(e) => updateCharacter(char.id, 'name', e.target.value)}
              placeholder="名前"
              style={{
                flex: 1,
                padding: '6px 10px',
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            {characters.length > 2 && (
              <button
                onClick={() => removeCharacter(char.id)}
                style={{
                  width: 28,
                  height: 28,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-faint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
          <textarea
            value={char.personality}
            onChange={(e) => updateCharacter(char.id, 'personality', e.target.value)}
            placeholder="性格・特徴を記述（例: 関西弁で話すお調子者。緊張すると早口になる。）"
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: 'var(--text)',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </div>
      ))}

      <button
        onClick={addCharacter}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '10px',
          background: 'transparent',
          border: '1px dashed var(--border-strong)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 150ms ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = 'var(--accent)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-strong)'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        <span style={{ fontSize: 16 }}>+</span> キャラクターを追加
      </button>
    </div>
  )
}
