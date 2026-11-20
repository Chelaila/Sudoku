import type { GameMode, GameModeRules } from '../interfaces/game'

export const GAME_MODES: Readonly<Record<GameMode, GameModeRules>> = {
  relaxed: { checksAgainstSolution: false, maxMistakes: null },
  assisted: { checksAgainstSolution: true, maxMistakes: null },
  hardcore: { checksAgainstSolution: true, maxMistakes: 3 },
}

export const GAME_MODE_ORDER: readonly GameMode[] = ['relaxed', 'assisted', 'hardcore']
