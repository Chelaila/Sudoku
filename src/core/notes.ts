/**
 * Pencil marks are stored as a 10-bit mask per cell: bit N set = note N.
 * One number per cell keeps state tiny, cheap to copy for undo and trivial
 * to persist.
 */
export const NO_NOTES = 0

export function hasNote(notes: number, digit: number): boolean {
  return (notes & (1 << digit)) !== 0
}

export function addNote(notes: number, digit: number): number {
  return notes | (1 << digit)
}

export function removeNote(notes: number, digit: number): number {
  return notes & ~(1 << digit)
}
