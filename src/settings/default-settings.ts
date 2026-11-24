import type { AppSettings, HandMode, TextSize, ThemeChoice } from '../interfaces/settings'

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  textSize: 'normal',
  hand: 'both',
  thickLines: false,
  shapeErrors: false,
  showTimer: true,
  haptics: true,
}

/**
 * One tap for tired or low-vision eyes: biggest digits, maximum contrast,
 * heavy grid lines and mistakes that do not depend on telling colors apart.
 */
export const EASY_VIEW_PRESET: Partial<AppSettings> = {
  theme: 'contrast-light',
  textSize: 'xlarge',
  thickLines: true,
  shapeErrors: true,
}

export const THEME_ORDER: readonly ThemeChoice[] = [
  'system',
  'light',
  'dark',
  'paper',
  'contrast-light',
  'contrast-dark',
]

export const TEXT_SIZE_ORDER: readonly TextSize[] = ['normal', 'large', 'xlarge']

export const HAND_ORDER: readonly HandMode[] = ['both', 'right', 'left']
