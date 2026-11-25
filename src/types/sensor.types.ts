export type SensorStatus = 'ACTIVE' | 'PAUSED' | 'INACTIVE'
export type SensorAction = 'START' | 'STOP' | 'PAUSE' | 'RESUME'

export interface SensorStatusResponse {
  status: SensorStatus
  message: string
  timestamp: string
}

export interface SensorStatusRequest {
  action: SensorAction
}
