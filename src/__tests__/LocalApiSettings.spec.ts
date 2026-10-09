// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { resetToastMocks } from './helpers/mockUseToast';
import LocalApiSettings from '@/components/LocalApiSettings.vue';
import WebsocketToggle from '@/components/WebsocketToggle.vue';
import CloudConnectionToggle from '@/components/CloudConnectionToggle.vue';
import i18next from '@/i18n';
import * as websocketService from '@/services/websocket';
import * as cloudConnectionService from '@/services/cloudConnection';

vi.mock('@/services/websocket', () => ({
  getWebsocketEnabled: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setWebsocketEnabled: vi.fn<(enable: boolean) => Promise<void>>(),
}));

vi.mock('@/services/cloudConnection', () => ({
  getCloudConnectionEnabled: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setCloudConnectionEnabled: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountLocalApiSettings = () =>
  mount(LocalApiSettings, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

describe('LocalApiSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(websocketService.getWebsocketEnabled).mockResolvedValue({ enabled: false });
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockResolvedValue({
      enabled: false,
    });
    resetToastMocks();
  });

  it('renders the WebSocket and Cloud Connection toggles together in one card', async () => {
    const wrapper = mountLocalApiSettings();
    await flushPromises();

    expect(wrapper.findComponent(WebsocketToggle).exists()).toBe(true);
    expect(wrapper.findComponent(CloudConnectionToggle).exists()).toBe(true);
    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual([
      i18next.t('websocket.label'),
      i18next.t('cloudConnection.label'),
    ]);
    expect(wrapper.findAll('.description').map((p) => p.text())).toEqual([
      i18next.t('websocket.description'),
      i18next.t('cloudConnection.description'),
    ]);
  });

  it('wires each toggle to its own service', async () => {
    const wrapper = mountLocalApiSettings();
    await flushPromises();

    for (const toggle of wrapper.findAll('[role="switch"]')) {
      await toggle.trigger('click');
    }
    await flushPromises();

    expect(websocketService.setWebsocketEnabled).toHaveBeenCalledWith(true);
    expect(cloudConnectionService.setCloudConnectionEnabled).toHaveBeenCalledWith(true);
  });
});
