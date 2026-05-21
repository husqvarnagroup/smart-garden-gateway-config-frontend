import { apiFetch } from '@/services/api'

export type Timezone = string

export type TimezoneConfig = {
  timezone: string
}

export const listTimezones = (): Promise<Timezone[]> =>
  apiFetch<Timezone[]>('/timezone_list', 'GET')

export const getCurrentTimezone = (): Promise<TimezoneConfig> =>
  apiFetch<TimezoneConfig>('/timezone', 'GET')

export const setTimezone = (timezone: string): Promise<TimezoneConfig> =>
  apiFetch<TimezoneConfig>('/timezone', 'PUT', { timezone })
