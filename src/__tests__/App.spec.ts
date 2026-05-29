import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import I18NextVue from 'i18next-vue';
import App from '../App.vue';
import router from '../router';
import i18next from '../i18n';

vi.mock('@/services/system', () => ({
  getGatewayVersion: vi.fn<() => Promise<{ gateway_version: string }>>().mockResolvedValue({
    gateway_version: '0.0.0',
  }),
  getHomekitStatus: vi
    .fn<() => Promise<{ active: boolean }>>()
    .mockResolvedValue({ active: false }),
  resetHomekit: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
}));

describe('App', () => {
  it('redirects unauthenticated users to login', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, [I18NextVue, { i18next }]],
      },
    });

    await nextTick();

    expect(wrapper.text()).toContain('Log in');
  });
});
