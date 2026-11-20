import { IonButton } from '@ionic/react'
import { LABELS } from '../i18n/labels'
import { PlayIcon } from './icons'

interface PauseOverlayProps {
  readonly onResume: () => void
}

/** Opaque on purpose: a paused board must not be studied for free. */
export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="pause-overlay">
      <p>{LABELS.game.paused}</p>
      <IonButton size="large" onClick={onResume}>
        <PlayIcon />
        <span className="pause-overlay__label">{LABELS.game.resume}</span>
      </IonButton>
    </div>
  )
}
