import { IonRippleEffect } from '@ionic/react'
import { memo } from 'react'
import { LABELS } from '../i18n/labels'
import { ArrowIcon } from './icons'

const DIRECTIONS = [
  { key: 'up', rowDelta: -1, colDelta: 0 },
  { key: 'left', rowDelta: 0, colDelta: -1 },
  { key: 'right', rowDelta: 0, colDelta: 1 },
  { key: 'down', rowDelta: 1, colDelta: 0 },
] as const

interface DirectionPadProps {
  readonly onMove: (rowDelta: number, colDelta: number) => void
}

/**
 * Arrow cross for one-handed play: moves the selection so the far corners of
 * the board never need a thumb stretch. Edges wrap around.
 */
export const DirectionPad = memo(function DirectionPad({ onMove }: DirectionPadProps) {
  return (
    <div className="dpad">
      {DIRECTIONS.map(({ key, rowDelta, colDelta }) => (
        <button
          key={key}
          type="button"
          className={`dpad__key dpad__key--${key} ion-activatable`}
          onClick={() => onMove(rowDelta, colDelta)}
          aria-label={LABELS.game[key]}
        >
          <ArrowIcon />
          <IonRippleEffect />
        </button>
      ))}
    </div>
  )
})
