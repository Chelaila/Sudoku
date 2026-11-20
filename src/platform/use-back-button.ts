import { App } from '@capacitor/app'
import { useEffect } from 'react'

/**
 * Takes over Android's hardware back button. Once a listener exists,
 * Capacitor stops its default behavior, so `handler` must decide everything
 * (navigate, or call App.exitApp()).
 */
export function useBackButton(handler: () => void): void {
  useEffect(() => {
    const listener = App.addListener('backButton', handler)
    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [handler])
}
