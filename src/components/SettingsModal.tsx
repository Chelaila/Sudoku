import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { HAND_LABELS, LABELS, TEXT_SIZE_LABELS, THEME_LABELS, TOGGLE_LABELS } from '../i18n/labels'
import type { SelectOption } from '../interfaces/option-label'
import type { HandMode, TextSize, ThemeChoice, ToggleSetting } from '../interfaces/settings'
import {
  DEFAULT_SETTINGS,
  EASY_VIEW_PRESET,
  HAND_ORDER,
  TEXT_SIZE_ORDER,
  THEME_ORDER,
} from '../settings/default-settings'
import { useSettings } from '../settings/settings-context'
import { EyeIcon } from './icons'
import { OptionGroup } from './OptionGroup'
import { SettingToggle } from './SettingToggle'

const THEME_OPTIONS: readonly SelectOption<ThemeChoice>[] = THEME_ORDER.map((value) => ({
  value,
  ...THEME_LABELS[value],
}))
const TEXT_SIZE_OPTIONS: readonly SelectOption<TextSize>[] = TEXT_SIZE_ORDER.map((value) => ({
  value,
  ...TEXT_SIZE_LABELS[value],
}))
const HAND_OPTIONS: readonly SelectOption<HandMode>[] = HAND_ORDER.map((value) => ({
  value,
  ...HAND_LABELS[value],
}))
const TOGGLES: readonly ToggleSetting[] = ['thickLines', 'shapeErrors', 'showTimer', 'haptics']

interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/** Changes apply instantly (live preview behind the modal) and are persisted. */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings()

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{LABELS.settings.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={onClose}>
              {LABELS.settings.done}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList className="highlight-card" lines="none">
          <IonItem button detail={false} onClick={() => updateSettings(EASY_VIEW_PRESET)}>
            <span slot="start" className="highlight-card__icon">
              <EyeIcon />
            </span>
            <IonLabel className="ion-text-wrap">
              <h2>{LABELS.settings.easyView}</h2>
              <p>{LABELS.settings.easyViewDetail}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <OptionGroup
          title={LABELS.settings.theme}
          options={THEME_OPTIONS}
          value={settings.theme}
          onChange={(theme) => updateSettings({ theme })}
        />
        <OptionGroup
          title={LABELS.settings.textSize}
          options={TEXT_SIZE_OPTIONS}
          value={settings.textSize}
          onChange={(textSize) => updateSettings({ textSize })}
        />
        <OptionGroup
          title={LABELS.settings.hand}
          options={HAND_OPTIONS}
          value={settings.hand}
          onChange={(hand) => updateSettings({ hand })}
        />

        <IonList className="option-group" lines="full">
          <IonListHeader>{LABELS.settings.more}</IonListHeader>
          {TOGGLES.map((key) => (
            <SettingToggle
              key={key}
              label={TOGGLE_LABELS[key]}
              checked={settings[key]}
              onChange={(checked) => updateSettings({ [key]: checked })}
            />
          ))}
        </IonList>

        <IonButton
          className="settings__reset"
          fill="clear"
          expand="block"
          onClick={() => updateSettings(DEFAULT_SETTINGS)}
        >
          {LABELS.settings.reset}
        </IonButton>
      </IonContent>
    </IonModal>
  )
}
