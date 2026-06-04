// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors, getConsoleErrorSpy } from './setup';
import { mockToastError, resetToastMocks } from './helpers/mockUseToast';
import { expectSuccessToastFired } from './helpers/assertErrorToast';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import StyledButton from '@/components/StyledButton.vue';
import i18next from '@/i18n';
import * as timezoneService from '@/services/timezone';
import type { TimezoneConfig } from '@/services/timezone';

vi.mock('@/services/timezone', () => ({
  getCurrentTimezone: vi.fn<() => Promise<TimezoneConfig>>(),
  listTimezones: vi.fn<() => Promise<string[]>>(),
  setTimezone: vi.fn<(timezone: string) => Promise<TimezoneConfig>>(),
}));

const mountTimezoneInfo = () =>
  mount(TimezoneInfo, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const selectOption = async (wrapper: ReturnType<typeof mountTimezoneInfo>, label: string) => {
  await wrapper.getComponent(DropdownSelect).get('button').trigger('click');
  await flushPromises();

  const option = wrapper.findAll('[role="option"]').find((node) => node.text().includes(label));
  expect(option).toBeDefined();

  await option!.trigger('mousedown');
  await flushPromises();
};

describe('TimezoneInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(timezoneService.getCurrentTimezone).mockResolvedValue({ timezone: 'UTC' });
    vi.mocked(timezoneService.listTimezones).mockResolvedValue(['UTC', 'Europe/Berlin']);
    vi.mocked(timezoneService.setTimezone).mockResolvedValue({ timezone: 'Europe/Berlin' });
    resetToastMocks();
  });

  it('saves the selected timezone when the save button is clicked', async () => {
    const wrapper = mountTimezoneInfo();
    await flushPromises();

    await selectOption(wrapper, 'Europe/Berlin');
    await wrapper.getComponent(StyledButton).get('button').trigger('click');
    await flushPromises();

    expect(timezoneService.setTimezone).toHaveBeenCalledWith('Europe/Berlin');
    expectSuccessToastFired();
  });

  it('rolls back the selected timezone when saving fails', async () => {
    vi.mocked(timezoneService.setTimezone).mockRejectedValue(new Error('Network error'));
    allowConsoleErrors();

    const wrapper = mountTimezoneInfo();
    await flushPromises();

    await selectOption(wrapper, 'Europe/Berlin');
    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('Europe/Berlin');

    await wrapper.getComponent(StyledButton).get('button').trigger('click');
    await flushPromises();

    expect(wrapper.getComponent(DropdownSelect).props('modelValue')).toBe('UTC');
    expect(mockToastError).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Timezone'));
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });

  it('shows a load error when the current timezone request fails', async () => {
    vi.mocked(timezoneService.getCurrentTimezone).mockRejectedValue(new Error('load failed'));
    allowConsoleErrors();

    mountTimezoneInfo();
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Timezone'));
    expect(getConsoleErrorSpy()).toHaveBeenCalledOnce();
  });
});
