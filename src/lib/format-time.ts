/** 75_000 → "01:15" · 3_725_000 → "1:02:05" */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const mmss = `${pad(minutes)}:${pad(seconds)}`
  return hours > 0 ? `${hours}:${mmss}` : mmss
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
