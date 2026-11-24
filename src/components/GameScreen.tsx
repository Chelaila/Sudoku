import { IonAlert, IonContent, IonPage } from '@ionic/react'
import { useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { buildBoardView, countDigits } from '../game/board-view'
import { GAME_MODES } from '../game/game-modes'
import { gameReducer } from '../game/game-reducer'
import { useAutosave } from '../game/use-autosave'
import { useGameFeedback } from '../game/use-game-feedback'
import { useTimer } from '../game/use-timer'
import { LABELS, MODE_LABELS } from '../i18n/labels'
import type { GameState } from '../interfaces/game'
import type { SelectMode } from '../interfaces/game-action'
import { cx } from '../lib/class-names'
import { formatTime } from '../lib/format-time'
import { tapFeedback } from '../platform/haptics'
import { useAppBackground } from '../platform/use-app-background'
import { useSettings } from '../settings/settings-context'
import { Board } from './Board'
import { DirectionPad } from './DirectionPad'
import { GameHeader } from './GameHeader'
import { NumberPad } from './NumberPad'
import { PauseOverlay } from './PauseOverlay'
import { SettingsModal } from './SettingsModal'
import { Toolbar } from './Toolbar'
import './game.css'

interface GameScreenProps {
  readonly initialGame: GameState
  readonly initialElapsedMs: number
  readonly onNewGame: () => void
  readonly onExit: () => void
}

export function GameScreen({ initialGame, initialElapsedMs, onNewGame, onExit }: GameScreenProps) {
  const { settings } = useSettings()
  const [state, dispatch] = useReducer(gameReducer, initialGame)
  const [paused, setPaused] = useState(false)
  const [multiSelect, setMultiSelect] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const pausedBeforeSettings = useRef(false)
  const playing = state.status === 'playing'
  const isPaused = paused && playing
  const elapsedMs = useTimer(initialElapsedMs, playing && !paused)

  const pause = useCallback(() => setPaused(true), [])
  const togglePause = useCallback(() => setPaused((value) => !value), [])
  useAppBackground(pause)
  useAutosave(state, elapsedMs)
  useGameFeedback(state, settings.haptics)

  // Settings pause the clock while open and restore the previous state after.
  const openSettings = useCallback(() => {
    pausedBeforeSettings.current = paused
    setPaused(true)
    setSettingsOpen(true)
  }, [paused])
  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
    setPaused(pausedBeforeSettings.current)
  }, [])

  // The timer re-renders this screen every tick; memoized views keep the
  // board and pad from re-rendering unless the game state really changed.
  const board = useMemo(() => buildBoardView(state), [state])
  const digitCounts = useMemo(() => countDigits(state.cells), [state.cells])
  const notesForMany = state.selection.length > 1

  const select = useCallback(
    (index: number, mode: SelectMode) => dispatch({ type: 'select', index, mode }),
    [],
  )
  const inputDigit = useCallback(
    (digit: number) => {
      if (settings.haptics) tapFeedback()
      dispatch({ type: 'input', digit, asNote: false })
    },
    [settings.haptics],
  )
  // In "Varias" mode the arrows paint their path into the selection.
  const move = useCallback(
    (rowDelta: number, colDelta: number) => {
      if (settings.haptics) tapFeedback()
      dispatch({ type: 'move', rowDelta, colDelta, extend: multiSelect })
    },
    [settings.haptics, multiSelect],
  )
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const erase = useCallback(() => dispatch({ type: 'erase' }), [])
  const togglePencil = useCallback(() => dispatch({ type: 'togglePencil' }), [])
  const toggleMultiSelect = useCallback(() => setMultiSelect((value) => !value), [])

  const { checksAgainstSolution, maxMistakes } = GAME_MODES[state.mode]
  const oneHand = settings.hand !== 'both'

  const toolbar = (
    <Toolbar
      pencil={state.pencil}
      multiSelect={multiSelect}
      canUndo={playing && state.history.length > 0}
      onUndo={undo}
      onErase={erase}
      onTogglePencil={togglePencil}
      onToggleMultiSelect={toggleMultiSelect}
    />
  )
  const numberPad = (
    <NumberPad counts={digitCounts} noteMode={state.pencil || notesForMany} onDigit={inputDigit} />
  )

  return (
    <IonPage>
      <GameHeader
        difficulty={state.difficulty}
        rating={state.rating}
        elapsedMs={elapsedMs}
        showTimer={settings.showTimer}
        paused={isPaused}
        canPause={playing}
        onTogglePause={togglePause}
        onOpenSettings={openSettings}
        onExit={onExit}
      />

      <IonContent>
        <div className={cx('game', oneHand && 'is-one-hand')}>
          <div className="status-row">
            <span className="chip">{MODE_LABELS[state.mode].name}</span>
            {checksAgainstSolution && (
              <span className={cx('chip', state.mistakes > 0 && 'is-danger')}>
                {LABELS.game.mistakes} {state.mistakes}
                {maxMistakes !== null && `/${maxMistakes}`}
              </span>
            )}
          </div>

          <div className="game__board">
            <Board cells={board} disabled={isPaused || !playing} multiSelect={multiSelect} onSelect={select} />
            {isPaused && !settingsOpen && <PauseOverlay onResume={togglePause} />}
          </div>

          <div className={cx('game__controls', `is-hand-${settings.hand}`, oneHand && 'is-one-hand')}>
            <p className={cx('multi-hint', notesForMany && 'is-visible')}>{LABELS.game.multiNote}</p>
            {oneHand ? (
              <>
                <div className="one-hand__side">
                  {toolbar}
                  <DirectionPad onMove={move} />
                </div>
                {numberPad}
              </>
            ) : (
              <>
                {toolbar}
                {numberPad}
              </>
            )}
          </div>
        </div>
      </IonContent>

      <IonAlert
        isOpen={!playing}
        backdropDismiss={false}
        header={state.status === 'won' ? LABELS.result.won : LABELS.result.lost}
        subHeader={state.status === 'lost' ? LABELS.result.lostDetail : undefined}
        message={LABELS.result.summary(formatTime(elapsedMs), state.mistakes)}
        buttons={[
          { text: LABELS.result.menu, handler: onExit },
          { text: LABELS.result.newGame, handler: onNewGame },
        ]}
      />

      <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
    </IonPage>
  )
}
