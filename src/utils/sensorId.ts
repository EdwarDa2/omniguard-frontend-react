/**
 * Obtiene el identificador del sensor actual asignado a esta instancia del cliente.
 * Se busca primero en los parámetros de la URL (?sensor_id=...), se almacena en sessionStorage
 * para persistir durante la navegación en la SPA, y si no existe, devuelve null.
 */
export function getActiveSensorId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const urlParams = new URLSearchParams(window.location.search)
    const paramSensorId = urlParams.get('sensor_id')

    if (paramSensorId && paramSensorId.trim().length > 0) {
      const cleanId = paramSensorId.trim()
      sessionStorage.setItem('omniguard_sensor_id', cleanId)
      return cleanId
    }

    const storedId = sessionStorage.getItem('omniguard_sensor_id')
    if (storedId && storedId.trim().length > 0) {
      return storedId.trim()
    }
  } catch {
    // Manejo de restricciones de sandbox o almacenamiento privado
  }

  return null
}
