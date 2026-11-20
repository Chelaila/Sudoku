import type { CellState } from './game'

/** A cell plus everything the board needs to paint it. */
export interface CellView extends CellState {
  readonly index: number
  readonly selected: boolean
  /** Same row, column or box as the single selected cell. */
  readonly related: boolean
  /** Holds the same digit as the selected cell. */
  readonly sameValue: boolean
  /** Repeats a digit already present in its row, column or box. */
  readonly conflict: boolean
  /** Differs from the solution (only in modes that check it). */
  readonly wrong: boolean
  /** Pencil mark to emphasize (the selected cell's digit); 0 = none. */
  readonly highlightedNote: number
}
