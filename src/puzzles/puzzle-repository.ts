import type { Difficulty, PuzzleBankFile, PuzzleRecord } from '../interfaces/puzzle'
import bankJson from './data/puzzle-bank.json'

const bank: PuzzleBankFile = bankJson

/** Random puzzle from the bundled bank (regenerate it with `npm run puzzles:import`). */
export function pickRandomPuzzle(difficulty: Difficulty): PuzzleRecord {
  const lines = bank.tiers[difficulty]
  return parseRecord(lines[Math.floor(Math.random() * lines.length)])
}

function parseRecord(line: string): PuzzleRecord {
  const [id, grid, rating] = line.split(' ')
  return { id, grid, rating: Number(rating) }
}
