import type { GameMode } from '../interfaces/game'
import type { OptionLabel } from '../interfaces/option-label'
import type { Difficulty } from '../interfaces/puzzle'

/** All user-facing copy lives here (Spanish); logic never hardcodes text. */

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, OptionLabel>> = {
  normal: { name: 'Normal', description: 'Se resuelve solo con singles. Para calentar.' },
  hard: { name: 'Difícil', description: 'Pares, intersecciones, X-Wing y XY-Wing.' },
  expert: { name: 'Experto', description: 'Rectángulos únicos, cadenas y bucles.' },
  extreme: { name: 'Extremo', description: 'Cadenas de forzado. Lo más duro del banco.' },
}

export const MODE_LABELS: Readonly<Record<GameMode, OptionLabel>> = {
  relaxed: {
    name: 'Relajado',
    description: 'Como en papel: no revisa contra la solución ni hay límite de errores.',
  },
  assisted: {
    name: 'Con ayuda',
    description: 'Marca en rojo los números incorrectos. Sin límite de errores.',
  },
  hardcore: {
    name: 'Hardcore',
    description: 'Marca los errores y al tercero pierdes.',
  },
}

export const LABELS = {
  appTitle: 'Sudoku',
  menu: {
    subtitle: 'Puzzles reales calificados con Sukaku Explainer.',
    difficulty: 'Dificultad',
    mode: 'Tipo de juego',
    start: 'Jugar',
    continue: 'Continuar partida',
    rating: (min: number, max: number) =>
      max >= 100 ? `SE ${min.toFixed(1)}+` : `SE ${min.toFixed(1)}–${(max - 0.1).toFixed(1)}`,
  },
  game: {
    menu: 'Volver al menú',
    pause: 'Pausar',
    resume: 'Continuar',
    paused: 'En pausa',
    mistakes: 'Errores',
    undo: 'Deshacer',
    erase: 'Borrar',
    pencil: 'Lápiz',
    multi: 'Varias',
    multiNote: 'Varias celdas: el número va como nota en todas',
    remaining: (count: number) => `quedan ${count}`,
    board: 'Tablero de sudoku',
    cell: (row: number, col: number) => `Fila ${row}, columna ${col}`,
  },
  result: {
    won: '¡Resuelto!',
    lost: 'Se acabó',
    lostDetail: 'Llegaste al máximo de errores.',
    summary: (time: string, mistakes: number) => `Tiempo ${time} · Errores ${mistakes}`,
    newGame: 'Otro puzzle',
    menu: 'Menú',
  },
} as const
