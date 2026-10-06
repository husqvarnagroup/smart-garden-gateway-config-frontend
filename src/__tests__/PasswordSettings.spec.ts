// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors } from './setup';
import { resetToastMocks } from './helpers/mockUseToast';
import { expectErrorToastFired, expectSuccessToastFired } from './helpers/assertErrorToast';
import { deferred } from './helpers/asyncControl';
import PasswordSettings from '@/components/PasswordSettings.vue';
import i18next from '@/i18n';
import * as passwordService from '@/services/password';

vi.mock('@/services/password', () => ({
  changePassword: vi.fn<(current: string, next: string) => Promise<void>>(),
  resetPassword: vi.fn<(current: string) => Promise<void>>(),
}));

const { logout } = vi.hoisted(() => ({
  logout: vi.fn<() => Promise<void>>(() => Promise.resolve()),
}));

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ logout }),
}));

const mountPasswordSettings = () =>
  mount(PasswordSettings, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

type Wrapper = ReturnType<typeof mountPasswordSettings>;

const getToggleButton = (wrapper: Wrapper) => wrapper.get('[data-testid="expandable-toggle"]');

const expandSettings = async (wrapper: Wrapper) => {
  await getToggleButton(wrapper).trigger('click');
};

const getCurrentPasswordInput = (wrapper: Wrapper) =>
  wrapper.get('[data-testid="password-current"] input');
const getNewPasswordInput = (wrapper: Wrapper) => wrapper.get('[data-testid="password-new"] input');
const getConfirmPasswordInput = (wrapper: Wrapper) =>
  wrapper.get('[data-testid="password-confirm"] input');
const getResetCurrentPasswordInput = (wrapper: Wrapper) =>
  wrapper.get('[data-testid="password-reset-current"] input');

const getChangeButton = (wrapper: Wrapper) => wrapper.get('form button[type="submit"]');
const getResetButton = (wrapper: Wrapper) => wrapper.get('[data-testid="reset-password"]');

const fillChangeForm = async (wrapper: Wrapper, current: string, next: string, confirm: string) => {
  await getCurrentPasswordInput(wrapper).setValue(current);
  await getNewPasswordInput(wrapper).setValue(next);
  await getConfirmPasswordInput(wrapper).setValue(confirm);
};

describe('PasswordSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetToastMocks();
  });

  it('starts collapsed, showing only the heading', () => {
    const wrapper = mountPasswordSettings();

    expect(wrapper.text()).toContain('Password Settings');
    expect(getToggleButton(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('expands to show the form when the toggle is clicked', async () => {
    const wrapper = mountPasswordSettings();

    await expandSettings(wrapper);

    expect(getToggleButton(wrapper).attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('collapses again when the toggle is clicked a second time', async () => {
    const wrapper = mountPasswordSettings();

    await expandSettings(wrapper);
    await expandSettings(wrapper);

    expect(getToggleButton(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('disables the change-password submit button until all fields are filled', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'new-pass');

    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });

  it('disables submit and shows a hint when new and confirm passwords do not match', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'different');

    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);
    expect(wrapper.text()).toContain('Passwords do not match');
  });

  it('disables submit and shows a hint when the new password is shorter than 8 characters', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'short', 'short');

    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);
    expect(wrapper.text()).toContain('Password must be between 8 and 50 characters');
  });

  it('disables submit and shows a hint when the new password is longer than 50 characters', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);
    const tooLong = 'a'.repeat(51);

    await fillChangeForm(wrapper, 'old-pass', tooLong, tooLong);

    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);
    expect(wrapper.text()).toContain('Password must be between 8 and 50 characters');
  });

  it('allows new passwords at the 8 and 50 character boundaries', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', '12345678', '12345678');
    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);

    const maxLength = 'a'.repeat(50);
    await fillChangeForm(wrapper, 'old-pass', maxLength, maxLength);
    expect((getChangeButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });

  it('submits the change-password form and shows a success toast', async () => {
    vi.mocked(passwordService.changePassword).mockResolvedValue(undefined);
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'new-pass');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expect(passwordService.changePassword).toHaveBeenCalledWith('old-pass', 'new-pass');
    expectSuccessToastFired();
    expect((getCurrentPasswordInput(wrapper).element as HTMLInputElement).value).toBe('');
  });

  it('logs out after a successful password change', async () => {
    vi.mocked(passwordService.changePassword).mockResolvedValue(undefined);
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'new-pass');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expect(logout).toHaveBeenCalledOnce();
  });

  it('still shows the success toast when the logout after a password change fails', async () => {
    vi.mocked(passwordService.changePassword).mockResolvedValue(undefined);
    logout.mockRejectedValueOnce(new Error('Failed'));
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'new-pass');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expectSuccessToastFired();
    expect(logout).toHaveBeenCalledOnce();
  });

  it('shows an error toast when changing the password fails', async () => {
    vi.mocked(passwordService.changePassword).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await fillChangeForm(wrapper, 'old-pass', 'new-pass', 'new-pass');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expectErrorToastFired();
    expect(logout).not.toHaveBeenCalled();
  });

  it('disables the reset button until a current password is entered', async () => {
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    expect((getResetButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);

    await getResetCurrentPasswordInput(wrapper).setValue('old-pass');

    expect((getResetButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });

  it('submits the reset form and shows a success toast', async () => {
    vi.mocked(passwordService.resetPassword).mockResolvedValue(undefined);
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await getResetCurrentPasswordInput(wrapper).setValue('old-pass');
    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(passwordService.resetPassword).toHaveBeenCalledWith('old-pass');
    expectSuccessToastFired();
    expect((getResetCurrentPasswordInput(wrapper).element as HTMLInputElement).value).toBe('');
  });

  it('logs out after a successful password reset', async () => {
    vi.mocked(passwordService.resetPassword).mockResolvedValue(undefined);
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await getResetCurrentPasswordInput(wrapper).setValue('old-pass');
    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(logout).toHaveBeenCalledOnce();
  });

  it('shows an error toast when resetting the password fails', async () => {
    vi.mocked(passwordService.resetPassword).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await getResetCurrentPasswordInput(wrapper).setValue('old-pass');
    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
    expect(logout).not.toHaveBeenCalled();
  });

  it('shows a loading state on the reset button while resetting', async () => {
    const pending = deferred();
    vi.mocked(passwordService.resetPassword).mockReturnValue(pending.promise);
    const wrapper = mountPasswordSettings();
    await expandSettings(wrapper);

    await getResetCurrentPasswordInput(wrapper).setValue('old-pass');
    await getResetButton(wrapper).trigger('click');

    expect((getResetButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);
    expect(getResetButton(wrapper).attributes('aria-busy')).toBe('true');

    pending.resolve();
    await flushPromises();

    expect(getResetButton(wrapper).attributes('aria-busy')).toBeUndefined();
  });
});
