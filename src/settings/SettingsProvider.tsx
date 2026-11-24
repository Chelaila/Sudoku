import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppSettings } from '../interfaces/settings'
import { applySettings, systemPrefersDark, watchSystemTheme } from './apply-settings'
import { SettingsContext } from './settings-context'
import { loadSettings, saveSettings } from './settings-storage'

interface SettingsProviderProps {
  readonly children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  // Re-paint on every change, and follow the OS while the theme is "system".
  useEffect(() => {
    const paint = () => applySettings(settings, systemPrefersDark())
    paint()
    return settings.theme === 'system' ? watchSystemTheme(paint) : undefined
  }, [settings])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
