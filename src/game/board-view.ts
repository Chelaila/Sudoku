import { areRelated, PEERS } from '../core/grid'
import type { CellView } from '../interfaces/cell-view'
import type { CellState, GameState } from '../interfaces/game'
import { GAME_MODES } from './game-modes'

/**
 * Derives the highlight flags for every cell:
 * - one cell selected → its row, column and box light up, plus every cell
 *   (and pencil mark) holding the same digit;
 * - several selected (smart pencil) → only the selection is painted.
 */
export function buildBoardView(state: GameState): CellView[] {
  const { cells, selection, solution } = state
  const checksSolution = GAME_MODES[state.mode].checksAgainstSolution
  const selected = new Set(selection)
  const focus = selection.length === 1 ? selection[0] : -1
  const focusValue = focus === -1 ? 0 : cells[focus].value

  return cells.map((cell, index) => ({
    ...cell,
    index,
    selected: selected.has(index),
    related: focus !== -1 && index !== focus && areRelated(focus, index),
    sameValue: focusValue !== 0 && index !== focus && cell.value === focusValue,
    conflict: cell.value !== 0 && PEERS[index].some((peer) => cells[peer].value === cell.value),
    wrong: checksSolution && !cell.given && cell.value !== 0 && cell.value !== solution[index],
    highlightedNote: focusValue,
  }))
}

/** How many times each digit is on the board; index = digit (0 = empties). */
export function countDigits(cells: readonly CellState[]): number[] {
  const counts = Array.from({ length: 10 }, () => 0)
  for (const { value } of cells) counts[value]++
  return counts
}
