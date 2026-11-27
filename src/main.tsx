import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getActiveSensorId } from './utils/sensorId'

// Capturar de inmediato ?sensor_id=... en sessionStorage antes de cualquier redirección de React Router
getActiveSensorId()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
