import { readonly, ref } from 'vue'

import {
  getCurrentTimezone,
  listTimezones,
  setTimezone,
  type TimezoneConfig,
} from '@/services/timezone'

const timezones = ref<string[]>([])
const current = ref<TimezoneConfig | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchTimezones = async () => {
  loading.value = true
  error.value = null
  try {
    ;[timezones.value, current.value] = await Promise.all([
      listTimezones(),
      getCurrentTimezone(),
    ])
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load timezones'
  } finally {
    loading.value = false
  }
}

const updateTimezone = async (timezone: string) => {
  loading.value = true
  error.value = null
  try {
    current.value = await setTimezone(timezone)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to set timezone'
    throw e
  } finally {
    loading.value = false
  }
}

export const useTimezone = () => ({
  timezones: readonly(timezones),
  current: readonly(current),
  loading: readonly(loading),
  error: readonly(error),
  fetchTimezones,
  updateTimezone,
})
