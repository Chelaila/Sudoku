import { IonRippleEffect } from '@ionic/react'
import { memo } from 'react'
import { DIGITS, SIZE } from '../core/grid'
import { LABELS } from '../i18n/labels'
import { cx } from '../lib/class-names'

interface NumberPadProps {
  /** Placements per digit, index = digit (see countDigits). */
  readonly counts: readonly number[]
  /** Digits will go in as pencil marks: the pad switches to small digits. */
  readonly noteMode: boolean
  readonly onDigit: (digit: number) => void
}

export const NumberPad = memo(function NumberPad({ counts, noteMode, onDigit }: NumberPadProps) {
  return (
    <div className={cx('numpad', noteMode && 'is-note-mode')}>
      {DIGITS.map((digit) => {
        const remaining = Math.max(0, SIZE - counts[digit])
        return (
          <button
            key={digit}
            type="button"
            className={cx('numpad__key', 'ion-activatable', remaining === 0 && 'is-done')}
            onClick={() => onDigit(digit)}
            aria-label={`${digit}, ${LABELS.game.remaining(remaining)}`}
          >
            <span className="numpad__digit">{digit}</span>
            <span className="numpad__left">{remaining}</span>
            <IonRippleEffect />
          </button>
        )
      })}
    </div>
  )
})
