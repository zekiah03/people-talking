export interface Character {
  id: string
  name: string
  personality: string
}

export interface EmotionalPattern {
  id: string
  name: string
  category: 'humor' | 'emotion' | 'tension' | 'interaction' | 'stable'
  trajectoryType: string
  description: string
  dynamics: string
  coreRule: string
}

export interface ConversationTurn {
  characterId: string
  characterName: string
  content: string
  timestamp: number
}

export interface ConversationSetup {
  characters: Character[]
  situation: string
  targetReaction: string
  patternId: string
  totalTurns: number
}

export interface ConverseTurnRequest {
  setup: ConversationSetup
  history: ConversationTurn[]
  nextSpeakerIndex: number
}

export interface ConverseTurnResponse {
  turn: ConversationTurn
  isComplete: boolean
}
