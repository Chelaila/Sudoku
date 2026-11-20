import { IonItem, IonList, IonListHeader, IonRadio, IonRadioGroup } from '@ionic/react'
import type { SelectOption } from '../interfaces/option-label'

interface OptionGroupProps<T extends string> {
  readonly title: string
  readonly options: readonly SelectOption<T>[]
  readonly value: T
  readonly onChange: (value: T) => void
}

/** Native-looking radio list (Material ripple, big touch rows). */
export function OptionGroup<T extends string>({ title, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <IonList className="option-group" lines="full">
      <IonListHeader>{title}</IonListHeader>
      <IonRadioGroup value={value} onIonChange={(event) => onChange(event.detail.value as T)}>
        {options.map((option) => (
          <IonItem key={option.value}>
            <IonRadio value={option.value} justify="space-between" labelPlacement="start">
              <span className="option__head">
                <span className="option__name">{option.name}</span>
                {option.badge && <span className="option__badge">{option.badge}</span>}
              </span>
              <span className="option__desc">{option.description}</span>
            </IonRadio>
          </IonItem>
        ))}
      </IonRadioGroup>
    </IonList>
  )
}
