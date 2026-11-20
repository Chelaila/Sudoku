export const SIZE = 9
export const CELL_COUNT = SIZE * SIZE
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export function rowOf(index: number): number {
  return Math.floor(index / SIZE)
}

export function colOf(index: number): number {
  return index % SIZE
}

export function boxOf(index: number): number {
  return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3)
}

export function indexAt(row: number, col: number): number {
  return row * SIZE + col
}

/** True when both cells share a row, a column or a 3x3 box. */
export function areRelated(a: number, b: number): boolean {
  return rowOf(a) === rowOf(b) || colOf(a) === colOf(b) || boxOf(a) === boxOf(b)
}

/** For every cell, the 20 other cells it must not repeat a digit with. */
export const PEERS: readonly (readonly number[])[] = Array.from(
  { length: CELL_COUNT },
  (_, index) =>
    Array.from({ length: CELL_COUNT }, (_, other) => other).filter(
      (other) => other !== index && areRelated(index, other),
    ),
)
