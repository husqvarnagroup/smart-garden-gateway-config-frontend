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
import TelemetryToggle from '@/components/TelemetryToggle.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import i18next from '@/i18n';
import * as telemetryService from '@/services/telemetry';

vi.mock('@/services/telemetry', () => ({
  getTelemetryConsent: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setTelemetryConsent: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountTelemetryToggle = () =>
  mount(TelemetryToggle, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountTelemetryToggle>) =>
  wrapper.get('[role="switch"]');

describe('TelemetryToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(telemetryService.getTelemetryConsent).mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('shows the title and description', async () => {
    const wrapper = mountTelemetryToggle();
    await flushPromises();

    expect(wrapper.get('h3').text()).toBe(i18next.t('telemetry.label'));
    expect(wrapper.get('.description').text()).toBe(i18next.t('telemetry.description'));
  });

  it('clicking the toggle enables telemetry consent and shows success toast', async () => {
    vi.mocked(telemetryService.setTelemetryConsent).mockResolvedValue(undefined);
    const wrapper = mountTelemetryToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(telemetryService.setTelemetryConsent).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast when enabling telemetry consent fails', async () => {
    vi.mocked(telemetryService.setTelemetryConsent).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountTelemetryToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('clicking the toggle disables telemetry consent and shows success toast', async () => {
    vi.mocked(telemetryService.getTelemetryConsent).mockResolvedValue({ enabled: true });
    vi.mocked(telemetryService.setTelemetryConsent).mockResolvedValue(undefined);
    const wrapper = mountTelemetryToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(telemetryService.setTelemetryConsent).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling telemetry consent fails', async () => {
    vi.mocked(telemetryService.getTelemetryConsent).mockResolvedValue({ enabled: true });
    vi.mocked(telemetryService.setTelemetryConsent).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountTelemetryToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('shows a skeleton while the initial state is being loaded', async () => {
    const pending = deferred<{ enabled: boolean }>();
    vi.mocked(telemetryService.getTelemetryConsent).mockReturnValue(pending.promise);
    const wrapper = mountTelemetryToggle();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(false);

    pending.resolve({ enabled: false });
    await flushPromises();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(false);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
  });

  it('shows an error toast when loading the initial state fails', async () => {
    vi.mocked(telemetryService.getTelemetryConsent).mockRejectedValue(new Error('Failed'));
    mountTelemetryToggle();
    await flushPromises();

    expectErrorToastFired();
  });

  it('disables the toggle while updating telemetry consent', async () => {
    const pending = deferred();
    vi.mocked(telemetryService.setTelemetryConsent).mockReturnValue(pending.promise);
    const wrapper = mountTelemetryToggle();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });
});
