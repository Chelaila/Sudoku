import { useEffect } from 'react'
import type { GameState } from '../interfaces/game'
import { clearSavedGame, saveGame } from './game-storage'

/**
 * Persists the running game on every move and once per second of play
 * (not on every timer tick). A finished game is removed so "Continuar"
 * never offers it.
 */
export function useAutosave(state: GameState, elapsedMs: number): void {
  const elapsedSeconds = Math.floor(elapsedMs / 1000)

  useEffect(() => {
    if (state.status === 'playing') saveGame(state, elapsedSeconds * 1000)
    else clearSavedGame()
  }, [state, elapsedSeconds])
}
