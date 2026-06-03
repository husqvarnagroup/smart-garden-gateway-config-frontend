import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { mockToastError, mockToastSuccess, resetToastMocks } from './helpers/mockUseToast';
import WifiInfo from '@/components/WifiInfo.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PasswordField from '@/components/PasswordField.vue';
import StyledButton from '@/components/StyledButton.vue';
import i18next from '@/i18n';
import * as wifiService from '@/services/wifi';
import type { WifiConfig, WifiNetwork } from '@/services/wifi';

const { mockGetNormalisedWifiInfo, mockGetNormalisedNetworks } = vi.hoisted(() => ({
  mockGetNormalisedWifiInfo: vi.fn<() => Promise<WifiConfig>>(),
  mockGetNormalisedNetworks: vi.fn<() => Promise<WifiNetwork[]>>(),
}));

vi.mock('@/composables/useWifiInfo', () => ({
  useWifiInfo: () => ({
    getNormalisedWifiInfo: mockGetNormalisedWifiInfo,
    getNormalisedNetworks: mockGetNormalisedNetworks,
  }),
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

    // Open the dropdown to trigger the wifi scan
    await wrapper.findComponent(DropdownSelect).find('button').trigger('click');
    await flushPromises();

    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'SecuredNetwork');
    await flushPromises();

    await wrapper.findComponent(PasswordField).find('input').setValue('validpassword123');

    await wrapper.findComponent(StyledButton).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith('SecuredNetwork', 'WPA2', 'validpassword123');
    expect(mockToastSuccess).toHaveBeenCalledOnce();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows an error toast when saving the wifi config fails', async () => {
    vi.mocked(wifiService.setWifi).mockRejectedValue(new Error('Network error'));

    const wrapper = mountWifiInfo();
    await flushPromises();

    // Open the dropdown to trigger the wifi scan, populating scannedNetworks
    await wrapper.findComponent(DropdownSelect).find('button').trigger('click');
    await flushPromises();

    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'SecuredNetwork');
    await flushPromises();

    await wrapper.findComponent(PasswordField).find('input').setValue('validpassword123');

    await wrapper.findComponent(StyledButton).trigger('click');
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledOnce();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('hides the password field and enables the save button when a network with key_mgmt "none" is selected', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    // Open the dropdown to trigger the wifi scan, populating scannedNetworks
    await wrapper.findComponent(DropdownSelect).find('button').trigger('click');
    await flushPromises();

    // OpenNetwork has security: '' which maps to key_mgmt: 'none'
    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'OpenNetwork');
    await flushPromises();

    expect(wrapper.findComponent(PasswordField).exists()).toBe(false);
    expect(wrapper.findComponent(StyledButton).props('disabled')).toBe(false);
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

    // Open the dropdown to trigger the wifi scan, populating scannedNetworks
    await wrapper.findComponent(DropdownSelect).find('button').trigger('click');
    await flushPromises();

    // Select the hidden network (displayed as 'Hidden Wi-Fi')
    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'Hidden Wi-Fi');
    await flushPromises();

    // Network name field should be visible for hidden networks
    const nameInput = wrapper.find('.field input[type="text"]');
    expect(nameInput.exists()).toBe(true);
    await nameInput.setValue(networkName);

    // Enter a valid password (hidden network has security: 'WPA2')
    await wrapper.findComponent(PasswordField).find('input').setValue(password);

    await wrapper.findComponent(StyledButton).trigger('click');
    await flushPromises();

    expect(wifiService.setWifi).toHaveBeenCalledWith(networkName, 'WPA2', password);
    expect(mockToastSuccess).toHaveBeenCalledOnce();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows a success toast when resetting the wifi config succeeds', async () => {
    const wrapper = mountWifiInfo();
    await flushPromises();

    const resetButton = wrapper.findAllComponents(StyledButton)[1];
    await resetButton?.trigger('click');
    await flushPromises();

    expect(wifiService.resetWifi).toHaveBeenCalledOnce();
    expect(mockToastSuccess).toHaveBeenCalledOnce();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows an error toast when resetting the wifi config fails', async () => {
    vi.mocked(wifiService.resetWifi).mockRejectedValue(new Error('Reset failed'));

    const wrapper = mountWifiInfo();
    await flushPromises();

    const resetButton = wrapper.findAllComponents(StyledButton)[1];
    await resetButton?.trigger('click');
    await flushPromises();

    expect(wifiService.resetWifi).toHaveBeenCalledOnce();
    expect(mockToastError).toHaveBeenCalledOnce();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });
});
