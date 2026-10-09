// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { resetToastMocks } from './helpers/mockUseToast';
import PrivacyConsent from '@/components/PrivacyConsent.vue';
import TelemetryToggle from '@/components/TelemetryToggle.vue';
import SupportBundleToggle from '@/components/SupportBundleToggle.vue';
import i18next from '@/i18n';
import * as telemetryService from '@/services/telemetry';
import * as supportBundleService from '@/services/supportBundle';

vi.mock('@/services/telemetry', () => ({
  getTelemetryConsent: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setTelemetryConsent: vi.fn<(enable: boolean) => Promise<void>>(),
}));

vi.mock('@/services/supportBundle', () => ({
  getSupportBundleConsent: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setSupportBundleConsent: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountPrivacyConsent = () =>
  mount(PrivacyConsent, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

describe('PrivacyConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(telemetryService.getTelemetryConsent).mockResolvedValue({ enabled: false });
    vi.mocked(supportBundleService.getSupportBundleConsent).mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('renders the telemetry and support-bundle consent toggles together in one card', async () => {
    const wrapper = mountPrivacyConsent();
    await flushPromises();

    expect(wrapper.findComponent(TelemetryToggle).exists()).toBe(true);
    expect(wrapper.findComponent(SupportBundleToggle).exists()).toBe(true);
    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual([
      i18next.t('telemetry.label'),
      i18next.t('supportBundle.label'),
    ]);
    expect(wrapper.findAll('.description').map((p) => p.text())).toEqual([
      i18next.t('telemetry.description'),
      i18next.t('supportBundle.description'),
    ]);
  });

  it('wires each toggle to its own service', async () => {
    const wrapper = mountPrivacyConsent();
    await flushPromises();

    for (const toggle of wrapper.findAll('[role="switch"]')) {
      await toggle.trigger('click');
    }
    await flushPromises();

    expect(telemetryService.setTelemetryConsent).toHaveBeenCalledWith(true);
    expect(supportBundleService.setSupportBundleConsent).toHaveBeenCalledWith(true);
  });
});
