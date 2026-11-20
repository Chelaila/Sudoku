import { App as NativeApp } from '@capacitor/app'
import { IonApp } from '@ionic/react'
import { useCallback, useState } from 'react'
import { GameScreen } from './components/GameScreen'
import { MenuScreen } from './components/MenuScreen'
import { createGame } from './game/create-game'
import type { AppScreen } from './interfaces/app-screen'
import type { GameMode, SavedGame } from './interfaces/game'
import type { Difficulty } from './interfaces/puzzle'
import { useBackButton } from './platform/use-back-button'
import { pickRandomPuzzle } from './puzzles/puzzle-repository'

let nextSessionId = 1

export default function App() {
  const [screen, setScreen] = useState<AppScreen>({ kind: 'menu' })

  const startGame = useCallback((difficulty: Difficulty, mode: GameMode) => {
    const game = createGame(pickRandomPuzzle(difficulty), difficulty, mode)
    setScreen({ kind: 'game', game, elapsedMs: 0, sessionId: nextSessionId++ })
  }, [])

  const resumeGame = useCallback((saved: SavedGame) => {
    setScreen({ kind: 'game', game: saved.state, elapsedMs: saved.elapsedMs, sessionId: nextSessionId++ })
  }, [])

  const showMenu = useCallback(() => setScreen({ kind: 'menu' }), [])

  // Android back: game → menu (the game is autosaved) · menu → close the app.
  const handleBack = useCallback(() => {
    if (screen.kind === 'game') showMenu()
    else void NativeApp.exitApp()
  }, [screen.kind, showMenu])
  useBackButton(handleBack)

  return (
    <IonApp>
      {screen.kind === 'menu' ? (
        <MenuScreen onStart={startGame} onResume={resumeGame} />
      ) : (
        <GameScreen
          key={screen.sessionId}
          initialGame={screen.game}
          initialElapsedMs={screen.elapsedMs}
          onNewGame={() => startGame(screen.game.difficulty, screen.game.mode)}
          onExit={showMenu}
        />
      )}
    </IonApp>
  )
}
