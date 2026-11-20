/** cx('cell', isGiven && 'is-given') → "cell is-given" */
export function cx(...parts: readonly (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
