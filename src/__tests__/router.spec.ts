// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, beforeEach } from 'vitest';
import router from '@/router';
import { authState, resetAuthState } from '@/state/auth';

describe('router guards', () => {
  beforeEach(async () => {
    resetAuthState();
    authState.session = 'reset-token';
    await router.replace({ path: '/', query: { _t: String(Date.now() + Math.random()) } });
    resetAuthState();
    await router.isReady();
  });

  it('redirects unauthenticated user from / to login', async () => {
    await router.push('/');
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('allows authenticated user to access home', async () => {
    authState.session = 'token';
    await router.push('/');
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('redirects authenticated user from /login to home', async () => {
    authState.session = 'token';
    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('allows unauthenticated user to access /login', async () => {
    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('login');
  });
});
