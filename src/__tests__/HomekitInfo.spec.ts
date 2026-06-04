import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors } from './setup';
import { resetToastMocks } from './helpers/mockUseToast';
import { expectErrorToastFired, expectSuccessToastFired } from './helpers/assertErrorToast';
import { deferred } from './helpers/asyncControl';
import HomekitInfo from '@/components/HomekitInfo.vue';
import StyledButton from '@/components/StyledButton.vue';
import i18next from '@/i18n';
import * as systemService from '@/services/system';

vi.mock('@/services/system', () => ({
  resetHomekit: vi.fn<() => Promise<void>>(),
}));

const mountHomekitInfo = () =>
  mount(HomekitInfo, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

describe('HomekitInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetToastMocks();
  });

  it('click Reset calls resetHomekit and shows success toast', async () => {
    vi.mocked(systemService.resetHomekit).mockResolvedValue(undefined);
    const wrapper = mountHomekitInfo();

    await wrapper.findComponent(StyledButton).get('button').trigger('click');
    await flushPromises();

    expect(systemService.resetHomekit).toHaveBeenCalledOnce();
    expectSuccessToastFired();
  });

  it('click Reset shows error toast when resetHomekit rejects', async () => {
    vi.mocked(systemService.resetHomekit).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountHomekitInfo();

    await wrapper.getComponent(StyledButton).get('button').trigger('click');
    await flushPromises();

    expectErrorToastFired({ withConsoleError: true });
  });

  it('button is disabled while resetting', async () => {
    const pending = deferred();
    vi.mocked(systemService.resetHomekit).mockReturnValue(pending.promise);
    const wrapper = mountHomekitInfo();

    await wrapper.getComponent(StyledButton).get('button').trigger('click');
    expect(
      (wrapper.getComponent(StyledButton).get('button').element as HTMLButtonElement).disabled,
    ).toBe(true);

    pending.resolve();
    await flushPromises();
    expect(
      (wrapper.getComponent(StyledButton).get('button').element as HTMLButtonElement).disabled,
    ).toBe(false);
  });
});
