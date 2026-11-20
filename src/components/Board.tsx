import { memo, useEffect, useRef, type PointerEvent } from 'react'
import { LABELS } from '../i18n/labels'
import type { CellView } from '../interfaces/cell-view'
import type { SelectMode } from '../interfaces/game-action'
import { Cell } from './Cell'

interface BoardProps {
  readonly cells: readonly CellView[]
  readonly disabled: boolean
  /** "Varias" mode: each tap adds/removes a cell instead of replacing. */
  readonly multiSelect: boolean
  readonly onSelect: (index: number, mode: SelectMode) => void
}

/**
 * Tap selects (or toggles, in multi-select mode) · drag paints a selection.
 *
 * Hit-testing goes through `elementFromPoint` instead of per-cell
 * pointerenter: a touch pointer is implicitly captured by the cell where the
 * finger landed, so the other cells would never receive enter events.
 */
export const Board = memo(function Board({ cells, disabled, multiSelect, onSelect }: BoardProps) {
  const dragging = useRef(false)
  const lastIndex = useRef(-1)

  useEffect(() => {
    const stopDragging = () => {
      dragging.current = false
    }
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [])

  const handlePointerDown = (event: PointerEvent) => {
    if (disabled || !event.isPrimary) return
    const index = cellIndexAt(event.clientX, event.clientY)
    if (index === null) return
    event.preventDefault()
    dragging.current = true
    lastIndex.current = index
    onSelect(index, multiSelect ? 'toggle' : 'replace')
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (disabled || !dragging.current) return
    const index = cellIndexAt(event.clientX, event.clientY)
    if (index === null || index === lastIndex.current) return
    lastIndex.current = index
    onSelect(index, 'extend')
  }

  return (
    <div
      className="board"
      role="group"
      aria-label={LABELS.game.board}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {cells.map((cell) => (
        <Cell key={cell.index} {...cell} />
      ))}
    </div>
  )
})

function cellIndexAt(x: number, y: number): number | null {
  const element = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-index]')
  return element ? Number(element.dataset.index) : null
}
