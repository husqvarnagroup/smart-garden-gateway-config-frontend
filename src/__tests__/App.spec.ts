// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';
import { authState, resetAuthState } from '@/state/auth';
import App from '../App.vue';
import router from '../router';
import i18next from '../i18n';
import * as systemService from '@/services/system';

vi.mock('@/services/system', () => ({
  resetHomekit: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
}));

let wrapper: VueWrapper | null = null;
const mountApp = () => {
  wrapper = mount(App, {
    global: {
      plugins: [router, [I18NextVue, { i18next }]],
      stubs: {
        RouterView: true,
        ToastContainer: true,
      },
    },
  });
  return wrapper;
};

describe('App', () => {
  beforeEach(async () => {
    resetAuthState();
    await router.replace('/login');
    document.documentElement.lang = '';
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    document.documentElement.lang = '';
  });

  it('sets document.documentElement.lang to the resolved i18n language on mount', async () => {
    mountApp();
    await flushPromises();

    expect(document.documentElement.lang).toBe(i18next.resolvedLanguage);
    expect(document.documentElement.lang).not.toBe('');
  });

  it('redirects from a protected route when authentication is lost after mount', async () => {
    authState.session = 'token';
    await router.replace('/');
    await router.isReady();

    mountApp();
    expect(router.currentRoute.value.name).toBe('home');

    authState.session = null;
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('login');
  });

  it('redirects to login when a service call clears the session (e.g. apiFetch 401)', async () => {
    authState.session = 'token';
    await router.replace('/');
    await router.isReady();

    mountApp();
    expect(router.currentRoute.value.name).toBe('home');

    // Mirrors apiFetch's 401 side-effect: clear session first, then throw.
    vi.mocked(systemService.resetHomekit).mockImplementation(async () => {
      authState.session = null;
      throw new Error('Unauthorized');
    });

    await expect(systemService.resetHomekit()).rejects.toThrow('Unauthorized');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('login');
  });
});
