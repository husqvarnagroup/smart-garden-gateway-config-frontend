// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors, getConsoleErrorSpy } from './setup';
import { mockToastError, mockToastSuccess, resetToastMocks } from './helpers/mockUseToast';
import { expectSuccessToastFired } from './helpers/assertErrorToast';
import { deferred } from './helpers/asyncControl';
import WifiInfo from '@/components/WifiInfo.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PasswordField from '@/components/PasswordField.vue';
import i18next from '@/i18n';
import * as wifiService from '@/services/wifi';
import type { WifiConfig, WifiNetwork } from '@/services/wifi';

const { mockGetNormalisedWifiInfo, mockGetNormalisedNetworks } = vi.hoisted(() => ({
  mockGetNormalisedWifiInfo: vi.fn<() => Promise<WifiConfig>>(),
  mockGetNormalisedNetworks: vi.fn<() => Promise<WifiNetwork[]>>(),
}));

vi.mock('@/utils/wifiUtils', () => ({
  getNormalisedWifiInfo: mockGetNormalisedWifiInfo,
  getNormalisedNetworks: mockGetNormalisedNetworks,
}));

vi.mock('@/services/wifi', () => ({
  setWifi: vi.fn<(ssid: string, security: string, password: string) => Promise<WifiConfig>>(),
  resetWifi: vi.fn<() => Promise<void>>(),
}));

const NETWORKS: WifiNetwork[] = [
  { ssid: 'SecuredNetwork', signal: 80, security: 'WPA2', isHidden: false },
  { ssid: 'OpenNetwork', signal: 60, security: '', isHidden: false },
  { ssid: 'Hidden Wi-Fi', signal: 50, security: 'WPA2', isHidden: true },
];

const mountWifiInfo = () =>
  mount(WifiInfo, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getSaveButton = (wrapper: ReturnType<typeof mountWifiInfo>) =>
  wrapper.find('[data-testid="save-wifi"]');
const getResetButton = (wrapper: ReturnType<typeof mountWifiInfo>) =>
  wrapper.find('[data-testid="reset-wifi"]');

const selectWifi = async (wrapper: ReturnType<typeof mountWifiInfo>, label: string) => {
  await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
  await flushPromises();

  const option = wrapper.findAll('[role="option"]').find((node) => node.text().includes(label));
  expect(option).toBeDefined();

  await option!.trigger('mousedown');
  await flushPromises();
};

describe('WifiInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetNormalisedWifiInfo.mockResolvedValue({
      ssid: 'CurrentNetwork',
      key_mgmt: 'WPA2',
      isHidden: false,
    });
    mockGetNormalisedNetworks.mockResolvedValue(NETWORKS);
    vi.mocked(wifiService.setWifi).mockResolvedValue({
      ssid: 'SecuredNetwork',
      key_mgmt: 'WPA2',
      isHidden: false,
    });
    vi.mocked(wifiService.resetWifi).mockResolvedValue(undefined);
    resetToastMocks();
  });

  it('selects a different secured network, enters a valid password, and saves successfully', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'SecuredNetwork');

    await wrapper.getComponent(PasswordField).get('input').setValue('validpassword123');

    await getSaveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith('SecuredNetwork', 'WPA2', 'validpassword123');
    expectSuccessToastFired();
  });

  it('shows an error toast when saving the wifi config fails', async () => {
    vi.mocked(wifiService.setWifi).mockRejectedValue(new Error('Network error'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'SecuredNetwork');
    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('SecuredNetwork');

    await wrapper.getComponent(PasswordField).get('input').setValue('validpassword123');

    await getSaveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('CurrentNetwork');
    expect(mockToastError).toHaveBeenCalledOnce();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('hides the password field and enables the save button when a network with key_mgmt "none" is selected', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'OpenNetwork');

    expect(wrapper.findComponent(PasswordField).exists()).toBe(false);
    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });

  it('saves a hidden network after entering a network name and password', async () => {
    vi.mocked(wifiService.setWifi).mockResolvedValue({
      ssid: 'Hidden Wi-Fi',
      key_mgmt: 'WPA2',
      isHidden: true,
    });
    const networkName = 'My Hidden Network';
    const password = 'supersecretpw123';

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'Hidden Wi-Fi');

    const nameInput = wrapper.find('[data-testid="hidden-network-name"]');
    expect(nameInput.exists()).toBe(true);
    await nameInput.setValue(networkName);

    await wrapper.getComponent(PasswordField).get('input').setValue(password);

    await getSaveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith(networkName, 'WPA2', password);
    expectSuccessToastFired();
  });

  it('keeps the save button disabled for invalid secured-network passwords', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'SecuredNetwork');

    await wrapper.getComponent(PasswordField).get('input').setValue('1234567');
    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);

    await wrapper.getComponent(PasswordField).get('input').setValue('12345678');
    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);

    await wrapper
      .getComponent(PasswordField)
      .get('input')
      .setValue('1234567890123456789012345678901234567890123456789012345678901234');
    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows a load error when fetching the current wifi config fails', async () => {
    mockGetNormalisedWifiInfo.mockRejectedValue(new Error('load failed'));
    allowConsoleErrors();

    mountWifiInfo();
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Wi-Fi'));
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('shows an error toast when scanning wifi networks fails', async () => {
    mockGetNormalisedNetworks.mockRejectedValue(new Error('scan failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
    await flushPromises();

    // todo: replace with translation after PR 28271
    expect(mockToastError).toHaveBeenCalledExactlyOnceWith('Failed to load options');
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('shows a success toast when resetting the wifi config succeeds', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.resetWifi).toHaveBeenCalledOnce();
    expectSuccessToastFired();
  });

  it('shows an error toast when resetting the wifi config fails', async () => {
    vi.mocked(wifiService.resetWifi).mockRejectedValue(new Error('Reset failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.resetWifi).toHaveBeenCalledOnce();
    expect(mockToastError).toHaveBeenCalledOnce();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('disables the save button while saving wifi settings', async () => {
    const pending = deferred<WifiConfig>();
    vi.mocked(wifiService.setWifi).mockReturnValue(pending.promise);

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'SecuredNetwork');
    await wrapper.getComponent(PasswordField).get('input').setValue('validpassword123');
    await getSaveButton(wrapper).trigger('click');

    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve({ ssid: 'SecuredNetwork', key_mgmt: 'WPA2', isHidden: false });
    await flushPromises();

    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });
});
