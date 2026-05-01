import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { getPattern } from '@/lib/patterns'
import type { ConverseTurnRequest, ConversationTurn } from '@/types'

const client = new Anthropic()

function buildSystemPrompt(
  request: ConverseTurnRequest,
  speaker: { name: string; personality: string }
): string {
  const { setup, history } = request
  const pattern = getPattern(setup.patternId)
  const turnNumber = history.length + 1
  const totalTurns = setup.totalTurns
  const phase = turnNumber <= totalTurns * 0.3 ? '序盤' : turnNumber <= totalTurns * 0.7 ? '中盤' : '終盤'

  const patternInstructions = pattern
    ? `
【情動経験の動力学理論 — 目標パターン】
パターン名: ${pattern.name}（${pattern.trajectoryType}）
説明: ${pattern.description}
動力学的成分: ${pattern.dynamics}
核心ルール: ${pattern.coreRule}

この会話を観察する人に「${pattern.name}」の感情体験を引き起こすことが目標です。
現在フェーズ: ${phase}（${turnNumber}/${totalTurns}ターン目）`
    : ''

  return `あなたは「${speaker.name}」というキャラクターです。

【性格・キャラクター】
${speaker.personality}

【状況】
${setup.situation}

【観察者への目標反応】
${setup.targetReaction}
${patternInstructions}

【発言ルール】
- 必ず${speaker.name}として自然に発言する（地の文・ト書き不要）
- 1〜3文程度で簡潔に
- 他のキャラクターの発言に自然に反応する
- ${phase}の流れを意識しながら会話を${pattern?.name ?? '目標の感情'}へ向けて積み上げる
- 説明や解説をしない。行動・言葉・沈黙で表現する
- セリフのみを返す（名前やト書きは書かない）`
}

export async function POST(request: NextRequest) {
  try {
    const body: ConverseTurnRequest = await request.json()
    const { setup, history, nextSpeakerIndex } = body

    if (!setup.characters || setup.characters.length < 2) {
      return Response.json({ error: 'キャラクターは2人以上必要です' }, { status: 400 })
    }

    const speaker = setup.characters[nextSpeakerIndex % setup.characters.length]
    const systemPrompt = buildSystemPrompt(body, speaker)

    const messages: Anthropic.MessageParam[] = history.map((turn) => ({
      role: 'user' as const,
      content: `${turn.characterName}: ${turn.content}`,
    }))

    if (messages.length === 0) {
      messages.push({
        role: 'user',
        content: '会話を始めてください。',
      })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: '予期しないレスポンス形式' }, { status: 500 })
    }

    const turn: ConversationTurn = {
      characterId: speaker.id,
      characterName: speaker.name,
      content: content.text.trim(),
      timestamp: Date.now(),
    }

    const isComplete = history.length + 1 >= setup.totalTurns

    return Response.json({ turn, isComplete })
  } catch (error) {
    console.error('Conversation API error:', error)
    return Response.json({ error: 'APIエラーが発生しました' }, { status: 500 })
  }
}
