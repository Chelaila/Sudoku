import type { DifficultyTier } from '../interfaces/puzzle'

/**
 * Maps app difficulties to slices of the puzzle bank by Sukaku Explainer
 * rating. Shared by the app and scripts/import-puzzles.ts, so keep it free of
 * runtime imports (type-only imports are fine: Node strips them).
 *
 * Rough technique guide for the SE scale:
 *   < 2.5  singles only · 2.5–5 pairs, pointing, X-Wing, XY-Wing
 *   5–7    uniqueness, chains / nice loops · 7+ forcing chains
 */
export const DIFFICULTY_TIERS: readonly DifficultyTier[] = [
  { difficulty: 'normal', source: 'medium', minRating: 1.5, maxRating: 2.5 },
  { difficulty: 'hard', source: 'hard', minRating: 2.5, maxRating: 5 },
  { difficulty: 'expert', source: 'diabolical', minRating: 5, maxRating: 7 },
  { difficulty: 'extreme', source: 'diabolical', minRating: 7, maxRating: 100 },
]
