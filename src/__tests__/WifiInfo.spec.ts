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
import WifiInfo from '@/components/WifiInfo/WifiInfo.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PasswordField from '@/components/PasswordField.vue';
import i18next from '@/i18n';
import * as wifiService from '@/services/wifi';
import type { WifiConfig, WifiNetwork } from '@/services/wifi';

const { mockGetNormalisedWifiInfo, mockGetNormalisedNetworks } = vi.hoisted(() => ({
  mockGetNormalisedWifiInfo: vi.fn<() => Promise<WifiConfig | undefined>>(),
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
  { ssid: 'SecuredNetwork', signal: 80, security: 'WPA-PSK', isHidden: false },
  { ssid: 'OpenNetwork', signal: 60, security: '', isHidden: false },
  { ssid: '', signal: 50, security: 'WPA-PSK', isHidden: true },
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
      key_mgmt: 'WPA-PSK',
      isHidden: false,
    });
    mockGetNormalisedNetworks.mockResolvedValue(NETWORKS);
    vi.mocked(wifiService.setWifi).mockResolvedValue({
      ssid: 'SecuredNetwork',
      key_mgmt: 'WPA-PSK',
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

    expect(wifiService.setWifi).toHaveBeenCalledWith(
      'SecuredNetwork',
      'WPA-PSK',
      'validpassword123',
    );
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

  it('saves a manually entered network after selecting the other-network option', async () => {
    vi.mocked(wifiService.setWifi).mockResolvedValue({
      ssid: 'My Hidden Network',
      key_mgmt: 'WPA-PSK',
      isHidden: true,
    });
    const networkName = 'My Hidden Network';
    const password = 'supersecretpw123';

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, i18next.t('network.other.label'));

    const nameInput = wrapper.find('[data-testid="hidden-network-name"]');
    expect(nameInput.exists()).toBe(true);
    await nameInput.setValue(networkName);

    await wrapper.getComponent(PasswordField).get('input').setValue(password);

    await getSaveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith(networkName, 'WPA-PSK', password);
    expectSuccessToastFired();
  });

  it('defaults manual security to backend-supported WPA-PSK for secured hidden networks', async () => {
    mockGetNormalisedNetworks.mockResolvedValue([
      { ssid: 'SecuredNetwork', signal: 80, security: 'WPA-PSK', isHidden: false },
      { ssid: '', signal: 50, security: 'WPA-PSK', isHidden: true },
      { ssid: '', signal: 45, security: 'WPA-PSK', isHidden: true },
      { ssid: '', signal: 40, security: 'WPA-PSK', isHidden: true },
    ]);

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, i18next.t('network.other.label'));
    await wrapper.find('[data-testid="hidden-network-name"]').setValue('ManualNetwork');
    await wrapper.getComponent(PasswordField).get('input').setValue('validpassword123');
    await getSaveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith(
      'ManualNetwork',
      'WPA-PSK',
      'validpassword123',
    );
  });

  it('shows the other-network option exactly once even with multiple hidden scan entries', async () => {
    mockGetNormalisedNetworks.mockResolvedValue([
      { ssid: 'SecuredNetwork', signal: 80, security: 'WPA-PSK', isHidden: false },
      { ssid: 'OpenNetwork', signal: 60, security: 'none', isHidden: false },
      { ssid: '', signal: 50, security: 'WPA-PSK', isHidden: true },
      { ssid: '', signal: 45, security: 'WPA-PSK', isHidden: true },
    ]);

    const wrapper = mountWifiInfo();
    await flushPromises();

    await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
    await flushPromises();

    const options = wrapper.findAll('[role="option"]');
    const otherLabel = i18next.t('network.other.label');
    const otherOptions = options.filter((option) => option.text().trim() === otherLabel);

    expect(otherOptions).toHaveLength(1);
    expect(options).toHaveLength(3);
  });

  it('appends hidden discovered securities once after base manual options and filters unsupported', async () => {
    mockGetNormalisedNetworks.mockResolvedValue([
      { ssid: 'SecuredNetwork', signal: 80, security: 'WPA-PSK', isHidden: false },
      { ssid: '', signal: 50, security: 'WPA3', isHidden: true },
      { ssid: '', signal: 45, security: 'WPA3', isHidden: true },
      { ssid: '', signal: 40, security: 'unsupported', isHidden: true },
    ]);

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, i18next.t('network.other.label'));

    const securitySelect = wrapper.findAllComponents(DropdownSelect)[1];
    expect(securitySelect).toBeDefined();

    const securityOptions = securitySelect!.props('options') as string[];
    expect(securityOptions).toEqual(['WPA-PSK', 'none', 'WPA3']);
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

  it('renders without a load error when there is no current wifi config', async () => {
    mockGetNormalisedWifiInfo.mockResolvedValue(undefined);

    const wrapper = mountWifiInfo();
    await flushPromises();

    expect(wrapper.text()).toContain(i18next.t('network.label'));
    expect(wrapper.get('[data-testid="wifi-lan-info"]').text()).toBe(i18next.t('network.noWifi'));
    expect(mockToastError).not.toHaveBeenCalled();
    expect(getSaveButton(wrapper).exists()).toBe(false);
  });

  it('keeps the wifi selector usable when the gateway is connected via LAN', async () => {
    mockGetNormalisedWifiInfo.mockResolvedValue(undefined);

    const wrapper = mountWifiInfo();
    await flushPromises();

    await selectWifi(wrapper, 'SecuredNetwork');

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('SecuredNetwork');
    expect(wrapper.text()).not.toContain(i18next.t('network.noWifi'));
  });

  it('shows an error toast when scanning wifi networks fails', async () => {
    mockGetNormalisedNetworks.mockRejectedValue(new Error('scan failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledExactlyOnceWith(
      i18next.t('error.load', { feature: i18next.t('network.label') }),
    );
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('still shows the other-network option when scanning wifi networks fails', async () => {
    mockGetNormalisedNetworks.mockRejectedValue(new Error('scan failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
    await flushPromises();

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0]!.text().trim()).toBe(i18next.t('network.other.label'));
  });

  it('retries wifi scan when reopening the dropdown after a previous scan failure', async () => {
    mockGetNormalisedNetworks.mockRejectedValue(new Error('scan failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    const selectTrigger = wrapper.getComponent(DropdownSelect).get('button');

    await selectTrigger.trigger('click');
    await flushPromises();
    expect(mockGetNormalisedNetworks).toHaveBeenCalledTimes(1);

    await selectTrigger.trigger('click');
    await flushPromises();

    await selectTrigger.trigger('click');
    await flushPromises();
    expect(mockGetNormalisedNetworks).toHaveBeenCalledTimes(2);
  });

  it('shows a success toast when resetting the wifi config succeeds', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(wifiService.resetWifi).toHaveBeenCalledOnce();
    expectSuccessToastFired();
  });

  it('resets the dropdown to empty on a successful wifi reset', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('CurrentNetwork');

    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('');
  });

  it('keeps the dropdown value when resetting the wifi config fails', async () => {
    vi.mocked(wifiService.resetWifi).mockRejectedValue(new Error('Reset failed'));
    allowConsoleErrors();

    const wrapper = mountWifiInfo();
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('CurrentNetwork');

    await getResetButton(wrapper).trigger('click');
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('CurrentNetwork');
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

    pending.resolve({ ssid: 'SecuredNetwork', key_mgmt: 'WPA-PSK', isHidden: false });
    await flushPromises();

    expect((getSaveButton(wrapper).element as HTMLButtonElement).disabled).toBe(false);
  });
});
