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
import CloudConnectionToggle from '@/components/CloudConnectionToggle.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import i18next from '@/i18n';
import * as cloudConnectionService from '@/services/cloudConnection';

vi.mock('@/services/cloudConnection', () => ({
  getCloudConnectionEnabled: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setCloudConnectionEnabled: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountCloudConnectionToggle = () =>
  mount(CloudConnectionToggle, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountCloudConnectionToggle>) =>
  wrapper.get('[role="switch"]');

describe('CloudConnectionToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockResolvedValue({
      enabled: false,
    });
    resetToastMocks();
  });

  it('clicking the toggle enables cloud connection and shows success toast', async () => {
    vi.mocked(cloudConnectionService.setCloudConnectionEnabled).mockResolvedValue(undefined);
    const wrapper = mountCloudConnectionToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(cloudConnectionService.setCloudConnectionEnabled).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast when enabling cloud connection fails', async () => {
    vi.mocked(cloudConnectionService.setCloudConnectionEnabled).mockRejectedValue(
      new Error('Failed'),
    );
    allowConsoleErrors();
    const wrapper = mountCloudConnectionToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('clicking the toggle disables cloud connection and shows success toast', async () => {
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockResolvedValue({
      enabled: true,
    });
    vi.mocked(cloudConnectionService.setCloudConnectionEnabled).mockResolvedValue(undefined);
    const wrapper = mountCloudConnectionToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(cloudConnectionService.setCloudConnectionEnabled).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling cloud connection fails', async () => {
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockResolvedValue({
      enabled: true,
    });
    vi.mocked(cloudConnectionService.setCloudConnectionEnabled).mockRejectedValue(
      new Error('Failed'),
    );
    allowConsoleErrors();
    const wrapper = mountCloudConnectionToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('shows a skeleton while the initial state is being loaded', async () => {
    const pending = deferred<{ enabled: boolean }>();
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockReturnValue(pending.promise);
    const wrapper = mountCloudConnectionToggle();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(false);

    pending.resolve({ enabled: false });
    await flushPromises();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(false);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
  });

  it('shows an error toast when loading the initial state fails', async () => {
    vi.mocked(cloudConnectionService.getCloudConnectionEnabled).mockRejectedValue(
      new Error('Failed'),
    );
    mountCloudConnectionToggle();
    await flushPromises();

    expectErrorToastFired();
  });

  it('disables the toggle while updating cloud connection', async () => {
    const pending = deferred();
    vi.mocked(cloudConnectionService.setCloudConnectionEnabled).mockReturnValue(pending.promise);
    const wrapper = mountCloudConnectionToggle();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });
});
