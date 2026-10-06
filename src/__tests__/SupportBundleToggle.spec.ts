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
import SupportBundleToggle from '@/components/SupportBundleToggle.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import i18next from '@/i18n';
import * as supportBundleService from '@/services/supportBundle';

vi.mock('@/services/supportBundle', () => ({
  getSupportBundleConsent: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setSupportBundleConsent: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountSupportBundleToggle = () =>
  mount(SupportBundleToggle, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountSupportBundleToggle>) =>
  wrapper.get('[role="switch"]');

describe('SupportBundleToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supportBundleService.getSupportBundleConsent).mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('clicking the toggle enables support-bundle consent and shows success toast', async () => {
    vi.mocked(supportBundleService.setSupportBundleConsent).mockResolvedValue(undefined);
    const wrapper = mountSupportBundleToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(supportBundleService.setSupportBundleConsent).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast when enabling support-bundle consent fails', async () => {
    vi.mocked(supportBundleService.setSupportBundleConsent).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSupportBundleToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('clicking the toggle disables support-bundle consent and shows success toast', async () => {
    vi.mocked(supportBundleService.getSupportBundleConsent).mockResolvedValue({ enabled: true });
    vi.mocked(supportBundleService.setSupportBundleConsent).mockResolvedValue(undefined);
    const wrapper = mountSupportBundleToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(supportBundleService.setSupportBundleConsent).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling support-bundle consent fails', async () => {
    vi.mocked(supportBundleService.getSupportBundleConsent).mockResolvedValue({ enabled: true });
    vi.mocked(supportBundleService.setSupportBundleConsent).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSupportBundleToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('shows a skeleton while the initial state is being loaded', async () => {
    const pending = deferred<{ enabled: boolean }>();
    vi.mocked(supportBundleService.getSupportBundleConsent).mockReturnValue(pending.promise);
    const wrapper = mountSupportBundleToggle();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(false);

    pending.resolve({ enabled: false });
    await flushPromises();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(false);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
  });

  it('shows an error toast when loading the initial state fails', async () => {
    vi.mocked(supportBundleService.getSupportBundleConsent).mockRejectedValue(new Error('Failed'));
    mountSupportBundleToggle();
    await flushPromises();

    expectErrorToastFired();
  });

  it('disables the toggle while updating support-bundle consent', async () => {
    const pending = deferred();
    vi.mocked(supportBundleService.setSupportBundleConsent).mockReturnValue(pending.promise);
    const wrapper = mountSupportBundleToggle();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });
});
