export type ThemeChoice = 'system' | 'light' | 'dark' | 'paper' | 'contrast-light' | 'contrast-dark'

/** The theme actually painted: 'system' resolved against the OS setting. */
export type ResolvedTheme = Exclude<ThemeChoice, 'system'>

export type TextSize = 'normal' | 'large' | 'xlarge'

/** Which thumb plays: 'both' keeps the full-width pad. */
export type HandMode = 'both' | 'right' | 'left'

export interface AppSettings {
  readonly theme: ThemeChoice
  readonly textSize: TextSize
  readonly hand: HandMode
  readonly thickLines: boolean
  /** Mark mistakes with a shape too (wavy underline, hatching), not color alone. */
  readonly shapeErrors: boolean
  readonly showTimer: boolean
  readonly haptics: boolean
}

/** The on/off settings, shown as switches. */
export type ToggleSetting = {
  [K in keyof AppSettings]: AppSettings[K] extends boolean ? K : never
}[keyof AppSettings]

export interface SettingsContextValue {
  readonly settings: AppSettings
  readonly updateSettings: (patch: Partial<AppSettings>) => void
}
