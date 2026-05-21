import { computed, readonly } from 'vue'

import { loginRequest } from '@/services/auth'
import { authState, resetAuthState } from '@/state/auth'

const isAuthenticated = computed(() => authState.session !== null)

const login = async (password: string) => {
  authState.loading = true
  authState.error = null

  try {
    authState.session = await loginRequest(password)
  } catch (error) {
    resetAuthState()
    authState.error = error instanceof Error ? error.message : 'Login failed'
    throw error
  } finally {
    authState.loading = false
  }
}

const logout = () => {
  resetAuthState()
}

export const useAuth = () => ({
  authState: readonly(authState),
  isAuthenticated,
  login,
  logout,
})
