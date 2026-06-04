import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors } from './setup';
import { resetToastMocks } from './helpers/mockUseToast';
import { expectErrorToastFired, expectSuccessToastFired } from './helpers/assertErrorToast';
import { deferred } from './helpers/asyncControl';
import SshSettings from '@/components/SshSettings.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import i18next from '@/i18n';
import * as sshService from '@/services/ssh';

vi.mock('@/services/ssh', () => ({
  getSshEnabled: vi.fn<() => Promise<{ enabled: boolean }>>(),
  setSshEnabled: vi.fn<(enable: boolean) => Promise<void>>(),
  addSshKey: vi.fn<(key: string) => Promise<void>>(),
}));

const mountSshSettings = () =>
  mount(SshSettings, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });

const getToggle = (wrapper: ReturnType<typeof mountSshSettings>) => wrapper.get('[role="switch"]');

describe('SshSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sshService.getSshEnabled).mockResolvedValue({ enabled: false });
    resetToastMocks();
  });

  it('clicking the toggle enables SSH and shows success toast', async () => {
    vi.mocked(sshService.setSshEnabled).mockResolvedValue(undefined);
    const wrapper = mountSshSettings();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(sshService.setSshEnabled).toHaveBeenCalledWith(true);
    expectSuccessToastFired();
  });

  it('shows an error toast when enabling SSH fails', async () => {
    vi.mocked(sshService.setSshEnabled).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSshSettings();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('clicking the toggle disables SSH and shows success toast', async () => {
    vi.mocked(sshService.getSshEnabled).mockResolvedValue({ enabled: true });
    vi.mocked(sshService.setSshEnabled).mockResolvedValue(undefined);
    const wrapper = mountSshSettings();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expect(sshService.setSshEnabled).toHaveBeenCalledWith(false);
    expectSuccessToastFired();
  });

  it('shows an error toast when disabling SSH fails', async () => {
    vi.mocked(sshService.getSshEnabled).mockResolvedValue({ enabled: true });
    vi.mocked(sshService.setSshEnabled).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSshSettings();
    await flushPromises();

    await getToggle(wrapper).trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('shows a skeleton while the initial state is being loaded', async () => {
    const pending = deferred<{ enabled: boolean }>();
    vi.mocked(sshService.getSshEnabled).mockReturnValue(pending.promise);
    const wrapper = mountSshSettings();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(true);
    expect(wrapper.find('[role="switch"]').exists()).toBe(false);

    pending.resolve({ enabled: false });
    await flushPromises();

    expect(wrapper.findComponent(SkeletonBlock).exists()).toBe(false);
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
  });

  it('shows an error toast when loading the initial state fails', async () => {
    vi.mocked(sshService.getSshEnabled).mockRejectedValue(new Error('Failed'));
    mountSshSettings();
    await flushPromises();

    expectErrorToastFired();
  });

  it('add SSH key button is disabled when textarea is empty', () => {
    const wrapper = mountSshSettings();
    const addButton = wrapper.find('[data-testid="add-ssh-key"]');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('add SSH key button is disabled when textarea is whitespace-only', async () => {
    const wrapper = mountSshSettings();
    await wrapper.find('textarea').setValue('   ');
    const addButton = wrapper.find('[data-testid="add-ssh-key"]');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('add SSH key button is enabled when textarea has content', async () => {
    const wrapper = mountSshSettings();
    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    const addButton = wrapper.find('[data-testid="add-ssh-key"]');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(false);
  });

  it('submitting a key calls addSshKey, shows success toast, and clears textarea', async () => {
    vi.mocked(sshService.addSshKey).mockResolvedValue(undefined);
    const wrapper = mountSshSettings();

    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    await wrapper.find('[data-testid="add-ssh-key"]').trigger('click');
    await flushPromises();

    expect(sshService.addSshKey).toHaveBeenCalledWith('ssh-rsa AAAA...');
    expectSuccessToastFired();
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('');
  });

  it('submitting a key shows error toast when addSshKey rejects', async () => {
    vi.mocked(sshService.addSshKey).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSshSettings();

    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    await wrapper.find('[data-testid="add-ssh-key"]').trigger('click');
    await flushPromises();

    expectErrorToastFired();
  });

  it('keeps the textarea content when addSshKey rejects', async () => {
    vi.mocked(sshService.addSshKey).mockRejectedValue(new Error('Failed'));
    allowConsoleErrors();
    const wrapper = mountSshSettings();

    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    await wrapper.find('[data-testid="add-ssh-key"]').trigger('click');
    await flushPromises();

    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('ssh-rsa AAAA...');
  });

  it('disables SSH toggle buttons while updating access', async () => {
    const pending = deferred();
    vi.mocked(sshService.setSshEnabled).mockReturnValue(pending.promise);
    const wrapper = mountSshSettings();
    await flushPromises();
    const toggle = getToggle(wrapper);

    await toggle.trigger('click');

    expect((toggle.element as HTMLButtonElement).disabled).toBe(true);

    pending.resolve();
    await flushPromises();

    expect((toggle.element as HTMLButtonElement).disabled).toBe(false);
  });

  it('shows loading state on the add-key button while the key is being saved', async () => {
    const pending = deferred();
    vi.mocked(sshService.addSshKey).mockReturnValue(pending.promise);
    const wrapper = mountSshSettings();

    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    await wrapper.find('[data-testid="add-ssh-key"]').trigger('click');

    const addButton = wrapper.find('[data-testid="add-ssh-key"]');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(true);
    expect(addButton.attributes('aria-busy')).toBe('true');

    pending.resolve();
    await flushPromises();

    expect(addButton.attributes('aria-busy')).toBeUndefined();
  });

  it('clears the textarea after a successful add-key submission', async () => {
    vi.mocked(sshService.addSshKey).mockResolvedValue(undefined);
    const wrapper = mountSshSettings();

    await wrapper.find('textarea').setValue('ssh-rsa AAAA...');
    await wrapper.find('[data-testid="add-ssh-key"]').trigger('click');
    await flushPromises();

    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('');
    expect(
      (wrapper.find('[data-testid="add-ssh-key"]').element as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
