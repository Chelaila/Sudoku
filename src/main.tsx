import { setupIonicReact } from '@ionic/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { applySettings, systemPrefersDark } from './settings/apply-settings'
import { loadSettings } from './settings/settings-storage'
import { SettingsProvider } from './settings/SettingsProvider'

/*
 * Ionic base styles (required) + typography + its dark palette, switched on
 * by the `ion-palette-dark` class (see apply-settings.ts) so the in-app theme
 * picker can override the phone's setting. index.css paints the app themes.
 */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/palettes/dark.class.css'
import './index.css'

// Material Design look everywhere, so the browser preview matches Android.
setupIonicReact({ mode: 'md' })

// Paint the saved theme before the first render: no white flash at launch.
applySettings(loadSettings(), systemPrefersDark())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>,
)
