export type Difficulty = 'normal' | 'hard' | 'expert' | 'extreme'

/** Files of the Sudoku Exchange puzzle bank (graded with Sukaku Explainer). */
export type BankSource = 'easy' | 'medium' | 'hard' | 'diabolical'

export interface DifficultyTier {
  readonly difficulty: Difficulty
  readonly source: BankSource
  /** Sukaku Explainer rating range, min inclusive / max exclusive. */
  readonly minRating: number
  readonly maxRating: number
}

export interface PuzzleRecord {
  readonly id: string
  /** 81 chars, row by row; '0' = empty cell. */
  readonly grid: string
  readonly rating: number
}

/**
 * Shape of src/puzzles/data/puzzle-bank.json. Each record is stored exactly as
 * the bank line: "<id> <81 digits> <rating>" (compact and diff-friendly).
 */
export interface PuzzleBankFile {
  readonly source: string
  readonly importedAt: string
  readonly tiers: Readonly<Record<Difficulty, readonly string[]>>
}
