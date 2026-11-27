/**
 * Gestiona la marca temporal de inicio de sesión de prueba del evaluador en el SOC.
 * Se inicializa cuando se abre la aplicación y se almacena en sessionStorage.
 * Permite que el Dashboard en tiempo real arranque limpio en 0 alertas recientes.
 */
const SESSION_START_KEY = 'omniguard_session_start_time'

export function getSessionStartTime(): string {
  if (typeof window === 'undefined') {
    return new Date().toISOString()
  }

  try {
    let stored = sessionStorage.getItem(SESSION_START_KEY)
    if (!stored) {
      stored = new Date().toISOString()
      sessionStorage.setItem(SESSION_START_KEY, stored)
    }
    return stored
  } catch {
    return new Date().toISOString()
  }
}

export function resetSessionStartTime(): string {
  const newStart = new Date().toISOString()
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SESSION_START_KEY, newStart)
    } catch {
      // Manejo de restricciones de sandbox
    }
  }
  return newStart
}
