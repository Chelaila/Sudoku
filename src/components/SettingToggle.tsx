import { IonItem, IonToggle } from '@ionic/react'
import type { OptionLabel } from '../interfaces/option-label'
import './option-group.css'

interface SettingToggleProps {
  readonly label: OptionLabel
  readonly checked: boolean
  readonly onChange: (checked: boolean) => void
}

export function SettingToggle({ label, checked, onChange }: SettingToggleProps) {
  return (
    <IonItem>
      <IonToggle
        className="option-label"
        checked={checked}
        justify="space-between"
        onIonChange={(event) => onChange(event.detail.checked)}
      >
        <span className="option__name">{label.name}</span>
        <span className="option__desc">{label.description}</span>
      </IonToggle>
    </IonItem>
  )
}
