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
import SettingToggle from '@/components/SettingToggle.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import i18next from '@/i18n';

const load = vi.fn<() => Promise<{ enabled: boolean }>>();
const save = vi.fn<(enabled: boolean) => Promise<void>>();

const mountSettingToggle = () =>
  mount(SettingToggle, {
    props: { label: 'Some Setting', description: 'What the setting does.', load, save },
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountSettingToggle>) =>
  wrapper.get('[role="switch"]');

describe('SettingToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    load.mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('shows the label and description', async () => {
    const wrapper = mountSettingToggle();
    await flushPromises();

    expect(wrapper.get('h3').text()).toBe('Some Setting');
    expect(wrapper.get('.description').text()).toBe('What the setting does.');
  });

  it('clicking the toggle enables the setting and shows success toast', async () => {
    save.mockResolvedValue(undefined);
    const wrapper = mountSettingToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(save).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast and rolls back when enabling fails', async () => {
    save.mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSettingToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
    expect(getToggle(wrapper).attributes('aria-checked')).toBe('false');
  });

  it('clicking the toggle disables the setting and shows success toast', async () => {
    load.mockResolvedValue({ enabled: true });
    save.mockResolvedValue(undefined);
    const wrapper = mountSettingToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(save).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling fails', async () => {
    load.mockResolvedValue({ enabled: true });
    save.mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSettingToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('shows a skeleton while the initial state is being loaded', async () => {
    const pending = deferred<{ enabled: boolean }>();
    load.mockReturnValue(pending.promise);
    const wrapper = mountSettingToggle();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(false);

    pending.resolve({ enabled: false });
    await flushPromises();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(false);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
  });

  it('shows an error toast when loading the initial state fails', async () => {
    load.mockRejectedValue(new Error('Failed'));
    mountSettingToggle();
    await flushPromises();

    expectErrorToastFired();
  });

  it('disables the toggle while saving', async () => {
    const pending = deferred();
    save.mockReturnValue(pending.promise);
    const wrapper = mountSettingToggle();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });
});
