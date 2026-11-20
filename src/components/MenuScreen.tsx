import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useState } from 'react'
import { GAME_MODE_ORDER } from '../game/game-modes'
import { loadGame } from '../game/game-storage'
import { DIFFICULTY_LABELS, LABELS, MODE_LABELS } from '../i18n/labels'
import type { GameMode, SavedGame } from '../interfaces/game'
import type { SelectOption } from '../interfaces/option-label'
import type { Difficulty } from '../interfaces/puzzle'
import { formatTime } from '../lib/format-time'
import { DIFFICULTY_TIERS } from '../puzzles/difficulty-tiers'
import { PlayIcon } from './icons'
import { OptionGroup } from './OptionGroup'
import './menu.css'

const DIFFICULTY_OPTIONS: readonly SelectOption<Difficulty>[] = DIFFICULTY_TIERS.map((tier) => ({
  value: tier.difficulty,
  ...DIFFICULTY_LABELS[tier.difficulty],
  badge: LABELS.menu.rating(tier.minRating, tier.maxRating),
}))

const MODE_OPTIONS: readonly SelectOption<GameMode>[] = GAME_MODE_ORDER.map((mode) => ({
  value: mode,
  ...MODE_LABELS[mode],
}))

interface MenuScreenProps {
  readonly onStart: (difficulty: Difficulty, mode: GameMode) => void
  readonly onResume: (saved: SavedGame) => void
}

export function MenuScreen({ onStart, onResume }: MenuScreenProps) {
  const [saved] = useState(loadGame)
  const [difficulty, setDifficulty] = useState<Difficulty>(saved?.state.difficulty ?? 'normal')
  const [mode, setMode] = useState<GameMode>(saved?.state.mode ?? 'assisted')

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{LABELS.appTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="menu">
        <p className="menu__subtitle">{LABELS.menu.subtitle}</p>

        {saved && (
          <IonList className="menu__resume" lines="none">
            <IonItem button detail onClick={() => onResume(saved)}>
              <span slot="start" className="menu__resume-icon">
                <PlayIcon />
              </span>
              <IonLabel>
                <h2>{LABELS.menu.continue}</h2>
                <p>
                  {DIFFICULTY_LABELS[saved.state.difficulty].name} · {MODE_LABELS[saved.state.mode].name} ·{' '}
                  {formatTime(saved.elapsedMs)}
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        )}

        <OptionGroup
          title={LABELS.menu.difficulty}
          options={DIFFICULTY_OPTIONS}
          value={difficulty}
          onChange={setDifficulty}
        />
        <OptionGroup title={LABELS.menu.mode} options={MODE_OPTIONS} value={mode} onChange={setMode} />
      </IonContent>

      <IonFooter>
        <IonToolbar className="menu__footer">
          <IonButton expand="block" size="large" onClick={() => onStart(difficulty, mode)}>
            {LABELS.menu.start}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}
