import type { CellState, GameState } from '../interfaces/game'
import type { GameAction } from '../interfaces/game-action'
import { eraseCells, placeValue, toggleNotes } from './cell-edits'
import { GAME_MODES } from './game-modes'
import { applyMove, applySelect } from './selection'

const HISTORY_LIMIT = 200

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'select':
      return withSelection(state, applySelect(state.selection, action.index, action.mode))
    case 'move':
      return withSelection(
        state,
        applyMove(state.selection, action.rowDelta, action.colDelta, action.extend),
      )
    case 'clearSelection':
      return withSelection(state, [])
    case 'togglePencil':
      return { ...state, pencil: !state.pencil }
    case 'input':
      return state.status === 'playing' ? input(state, action.digit, action.asNote) : state
    case 'erase':
      return state.status === 'playing'
        ? commit(state, eraseCells(state.cells, state.selection))
        : state
    case 'undo':
      return state.status === 'playing' ? undo(state) : state
  }
}

function input(state: GameState, digit: number, forceNote: boolean): GameState {
  const { selection, cells } = state
  if (selection.length === 0) return state

  // Several cells selected = smart pencil: the same note goes into all of them.
  if (forceNote || state.pencil || selection.length > 1) {
    return commit(state, toggleNotes(cells, selection, digit))
  }

  const index = selection[0]
  const next = placeValue(cells, index, digit)
  if (next === cells) return state
  const placed = next[index].value
  return settle(commit(state, next), placed !== 0 && placed !== state.solution[index])
}

/** Applies mode rules after a digit is placed: mistakes, defeat and victory. */
function settle(state: GameState, isMistake: boolean): GameState {
  const rules = GAME_MODES[state.mode]
  const mistakes = state.mistakes + (isMistake && rules.checksAgainstSolution ? 1 : 0)
  if (rules.maxMistakes !== null && mistakes >= rules.maxMistakes) {
    return { ...state, mistakes, status: 'lost' }
  }
  const solved = state.cells.every((cell, index) => cell.value === state.solution[index])
  return { ...state, mistakes, status: solved ? 'won' : 'playing' }
}

/** Stores the new board and pushes the previous one to the undo history. */
function commit(state: GameState, cells: readonly CellState[]): GameState {
  if (cells === state.cells) return state
  return {
    ...state,
    cells,
    history: [...state.history.slice(-(HISTORY_LIMIT - 1)), state.cells],
  }
}

/** Mistakes are not refunded on undo, same as most sudoku apps. */
function undo(state: GameState): GameState {
  const previous = state.history.at(-1)
  if (!previous) return state
  return { ...state, cells: previous, history: state.history.slice(0, -1) }
}

function withSelection(state: GameState, selection: readonly number[]): GameState {
  return selection === state.selection ? state : { ...state, selection }
}
