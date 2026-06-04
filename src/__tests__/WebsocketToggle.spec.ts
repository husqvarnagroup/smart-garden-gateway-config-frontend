import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors } from './setup';
import { resetToastMocks } from './helpers/mockUseToast';
import { expectErrorToastFired, expectSuccessToastFired } from './helpers/assertErrorToast';
import { deferred } from './helpers/asyncControl';
import WebsocketToggle from '@/components/WebsocketToggle.vue';
import i18next from '@/i18n';
import * as websocketService from '@/services/websocket';

vi.mock('@/services/websocket', () => ({
  getWebsocketEnabled: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setWebsocketEnabled: vi.fn<(enable: boolean) => Promise<void>>(),
}));

const mountWebsocketToggle = () =>
  mount(WebsocketToggle, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountWebsocketToggle>) =>
  wrapper.get('[role="switch"]');

describe('WebsocketToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(websocketService.getWebsocketEnabled).mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('clicking the toggle enables websocket support and shows success toast', async () => {
    vi.mocked(websocketService.setWebsocketEnabled).mockResolvedValue(undefined);
    const wrapper = mountWebsocketToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(websocketService.setWebsocketEnabled).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast when enabling websocket support fails', async () => {
    vi.mocked(websocketService.setWebsocketEnabled).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountWebsocketToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('clicking the toggle disables websocket support and shows success toast', async () => {
    vi.mocked(websocketService.getWebsocketEnabled).mockResolvedValue({ enabled: true });
    vi.mocked(websocketService.setWebsocketEnabled).mockResolvedValue(undefined);
    const wrapper = mountWebsocketToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(websocketService.setWebsocketEnabled).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling websocket support fails', async () => {
    vi.mocked(websocketService.getWebsocketEnabled).mockResolvedValue({ enabled: true });
    vi.mocked(websocketService.setWebsocketEnabled).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountWebsocketToggle();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('disables the toggle while updating websocket support', async () => {
    const pending = deferred();
    vi.mocked(websocketService.setWebsocketEnabled).mockReturnValue(pending.promise);
    const wrapper = mountWebsocketToggle();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });
});
