import { useEffect, useState } from 'react'

const TICK_MS = 500

/**
 * Play time that only advances while `running`. It adds real
 * `performance.now()` deltas instead of counting ticks, so a throttled or
 * late interval never makes the clock drift.
 */
export function useTimer(initialMs: number, running: boolean): number {
  const [elapsedMs, setElapsedMs] = useState(initialMs)

  useEffect(() => {
    if (!running) return
    let last = performance.now()
    const advance = () => {
      const now = performance.now()
      const delta = now - last
      last = now
      setElapsedMs((ms) => ms + delta)
    }
    const id = window.setInterval(advance, TICK_MS)
    return () => {
      window.clearInterval(id)
      advance() // keep the partial tick when pausing
    }
  }, [running])

  return elapsedMs
}
