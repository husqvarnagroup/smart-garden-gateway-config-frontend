// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/composables/useAuth';
import { authState, resetAuthState } from '@/state/auth';
import * as authService from '@/services/auth';

vi.mock('@/services/auth', () => ({
  loginRequest: vi.fn<(password: string) => Promise<string>>(),
  logoutRequest: vi.fn<() => Promise<void>>(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    resetAuthState();
    vi.clearAllMocks();
  });

  it('isAuthenticated is false with no session', () => {
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(false);
  });

  it('isAuthenticated is true when session is set', () => {
    authState.session = 'abc123';
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(true);
  });

  it('login sets session on success', async () => {
    vi.mocked(authService.loginRequest).mockResolvedValue('session-token');
    const { login, isAuthenticated } = useAuth();
    await login('correct-password');
    expect(isAuthenticated.value).toBe(true);
    expect(authState.session).toBe('session-token');
  });

  it('login clears session and sets error on failure', async () => {
    vi.mocked(authService.loginRequest).mockRejectedValue(new Error('Wrong password'));
    const { login } = useAuth();
    await expect(login('wrong')).rejects.toThrow('Wrong password');
    expect(authState.session).toBeNull();
    expect(authState.error).toBe('Wrong password');
  });

  it('login tracks loading state', async () => {
    let resolve!: (v: string) => void;
    vi.mocked(authService.loginRequest).mockReturnValue(new Promise((r) => (resolve = r)));
    const { login } = useAuth();
    const p = login('pw');
    expect(authState.loading).toBe(true);
    resolve('token');
    await p;
    expect(authState.loading).toBe(false);
  });

  it('logout clears auth state', async () => {
    vi.mocked(authService.logoutRequest).mockResolvedValue(undefined);
    authState.session = 'existing';
    const { logout, isAuthenticated } = useAuth();
    await logout();
    expect(authState.session).toBeNull();
    expect(isAuthenticated.value).toBe(false);
    expect(authState.loading).toBe(false);
  });

  it('logout clears auth state even when request fails', async () => {
    vi.mocked(authService.logoutRequest).mockRejectedValue(new Error('Network'));
    authState.session = 'existing';
    const { logout } = useAuth();
    await expect(logout()).rejects.toThrow('Network');
    expect(authState.session).toBeNull();
    expect(authState.loading).toBe(false);
  });
});
