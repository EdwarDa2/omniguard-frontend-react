/**
 * Modelo de error canónico retornado por GlobalExceptionHandler en omniguard-core-java.
 */
export interface ApiErrorResponse {
  timestamp: string // ISO-8601 (ej. "2026-11-25T08:30:00Z")
  status: number // Código numérico HTTP (ej. 400, 401, 403, 404, 409)
  error: string // Nombre del error HTTP (ej. "Conflict", "Bad Request")
  message: string // Mensaje legible de negocio
  path: string // Ruta del endpoint solicitado
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  message?: string
}
