import { readonly, ref } from 'vue'

import { getAp, getGatewayVersion, resetHomekit, type ApConfig, type GatewayVersion } from '@/services/system'

const version = ref<GatewayVersion | null>(null)
const ap = ref<ApConfig | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchSystem = async () => {
  loading.value = true
  error.value = null
  try {
    ;[version.value, ap.value] = await Promise.all([getGatewayVersion(), getAp()])
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load system info'
  } finally {
    loading.value = false
  }
}

const clearHomekit = async () => {
  loading.value = true
  error.value = null
  try {
    await resetHomekit()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to reset HomeKit'
    throw e
  } finally {
    loading.value = false
  }
}

export const useSystem = () => ({
  version: readonly(version),
  ap: readonly(ap),
  loading: readonly(loading),
  error: readonly(error),
  fetchSystem,
  clearHomekit,
})
