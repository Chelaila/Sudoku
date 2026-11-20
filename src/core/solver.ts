/**
 * Bitmask backtracking solver with "minimum remaining values" ordering: it
 * always branches on the empty cell with the fewest candidates, which keeps
 * even the hardest bank puzzles in the low-millisecond range.
 *
 * Keep this file free of runtime imports: scripts/import-puzzles.ts runs it
 * directly in Node (native type stripping), where extensionless imports fail.
 *
 * Puzzles are 81-char strings; '1'-'9' are givens, anything else is empty.
 */
const FULL_MASK = 0b1111111110 // bits 1..9

const ROW = Uint8Array.from({ length: 81 }, (_, i) => Math.floor(i / 9))
const COL = Uint8Array.from({ length: 81 }, (_, i) => i % 9)
const BOX = Uint8Array.from(
  { length: 81 },
  (_, i) => Math.floor(i / 27) * 3 + Math.floor((i % 9) / 3),
)
const BIT_COUNT = Uint8Array.from({ length: 1024 }, (_, mask) => {
  let count = 0
  for (let m = mask; m; m &= m - 1) count++
  return count
})

/** Returns the solved grid as an 81-digit string, or null if unsolvable. */
export function solve(puzzle: string): string | null {
  let solution: string | null = null
  search(puzzle, (grid) => {
    solution = grid.join('')
    return true
  })
  return solution
}

/** Counts solutions, stopping early at `limit` (2 is enough to prove uniqueness). */
export function countSolutions(puzzle: string, limit = 2): number {
  let count = 0
  search(puzzle, () => ++count >= limit)
  return count
}

/** Calls `onSolution` per solution found; returning true stops the search. */
function search(puzzle: string, onSolution: (grid: Uint8Array) => boolean): void {
  if (puzzle.length !== 81) return

  const grid = new Uint8Array(81)
  const rows = new Uint16Array(9)
  const cols = new Uint16Array(9)
  const boxes = new Uint16Array(9)

  for (let i = 0; i < 81; i++) {
    const digit = puzzle.charCodeAt(i) - 48
    if (digit < 1 || digit > 9) continue
    const bit = 1 << digit
    if ((rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]) & bit) return // clashing givens
    grid[i] = digit
    rows[ROW[i]] |= bit
    cols[COL[i]] |= bit
    boxes[BOX[i]] |= bit
  }

  const step = (): boolean => {
    let best = -1
    let bestMask = 0
    let bestCount = 10
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== 0) continue
      const mask = FULL_MASK & ~(rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]])
      const count = BIT_COUNT[mask]
      if (count === 0) return false
      if (count < bestCount) {
        best = i
        bestMask = mask
        bestCount = count
        if (count === 1) break
      }
    }
    if (best === -1) return onSolution(grid)

    const r = ROW[best]
    const c = COL[best]
    const b = BOX[best]
    for (let digit = 1; digit <= 9; digit++) {
      const bit = 1 << digit
      if (!(bestMask & bit)) continue
      grid[best] = digit
      rows[r] |= bit
      cols[c] |= bit
      boxes[b] |= bit
      if (step()) return true
      grid[best] = 0
      rows[r] &= ~bit
      cols[c] &= ~bit
      boxes[b] &= ~bit
    }
    return false
  }

  step()
}
