import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { mockToastError, resetToastMocks } from './helpers/mockUseToast';
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

describe('TimezoneInfo', () => {
  beforeEach(() => {
    vi.mocked(timezoneService.getCurrentTimezone).mockResolvedValue({ timezone: 'UTC' });
    vi.mocked(timezoneService.listTimezones).mockResolvedValue([]);
    resetToastMocks();
  });

  it('saves the selected timezone when the save button is clicked', async () => {
    vi.mocked(timezoneService.setTimezone).mockResolvedValue({ timezone: 'Europe/Berlin' });

    const wrapper = mountTimezoneInfo();
    await flushPromises();

    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'Europe/Berlin');
    await wrapper.findComponent(StyledButton).trigger('click');
    await flushPromises();

    expect(timezoneService.setTimezone).toHaveBeenCalledWith('Europe/Berlin');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('shows an error message when saving the timezone fails', async () => {
    vi.mocked(timezoneService.setTimezone).mockRejectedValue(new Error('Network error'));

    const wrapper = mountTimezoneInfo();
    await flushPromises();

    wrapper.findComponent(DropdownSelect).vm.$emit('change', 'Europe/Berlin');
    await wrapper.findComponent(StyledButton).trigger('click');
    await flushPromises();

    expect(mockToastError).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('Timezone'));
  });
});
