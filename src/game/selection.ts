import { colOf, indexAt, rowOf, SIZE } from '../core/grid'
import type { SelectMode } from '../interfaces/game-action'

const CENTER = indexAt(4, 4)

/** Returns the same array when nothing changes, so React can skip work. */
export function applySelect(
  selection: readonly number[],
  index: number,
  mode: SelectMode,
): readonly number[] {
  switch (mode) {
    case 'replace':
      return selection.length === 1 && selection[0] === index ? selection : [index]
    case 'toggle':
      return selection.includes(index)
        ? selection.filter((selected) => selected !== index)
        : [...selection, index]
    case 'extend':
      // Re-append so the cell becomes the cursor again (Shift+arrow back-tracking).
      return selection.at(-1) === index
        ? selection
        : [...selection.filter((selected) => selected !== index), index]
  }
}

/** Moves the cursor (last selected cell), wrapping around the edges. */
export function applyMove(
  selection: readonly number[],
  rowDelta: number,
  colDelta: number,
  extend: boolean,
): readonly number[] {
  const cursor = selection.at(-1)
  if (cursor === undefined) return [CENTER]
  const next = indexAt(wrap(rowOf(cursor) + rowDelta), wrap(colOf(cursor) + colDelta))
  return applySelect(selection, next, extend ? 'extend' : 'replace')
}

function wrap(position: number): number {
  return (position + SIZE) % SIZE
}
