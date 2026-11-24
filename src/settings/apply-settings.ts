import { SystemBars, SystemBarsStyle } from '@capacitor/core'
import type { AppSettings, ResolvedTheme, ThemeChoice } from '../interfaces/settings'

const DARK_THEMES: ReadonlySet<ResolvedTheme> = new Set(['dark', 'contrast-dark'])
const DARK_QUERY = '(prefers-color-scheme: dark)'

export function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches
}

/** Calls `onChange` whenever the OS switches between light and dark. */
export function watchSystemTheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function resolveTheme(choice: ThemeChoice, prefersDark: boolean): ResolvedTheme {
  if (choice !== 'system') return choice
  return prefersDark ? 'dark' : 'light'
}

/**
 * Paints the settings onto <html>: CSS reads the data-* attributes, Ionic's
 * dark palette follows `ion-palette-dark`, and the Android status bar icons
 * flip so they stay readable on the new background.
 */
export function applySettings(settings: AppSettings, prefersDark: boolean): void {
  const theme = resolveTheme(settings.theme, prefersDark)
  const isDark = DARK_THEMES.has(theme)
  const root = document.documentElement

  root.dataset.theme = theme
  root.dataset.textSize = settings.textSize
  root.toggleAttribute('data-thick-lines', settings.thickLines)
  root.toggleAttribute('data-shape-errors', settings.shapeErrors)
  root.classList.toggle('ion-palette-dark', isDark)

  SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {
    // Web preview or old WebView: there is no native status bar to restyle.
  })
}
