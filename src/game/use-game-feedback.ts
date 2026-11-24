import { useEffect, useRef } from 'react'
import type { GameState } from '../interfaces/game'
import { errorFeedback, successFeedback } from '../platform/haptics'

/** Vibrates on each new mistake and once when the puzzle is solved. */
export function useGameFeedback(state: GameState, enabled: boolean): void {
  const previous = useRef(state)

  useEffect(() => {
    const before = previous.current
    previous.current = state
    if (!enabled) return
    if (state.mistakes > before.mistakes) errorFeedback()
    if (state.status === 'won' && before.status !== 'won') successFeedback()
  }, [state, enabled])
}
