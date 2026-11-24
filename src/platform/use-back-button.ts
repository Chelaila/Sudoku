import { App } from '@capacitor/app'
import type { BackButtonEvent } from '@ionic/react'
import { useEffect } from 'react'

/** Ionic runs only the highest-priority handler: overlays use 100, so an open
 *  modal or alert closes first and this app-level handler waits its turn. */
const APP_PRIORITY = 10

/**
 * Handles Android's hardware back button through Ionic's priority queue.
 *
 * The empty Capacitor listener is required: Capacitor forwards the back press
 * to the web layer (as the DOM event Ionic listens to) only while at least
 * one `backButton` listener exists; otherwise it closes the app natively.
 */
export function useBackButton(handler: () => void): void {
  useEffect(() => {
    const nativeListener = App.addListener('backButton', () => {})
    const onIonBackButton = (event: Event) => {
      const { detail } = event as BackButtonEvent
      detail.register(APP_PRIORITY, handler)
    }
    document.addEventListener('ionBackButton', onIonBackButton)
    return () => {
      document.removeEventListener('ionBackButton', onIonBackButton)
      void nativeListener.then((handle) => handle.remove())
    }
  }, [handler])
}
