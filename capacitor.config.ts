import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'cl.hub.sudoku',
  appName: 'Sudoku',
  webDir: 'dist',
  plugins: {
    // Edge-to-edge on Android: the webview fills the screen and Ionic pads
    // the header/footer with env(safe-area-inset-*) (needs viewport-fit=cover).
    SystemBars: {
      insetsHandling: 'native',
      initialViewportFitValueHint: 'cover',
    },
  },
}

export default config
