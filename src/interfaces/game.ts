import type { Difficulty } from './puzzle'

export type GameMode = 'relaxed' | 'assisted' | 'hardcore'

export type GameStatus = 'playing' | 'won' | 'lost'

/** What a game mode changes. Add a mode = add an entry in game-modes.ts. */
export interface GameModeRules {
  /** Paint digits that differ from the solution and count them as mistakes. */
  readonly checksAgainstSolution: boolean
  /** Mistakes allowed before losing; null = unlimited. */
  readonly maxMistakes: number | null
}

export interface CellState {
  /** 0 = empty. */
  readonly value: number
  /** Pencil marks as a bitmask (see core/notes.ts). */
  readonly notes: number
  /** Part of the original puzzle: locked and drawn differently. */
  readonly given: boolean
}

export interface GameState {
  readonly puzzleId: string
  readonly rating: number
  readonly difficulty: Difficulty
  readonly mode: GameMode
  readonly solution: readonly number[]
  readonly cells: readonly CellState[]
  /** Selected cells in selection order; the last one acts as the cursor. */
  readonly selection: readonly number[]
  readonly pencil: boolean
  readonly mistakes: number
  /** Previous `cells` snapshots for undo (not persisted). */
  readonly history: readonly (readonly CellState[])[]
  readonly status: GameStatus
}

export interface SavedGame {
  readonly version: 1
  readonly state: GameState
  readonly elapsedMs: number
}
