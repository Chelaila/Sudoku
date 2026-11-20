/** Display copy for a selectable option (difficulty, game mode, ...). */
export interface OptionLabel {
  readonly name: string
  readonly description: string
}

/** An OptionLabel bound to its value, ready for a selector. */
export interface SelectOption<T extends string> extends OptionLabel {
  readonly value: T
  /** Small extra info shown next to the name (e.g. the rating range). */
  readonly badge?: string
}
