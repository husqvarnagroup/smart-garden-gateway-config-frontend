// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { computed, readonly } from 'vue';

import { loginRequest, logoutRequest } from '@/services/auth';
import { authState, resetAuthState } from '@/state/auth';

const isAuthenticated = computed(() => authState.session !== null);

const login = async (password: string) => {
  authState.loading = true;
  authState.error = null;

  try {
    authState.session = await loginRequest(password);
  } catch (error) {
    resetAuthState();
    authState.error = error instanceof Error ? error.message : 'Login failed';
    throw error;
  } finally {
    authState.loading = false;
  }
};

const logout = async () => {
  authState.loading = true;

  try {
    await logoutRequest();
  } finally {
    resetAuthState();
  }
};

export const useAuth = () => ({
  authState: readonly(authState),
  isAuthenticated,
  login,
  logout,
});
