import { readonly, ref } from 'vue'

import {
  getCurrentWifi,
  resetWifi,
  setWifi,
  wifiScan,
  type WifiConfig,
  type WifiNetwork,
} from '@/services/wifi'

const networks = ref<WifiNetwork[]>([])
const current = ref<WifiConfig | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchWifi = async () => {
  loading.value = true
  error.value = null
  try {
    ;[networks.value, current.value] = await Promise.all([wifiScan(), getCurrentWifi()])
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load wifi'
  } finally {
    loading.value = false
  }
}

const connectWifi = async (ssid: string, security: string, password: string) => {
  loading.value = true
  error.value = null
  try {
    current.value = await setWifi(ssid, security, password)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to connect wifi'
    throw e
  } finally {
    loading.value = false
  }
}

const disconnectWifi = async () => {
  loading.value = true
  error.value = null
  try {
    await resetWifi()
    current.value = null
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to reset wifi'
    throw e
  } finally {
    loading.value = false
  }
}

export const useWifi = () => ({
  networks: readonly(networks),
  current: readonly(current),
  loading: readonly(loading),
  error: readonly(error),
  fetchWifi,
  connectWifi,
  disconnectWifi,
})
