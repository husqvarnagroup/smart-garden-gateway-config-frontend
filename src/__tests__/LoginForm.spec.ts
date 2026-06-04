// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';
import { createRouter, createMemoryHistory, type Router } from 'vue-router';

import { allowConsoleErrors, getConsoleErrorSpy } from './setup';
import { mockToastError, resetToastMocks } from './helpers/mockUseToast';
import { deferred } from './helpers/asyncControl';
import LoginForm from '@/components/LoginForm.vue';
import i18next from '@/i18n';
import * as authService from '@/services/auth';
import { resetAuthState } from '@/state/auth';

vi.mock('@/services/auth', () => ({
  loginRequest: vi.fn<(password: string) => Promise<string>>(),
  logoutRequest: vi.fn<() => Promise<void>>(),
}));

const buildRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
    ],
  });

const mountLoginForm = async () => {
  const router = buildRouter();
  await router.push('/login');
  await router.isReady();
  const wrapper = mount(LoginForm, {
    global: { plugins: [router, [I18NextVue, { i18next }]] },
  });
  return { wrapper, router };
};

describe('LoginForm', () => {
  beforeEach(() => {
    resetAuthState();
    vi.clearAllMocks();
    resetToastMocks();
  });

  it('keeps submit disabled while the password field is empty', async () => {
    const { wrapper } = await mountLoginForm();
    const submit = wrapper.find('button[type="submit"]');
    expect((submit.element as HTMLButtonElement).disabled).toBe(true);

    await wrapper.find('input[name="password"]').setValue('secret');
    expect((submit.element as HTMLButtonElement).disabled).toBe(false);
  });

  it('navigates to / after a successful login', async () => {
    vi.mocked(authService.loginRequest).mockResolvedValue('session-token');
    const { wrapper, router } = await mountLoginForm();

    await wrapper.find('input[name="password"]').setValue('secret');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(authService.loginRequest).toHaveBeenCalledWith('secret');
    expect(router.currentRoute.value.name).toBe('home');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows an error toast on failed login', async () => {
    vi.mocked(authService.loginRequest).mockRejectedValue(new Error('Wrong password'));
    allowConsoleErrors();
    const { wrapper, router } = await mountLoginForm();

    await wrapper.find('input[name="password"]').setValue('nope');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledOnce();
    expect(router.currentRoute.value.name).toBe('login');
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('disables the input and submit while the login request is in flight', async () => {
    const pending = deferred<string>();
    vi.mocked(authService.loginRequest).mockReturnValue(pending.promise);
    const { wrapper } = await mountLoginForm();

    await wrapper.find('input[name="password"]').setValue('secret');
    await wrapper.find('form').trigger('submit.prevent');

    expect((wrapper.find('input[name="password"]').element as HTMLInputElement).disabled).toBe(
      true,
    );
    expect((wrapper.find('button[type="submit"]').element as HTMLButtonElement).disabled).toBe(
      true,
    );

    pending.resolve('session-token');
    await flushPromises();

    expect((wrapper.find('input[name="password"]').element as HTMLInputElement).disabled).toBe(
      false,
    );
  });
});
