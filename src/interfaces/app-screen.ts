import type { GameState } from './game'

export type AppScreen =
  | { readonly kind: 'menu' }
  | {
      readonly kind: 'game'
      readonly game: GameState
      readonly elapsedMs: number
      /** Changes on every new/resumed game so the game screen remounts clean. */
      readonly sessionId: number
    }
