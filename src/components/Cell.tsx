import { memo } from 'react'
import { colOf, DIGITS, rowOf } from '../core/grid'
import { hasNote } from '../core/notes'
import { LABELS } from '../i18n/labels'
import type { CellView } from '../interfaces/cell-view'
import { cx } from '../lib/class-names'

/**
 * Receives the CellView spread as primitive props, so `memo`'s shallow compare
 * re-renders only the cells whose flags actually changed.
 */
export const Cell = memo(function Cell(cell: CellView) {
  const row = rowOf(cell.index)
  const col = colOf(cell.index)

  return (
    <div
      className={cx(
        'cell',
        cell.given && 'is-given',
        !cell.given && cell.value !== 0 && 'is-user',
        cell.related && 'is-related',
        cell.conflict && 'is-conflict',
        cell.sameValue && 'is-same',
        cell.selected && 'is-selected',
        cell.wrong && 'is-wrong',
      )}
      data-index={cell.index}
      data-row={row}
      data-col={col}
      aria-label={LABELS.game.cell(row + 1, col + 1)}
    >
      {cell.value !== 0 ? (
        <span className="cell__value">{cell.value}</span>
      ) : (
        cell.notes !== 0 && (
          <span className="cell__notes">
            {DIGITS.map((digit) => (
              <span
                key={digit}
                className={cx(hasNote(cell.notes, digit) && digit === cell.highlightedNote && 'is-highlighted')}
              >
                {hasNote(cell.notes, digit) ? digit : ''}
              </span>
            ))}
          </span>
        )
      )}
    </div>
  )
})
