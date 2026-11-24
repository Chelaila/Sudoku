import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import { DIFFICULTY_LABELS, LABELS } from '../i18n/labels'
import type { Difficulty } from '../interfaces/puzzle'
import { formatTime } from '../lib/format-time'
import { BackIcon, GearIcon, PauseIcon, PlayIcon } from './icons'

interface GameHeaderProps {
  readonly difficulty: Difficulty
  readonly rating: number
  readonly elapsedMs: number
  readonly showTimer: boolean
  readonly paused: boolean
  readonly canPause: boolean
  readonly onTogglePause: () => void
  readonly onOpenSettings: () => void
  readonly onExit: () => void
}

export function GameHeader({
  difficulty,
  rating,
  elapsedMs,
  showTimer,
  paused,
  canPause,
  onTogglePause,
  onOpenSettings,
  onExit,
}: GameHeaderProps) {
  const pauseLabel = paused ? LABELS.game.resume : LABELS.game.pause

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={onExit} aria-label={LABELS.game.menu}>
            <BackIcon />
          </IonButton>
        </IonButtons>
        <IonTitle>
          {DIFFICULTY_LABELS[difficulty].name} <span className="header__rating">SE {rating.toFixed(1)}</span>
        </IonTitle>
        <IonButtons slot="end">
          {showTimer && <span className="timer">{formatTime(elapsedMs)}</span>}
          <IonButton onClick={onTogglePause} disabled={!canPause} aria-label={pauseLabel}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </IonButton>
          <IonButton onClick={onOpenSettings} aria-label={LABELS.settings.open}>
            <GearIcon />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
