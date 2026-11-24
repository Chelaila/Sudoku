import type { GameMode } from '../interfaces/game'
import type { OptionLabel } from '../interfaces/option-label'
import type { Difficulty } from '../interfaces/puzzle'
import type { HandMode, TextSize, ThemeChoice, ToggleSetting } from '../interfaces/settings'

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

export const THEME_LABELS: Readonly<Record<ThemeChoice, OptionLabel>> = {
  system: { name: 'Automático', description: 'Claro u oscuro según el celular.' },
  light: { name: 'Claro', description: 'Fondo blanco, números oscuros.' },
  dark: { name: 'Oscuro', description: 'Fondo negro azulado. Cansa menos de noche.' },
  paper: { name: 'Papel', description: 'Tono crema, como el sudoku del diario. Menos brillo.' },
  'contrast-light': {
    name: 'Contraste claro',
    description: 'Blanco y negro puro, líneas marcadas. Para ver con poca visión.',
  },
  'contrast-dark': {
    name: 'Contraste oscuro',
    description: 'Negro puro con números blancos y amarillos. Ideal si el brillo molesta.',
  },
}

export const TEXT_SIZE_LABELS: Readonly<Record<TextSize, OptionLabel>> = {
  normal: { name: 'Normal', description: 'Tamaño estándar.' },
  large: { name: 'Grande', description: 'Números y botones un poco más grandes.' },
  xlarge: { name: 'Muy grande', description: 'Lo más grande posible. El teclado pasa a dos filas.' },
}

export const HAND_LABELS: Readonly<Record<HandMode, OptionLabel>> = {
  both: { name: 'Dos manos', description: 'Teclado de 1 a 9 en una fila.' },
  right: {
    name: 'Mano derecha',
    description: 'Teclado 3×3 a la derecha, más flechas para moverte sin estirar el pulgar.',
  },
  left: {
    name: 'Mano izquierda',
    description: 'Lo mismo, pero todo hacia la izquierda.',
  },
}

export const TOGGLE_LABELS: Readonly<Record<ToggleSetting, OptionLabel>> = {
  thickLines: { name: 'Líneas gruesas', description: 'Separa mejor las cajas y las celdas.' },
  shapeErrors: {
    name: 'Errores con forma',
    description: 'Subraya los errores y raya los repetidos, sin depender del color (daltonismo).',
  },
  showTimer: { name: 'Mostrar cronómetro', description: 'Apágalo para jugar sin presión.' },
  haptics: { name: 'Vibración', description: 'Vibra al tocar números y al equivocarte.' },
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
    up: 'Mover arriba',
    down: 'Mover abajo',
    left: 'Mover a la izquierda',
    right: 'Mover a la derecha',
  },
  settings: {
    title: 'Ajustes',
    open: 'Ajustes',
    menuEntry: 'Ajustes de vista y control',
    menuEntryDetail: 'Tema, tamaño de números, una mano',
    done: 'Listo',
    theme: 'Tema',
    textSize: 'Tamaño de los números',
    hand: 'Modo una mano',
    more: 'Más opciones',
    easyView: 'Activar modo fácil de ver',
    easyViewDetail:
      'Números muy grandes, contraste máximo, líneas gruesas y errores marcados con forma.',
    reset: 'Volver a lo normal',
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
