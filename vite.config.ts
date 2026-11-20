import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Port 5174 so it can run side by side with the Hub frontend (5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  // Ionic React ships every component in one chunk (~1.5 MB). It lives inside
  // the APK and is read from disk, so the web-oriented 500 kB warning is noise.
  build: { chunkSizeWarningLimit: 2000 },
})
