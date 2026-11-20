import { solve } from '../core/solver'
import { NO_NOTES } from '../core/notes'
import type { GameMode, GameState } from '../interfaces/game'
import type { Difficulty, PuzzleRecord } from '../interfaces/puzzle'

export function createGame(
  puzzle: PuzzleRecord,
  difficulty: Difficulty,
  mode: GameMode,
): GameState {
  const solution = solve(puzzle.grid)
  if (!solution) throw new Error(`Puzzle ${puzzle.id} has no solution`)

  return {
    puzzleId: puzzle.id,
    rating: puzzle.rating,
    difficulty,
    mode,
    solution: [...solution].map(Number),
    cells: [...puzzle.grid].map((char) => {
      const value = Number(char) || 0
      return { value, notes: NO_NOTES, given: value !== 0 }
    }),
    selection: [],
    pencil: false,
    mistakes: 0,
    history: [],
    status: 'playing',
  }
}
