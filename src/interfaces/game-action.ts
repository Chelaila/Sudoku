/**
 * replace: plain click · toggle: Ctrl/Shift+click · extend: drag or Shift+arrow
 */
export type SelectMode = 'replace' | 'toggle' | 'extend'

export type GameAction =
  | { readonly type: 'select'; readonly index: number; readonly mode: SelectMode }
  | {
      readonly type: 'move'
      readonly rowDelta: number
      readonly colDelta: number
      readonly extend: boolean
    }
  | { readonly type: 'clearSelection' }
  /** `asNote` forces a pencil mark (Shift+digit) even with the pencil off. */
  | { readonly type: 'input'; readonly digit: number; readonly asNote: boolean }
  | { readonly type: 'erase' }
  | { readonly type: 'togglePencil' }
  | { readonly type: 'undo' }
