'use client'

import { useState, useRef, useCallback } from 'react'
import { CharacterEditor } from '@/components/CharacterEditor'
import { PatternSelector } from '@/components/PatternSelector'
import { ConversationView } from '@/components/ConversationView'
import { getPattern } from '@/lib/patterns'
import type { Character, ConversationSetup, ConversationTurn } from '@/types'

const DEFAULT_CHARACTERS: Character[] = [
  { id: crypto.randomUUID(), name: '', personality: '' },
  { id: crypto.randomUUID(), name: '', personality: '' },
]

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS)
  const [situation, setSituation] = useState('')
  const [targetReaction, setTargetReaction] = useState('')
  const [patternId, setPatternId] = useState('laughter')
  const [totalTurns, setTotalTurns] = useState(10)

  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const stopRef = useRef(false)

  const canStart =
    characters.length >= 2 &&
    characters.every((c) => c.name.trim() && c.personality.trim()) &&
    situation.trim() &&
    targetReaction.trim()

  const startConversation = useCallback(async () => {
    setError('')
    setTurns([])
    setIsRunning(true)
    stopRef.current = false

    const setup: ConversationSetup = {
      characters,
      situation,
      targetReaction,
      patternId,
      totalTurns,
    }

    const history: ConversationTurn[] = []

    for (let i = 0; i < totalTurns; i++) {
      if (stopRef.current) break

      try {
        const res = await fetch('/api/converse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setup,
            history,
            nextSpeakerIndex: i % characters.length,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error ?? 'エラーが発生しました')
          break
        }

        const data = await res.json()
        const turn: ConversationTurn = data.turn
        history.push(turn)
        setTurns((prev) => [...prev, turn])

        if (data.isComplete || stopRef.current) break

        await new Promise((r) => setTimeout(r, 600))
      } catch (e) {
        setError('ネットワークエラーが発生しました')
        break
      }
    }

    setIsRunning(false)
  }, [characters, situation, targetReaction, patternId, totalTurns])

  function stopConversation() {
    stopRef.current = true
  }

  function exportConversation() {
    const pattern = getPattern(patternId)
    const lines = [
      `# AI キャラクター会話`,
      ``,
      `## 設定`,
      `- 状況: ${situation}`,
      `- 目標反応: ${targetReaction}`,
      `- 感情パターン: ${pattern?.name ?? patternId}（${pattern?.trajectoryType}）`,
      ``,
      `## キャラクター`,
      ...characters.map((c) => `- **${c.name}**: ${c.personality}`),
      ``,
      `## 会話`,
      ``,
      ...turns.map((t) => `**${t.characterName}**: ${t.content}`),
    ].join('\n')

    const blob = new Blob([lines], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation_${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const pattern = getPattern(patternId)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header
        style={{
          height: 60,
          background: 'var(--bg-elev)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>
            People Talking
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
            AI CHARACTER CONVERSATION
          </span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            background: 'var(--accent-bg)',
            color: 'var(--accent)',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          Resonance Theory
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left column: Setup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Characters */}
            <div
              style={{
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                キャラクター設定
              </h3>
              <CharacterEditor characters={characters} onChange={setCharacters} />
            </div>

            {/* Situation */}
            <div
              style={{
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                状況・ゴール
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
                    シチュエーション
                  </label>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="例: 深夜のコンビニ前。二人は終電を逃したことに気づいた。"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid transparent',
                      borderRadius: 'var(--radius)',
                      fontSize: 13,
                      color: 'var(--text)',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
                    観察者に引き出したい反応
                  </label>
                  <textarea
                    value={targetReaction}
                    onChange={(e) => setTargetReaction(e.target.value)}
                    placeholder="例: この二人の関係の温かさに気づき、思わず笑ってしまう。"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid transparent',
                      borderRadius: 'var(--radius)',
                      fontSize: 13,
                      color: 'var(--text)',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pattern & turns */}
            <div
              style={{
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
              }}
            >
              <h3
                style={{
                  margin: '0 0 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                感情パターン選択
              </h3>
              <PatternSelector selectedId={patternId} onSelect={setPatternId} />

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  ターン数
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[6, 10, 16, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setTotalTurns(n)}
                      style={{
                        padding: '5px 12px',
                        background: totalTurns === n ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: totalTurns === n ? 'var(--primary-fg)' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-sm)',
                    color: '#b91c1c',
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={startConversation}
                  disabled={!canStart || isRunning}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 22px',
                    background: canStart && !isRunning ? 'var(--primary)' : 'var(--bg-muted)',
                    color: canStart && !isRunning ? 'var(--primary-fg)' : 'var(--text-faint)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: canStart && !isRunning ? 'pointer' : 'not-allowed',
                    transition: 'all 150ms ease',
                  }}
                >
                  {isRunning ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid currentColor', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      生成中...
                    </>
                  ) : (
                    <>
                      ▶ 会話を開始
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Conversation */}
          <div>
            {turns.length === 0 && !isRunning ? (
              <div
                style={{
                  background: 'var(--bg-elev)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '64px 32px',
                  textAlign: 'center',
                  color: 'var(--text-faint)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                <p style={{ margin: 0, fontSize: 14 }}>
                  キャラクターと状況を設定して
                  <br />「会話を開始」を押してください
                </p>
                {pattern && (
                  <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--accent)' }}>
                    目標パターン: {pattern.name}（{pattern.trajectoryType}）
                  </p>
                )}
              </div>
            ) : (
              <ConversationView
                turns={turns}
                characters={characters}
                isRunning={isRunning}
                onStop={stopConversation}
                onExport={exportConversation}
              />
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
