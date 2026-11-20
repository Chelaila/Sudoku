import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

/**
 * Fire-and-forget vibrations. On the web Capacitor falls back to
 * navigator.vibrate (or does nothing), so callers never need to care.
 */
export function tapFeedback(): void {
  Haptics.impact({ style: ImpactStyle.Light }).catch(ignore)
}

export function errorFeedback(): void {
  Haptics.notification({ type: NotificationType.Error }).catch(ignore)
}

export function successFeedback(): void {
  Haptics.notification({ type: NotificationType.Success }).catch(ignore)
}

function ignore(): void {
  // Haptics are a nicety; a device without a vibrator is not an error.
}
