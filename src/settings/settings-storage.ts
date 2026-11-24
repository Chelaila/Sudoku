import type { AppSettings } from '../interfaces/settings'
import { DEFAULT_SETTINGS, HAND_ORDER, TEXT_SIZE_ORDER, THEME_ORDER } from './default-settings'

const STORAGE_KEY = 'sudoku.settings'

/** Stored values are merged over the defaults; unknown or invalid ones are dropped. */
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const stored = JSON.parse(raw) as Partial<AppSettings>
    return {
      theme: pick(stored.theme, THEME_ORDER, DEFAULT_SETTINGS.theme),
      textSize: pick(stored.textSize, TEXT_SIZE_ORDER, DEFAULT_SETTINGS.textSize),
      hand: pick(stored.hand, HAND_ORDER, DEFAULT_SETTINGS.hand),
      thickLines: flag(stored.thickLines, DEFAULT_SETTINGS.thickLines),
      shapeErrors: flag(stored.shapeErrors, DEFAULT_SETTINGS.shapeErrors),
      showTimer: flag(stored.showTimer, DEFAULT_SETTINGS.showTimer),
      haptics: flag(stored.haptics, DEFAULT_SETTINGS.haptics),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Settings still apply for this session; they just won't survive a restart.
  }
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

function flag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}
