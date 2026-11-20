import { IonRippleEffect } from '@ionic/react'
import { memo, type ReactNode } from 'react'
import { LABELS } from '../i18n/labels'
import { cx } from '../lib/class-names'
import { EraserIcon, MultiSelectIcon, PencilIcon, UndoIcon } from './icons'

interface ToolbarProps {
  readonly pencil: boolean
  readonly multiSelect: boolean
  readonly canUndo: boolean
  readonly onUndo: () => void
  readonly onErase: () => void
  readonly onTogglePencil: () => void
  readonly onToggleMultiSelect: () => void
}

export const Toolbar = memo(function Toolbar({
  pencil,
  multiSelect,
  canUndo,
  onUndo,
  onErase,
  onTogglePencil,
  onToggleMultiSelect,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <ToolButton icon={<UndoIcon />} label={LABELS.game.undo} onClick={onUndo} disabled={!canUndo} />
      <ToolButton icon={<EraserIcon />} label={LABELS.game.erase} onClick={onErase} />
      <ToolButton
        icon={<PencilIcon />}
        label={LABELS.game.pencil}
        onClick={onTogglePencil}
        active={pencil}
        badge={pencil ? 'ON' : 'OFF'}
      />
      <ToolButton
        icon={<MultiSelectIcon />}
        label={LABELS.game.multi}
        onClick={onToggleMultiSelect}
        active={multiSelect}
        badge={multiSelect ? 'ON' : 'OFF'}
      />
    </div>
  )
})

interface ToolButtonProps {
  readonly icon: ReactNode
  readonly label: string
  readonly onClick: () => void
  readonly disabled?: boolean
  readonly active?: boolean
  readonly badge?: string
}

function ToolButton({ icon, label, onClick, disabled, active, badge }: ToolButtonProps) {
  return (
    <button
      type="button"
      className={cx('tool', 'ion-activatable', active && 'is-active')}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {badge && <span className="tool__badge">{badge}</span>}
      {icon}
      <span>{label}</span>
      <IonRippleEffect />
    </button>
  )
}
