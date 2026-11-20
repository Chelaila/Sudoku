import { CELL_COUNT } from '../core/grid'
import type { GameState, SavedGame } from '../interfaces/game'

const STORAGE_KEY = 'sudoku.savedGame'

/** Best effort: storage can be full or blocked (private mode); the game goes on. */
export function saveGame(state: GameState, elapsedMs: number): void {
  const saved: SavedGame = {
    version: 1,
    state: { ...state, history: [], selection: [] },
    elapsedMs,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Resume is a convenience, not a requirement.
  }
}

export function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as SavedGame
    const valid =
      saved.version === 1 &&
      saved.state?.cells?.length === CELL_COUNT &&
      saved.state.status === 'playing'
    return valid ? saved : null
  } catch {
    return null
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clean if storage is unavailable.
  }
}
