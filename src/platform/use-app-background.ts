import { App } from '@capacitor/app'
import { useEffect } from 'react'

/**
 * Calls `onBackground` when the app is minimized, the screen turns off or a
 * call comes in. On the web, Capacitor maps this to `visibilitychange`.
 */
export function useAppBackground(onBackground: () => void): void {
  useEffect(() => {
    const listener = App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) onBackground()
    })
    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [onBackground])
}
