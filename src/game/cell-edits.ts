import { PEERS } from '../core/grid'
import { addNote, hasNote, NO_NOTES, removeNote } from '../core/notes'
import type { CellState } from '../interfaces/game'

type Cells = readonly CellState[]

/**
 * Pure edits over the board. Every function returns the SAME array when
 * nothing changed, which is how the reducer knows whether to record undo.
 */

/** Writes a digit (or clears it if it is already there) and auto-cleans peer notes. */
export function placeValue(cells: Cells, index: number, digit: number): Cells {
  const cell = cells[index]
  if (cell.given) return cells
  if (cell.value === digit) return updateCells(cells, [index], (c) => patch(c, 0, NO_NOTES))

  const placed = updateCells(cells, [index], (c) => patch(c, digit, NO_NOTES))
  // The digit can no longer be a candidate anywhere in its row, column or box.
  return updateCells(placed, PEERS[index], (c) => patch(c, c.value, removeNote(c.notes, digit)))
}

/**
 * Smart pencil over one or many cells:
 * - only empty, editable cells are touched;
 * - a note is never added where the digit is already placed in a peer;
 * - if every eligible cell already has the note it is removed from all of
 *   them, otherwise it is added to the ones missing it.
 */
export function toggleNotes(cells: Cells, indices: readonly number[], digit: number): Cells {
  const targets = indices.filter((index) => !cells[index].given && cells[index].value === 0)
  const eligible = targets.filter((index) => !isBlocked(cells, index, digit))
  const removing = eligible.every((index) => hasNote(cells[index].notes, digit))

  return removing
    ? updateCells(cells, targets, (c) => patch(c, c.value, removeNote(c.notes, digit)))
    : updateCells(cells, eligible, (c) => patch(c, c.value, addNote(c.notes, digit)))
}

/** Clears value and notes of every editable cell in `indices`. */
export function eraseCells(cells: Cells, indices: readonly number[]): Cells {
  return updateCells(cells, indices, (c) => (c.given ? c : patch(c, 0, NO_NOTES)))
}

function isBlocked(cells: Cells, index: number, digit: number): boolean {
  return PEERS[index].some((peer) => cells[peer].value === digit)
}

function patch(cell: CellState, value: number, notes: number): CellState {
  return cell.value === value && cell.notes === notes ? cell : { ...cell, value, notes }
}

/** Copy-on-first-write update: untouched boards keep their identity. */
function updateCells(
  cells: Cells,
  indices: readonly number[],
  update: (cell: CellState) => CellState,
): Cells {
  let next: CellState[] | null = null
  for (const index of indices) {
    const updated = update(cells[index])
    if (updated === cells[index]) continue
    next ??= [...cells]
    next[index] = updated
  }
  return next ?? cells
}
