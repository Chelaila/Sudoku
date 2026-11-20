import { setupIonicReact } from '@ionic/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

/*
 * Ionic base styles (required) + typography + its system dark palette (which
 * supplies the gray ramps its components use). index.css then repaints the
 * base colors to the app's own theme.
 */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/palettes/dark.system.css'
import './index.css'

// Material Design look everywhere, so the browser preview matches Android.
setupIonicReact({ mode: 'md' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
