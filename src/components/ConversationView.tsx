'use client'

import { useEffect, useRef } from 'react'
import type { ConversationTurn, Character } from '@/types'

interface Props {
  turns: ConversationTurn[]
  characters: Character[]
  isRunning: boolean
  onStop: () => void
  onExport: () => void
}

const COLORS = ['#5b21b6', '#0f766e', '#b45309', '#be185d', '#1d4ed8', '#15803d']

export function ConversationView({ turns, characters, isRunning, onStop, onExport }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  function getCharacterColor(characterId: string) {
    const index = characters.findIndex((c) => c.id === characterId)
    return COLORS[index % COLORS.length]
  }

  function getInitial(name: string) {
    return name.charAt(0) || '?'
  }

  if (turns.length === 0 && !isRunning) return null

  return (
    <div
      style={{
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            会話
          </span>
          <span
            style={{
              fontSize: 11,
              background: 'var(--bg-muted)',
              color: 'var(--text-muted)',
              padding: '1px 8px',
              borderRadius: 100,
            }}
          >
            {turns.length} ターン
          </span>
          {isRunning && (
            <span
              style={{
                fontSize: 11,
                background: '#dcfce7',
                color: '#15803d',
                padding: '1px 8px',
                borderRadius: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#15803d', display: 'inline-block', animation: 'pulse 1s infinite' }} />
              生成中
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isRunning && (
            <button
              onClick={onStop}
              style={{
                padding: '6px 14px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              停止
            </button>
          )}
          {turns.length > 0 && (
            <button
              onClick={onExport}
              style={{
                padding: '6px 14px',
                background: 'var(--bg-elev)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              エクスポート
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 500, overflowY: 'auto' }}>
        {turns.map((turn, i) => {
          const color = getCharacterColor(turn.characterId)
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {getInitial(turn.characterName)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: color }}>{turn.characterName}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>#{i + 1}</span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-serif)',
                    background: 'var(--bg-subtle)',
                    padding: '10px 14px',
                    borderRadius: '0 var(--radius) var(--radius) var(--radius)',
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  {turn.content}
                </div>
              </div>
            </div>
          )
        })}

        {isRunning && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-muted)',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '12px 16px',
                borderRadius: '0 var(--radius) var(--radius) var(--radius)',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--text-faint)',
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
