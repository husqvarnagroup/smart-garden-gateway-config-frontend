import { apiFetch } from '@/services/api'

export type GatewayVersion = {
  version: string
}

export type ApConfig = {
  ssid: string
  password: string
}

export const getGatewayVersion = (): Promise<GatewayVersion> =>
  apiFetch<GatewayVersion>('/version', 'GET', undefined, true)

export const getAp = (): Promise<ApConfig> => apiFetch<ApConfig>('/ap', 'GET')

export const resetHomekit = (): Promise<void> => apiFetch<void>('/homekit', 'DELETE')
