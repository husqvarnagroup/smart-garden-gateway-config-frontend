// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import { allowConsoleErrors } from './setup';
import { mockToastError, resetToastMocks } from './helpers/mockUseToast';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import i18next from '@/i18n';

let wrapper: VueWrapper | null = null;

const mountDropdown = (props: Partial<InstanceType<typeof DropdownSelect>['$props']> = {}) => {
  wrapper = mount(DropdownSelect, {
    attachTo: document.body,
    props: { modelValue: '', options: ['alpha', 'beta', 'gamma'], ...props },
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
  });
  return wrapper;
};

const getTrigger = () => wrapper!.find('button');
const getListbox = () => wrapper!.find('[role="listbox"]');
const getOptions = () => wrapper!.findAll('[role="option"]');

describe('DropdownSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetToastMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
  });

  describe('open/close', () => {
    it('opens on trigger click', async () => {
      mountDropdown();
      expect(getListbox().exists()).toBe(false);

      await getTrigger().trigger('click');
      await flushPromises();

      expect(getListbox().exists()).toBe(true);
      expect(getTrigger().attributes('aria-expanded')).toBe('true');
    });

    it('closes on second trigger click', async () => {
      mountDropdown();
      await getTrigger().trigger('click');
      await flushPromises();
      expect(getListbox().exists()).toBe(true);

      await getTrigger().trigger('click');
      expect(getListbox().exists()).toBe(false);
      expect(getTrigger().attributes('aria-expanded')).toBe('false');
    });

    it('closes on outside mousedown', async () => {
      mountDropdown();
      await getTrigger().trigger('click');
      await flushPromises();
      expect(getListbox().exists()).toBe(true);

      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flushPromises();

      expect(getListbox().exists()).toBe(false);
    });

    it('stays open when mousedown happens inside the list', async () => {
      mountDropdown();
      await getTrigger().trigger('click');
      await flushPromises();

      const optionEl = getOptions()[0]!.element;
      optionEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await flushPromises();

      expect(wrapper!.exists()).toBe(true);
    });
  });

  describe('disabled', () => {
    it('does not open when disabled and trigger is clicked', async () => {
      mountDropdown({ disabled: true });
      await getTrigger().trigger('click');
      await flushPromises();

      expect(getListbox().exists()).toBe(false);
      expect((getTrigger().element as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe('selection', () => {
    it('selects an option on mousedown and emits update:modelValue + change', async () => {
      mountDropdown();
      await getTrigger().trigger('click');
      await flushPromises();

      await getOptions()[1]!.trigger('mousedown');

      expect(wrapper!.emitted('update:modelValue')).toEqual([['beta']]);
      expect(wrapper!.emitted('change')).toEqual([['beta']]);
      expect(getListbox().exists()).toBe(false);
    });

    it('does not emit when the same option is reselected', async () => {
      mountDropdown({ modelValue: 'beta' });
      await getTrigger().trigger('click');
      await flushPromises();

      await getOptions()[1]!.trigger('mousedown');

      expect(wrapper!.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper!.emitted('change')).toBeUndefined();
      expect(getListbox().exists()).toBe(false);
    });

    it('marks the modelValue option with aria-selected=true', async () => {
      mountDropdown({ modelValue: 'gamma' });
      await getTrigger().trigger('click');
      await flushPromises();

      const selected = getOptions().filter((o) => o.attributes('aria-selected') === 'true');
      expect(selected).toHaveLength(1);
      expect(selected[0]!.text()).toBe('gamma');
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowDown on a closed dropdown opens it', async () => {
      mountDropdown();
      await getTrigger().trigger('keydown', { key: 'ArrowDown' });
      await flushPromises();
      expect(getListbox().exists()).toBe(true);
    });

    it('ArrowDown moves highlight to the next option', async () => {
      mountDropdown({ modelValue: 'alpha' });
      await getTrigger().trigger('click');
      await flushPromises();

      await getTrigger().trigger('keydown', { key: 'ArrowDown' });
      await flushPromises();

      const highlighted = getOptions().find((o) => o.classes().includes('highlighted'));
      expect(highlighted?.text()).toBe('beta');
    });

    it('ArrowUp moves highlight to the previous option', async () => {
      mountDropdown({ modelValue: 'gamma' });
      await getTrigger().trigger('click');
      await flushPromises();

      await getTrigger().trigger('keydown', { key: 'ArrowUp' });
      await flushPromises();

      const highlighted = getOptions().find((o) => o.classes().includes('highlighted'));
      expect(highlighted?.text()).toBe('beta');
    });

    it('Enter selects the highlighted option and closes', async () => {
      mountDropdown({ modelValue: 'alpha' });
      await getTrigger().trigger('click');
      await flushPromises();

      await getTrigger().trigger('keydown', { key: 'ArrowDown' });
      await getTrigger().trigger('keydown', { key: 'Enter' });

      expect(wrapper!.emitted('update:modelValue')).toEqual([['beta']]);
      expect(getListbox().exists()).toBe(false);
    });

    it('Escape closes without selecting', async () => {
      mountDropdown({ modelValue: 'alpha' });
      await getTrigger().trigger('click');
      await flushPromises();

      await getTrigger().trigger('keydown', { key: 'Escape' });

      expect(getListbox().exists()).toBe(false);
      expect(wrapper!.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('empty options', () => {
    it('shows the "No options" status when options is empty', async () => {
      mountDropdown({ options: [] });
      await getTrigger().trigger('click');
      await flushPromises();

      expect(getListbox().text()).toContain('No options');
      expect(getOptions()).toHaveLength(0);
    });
  });

  describe('loadOptions (async)', () => {
    it('calls loadOptions on first open and populates the list', async () => {
      const loadOptions = vi.fn<() => Promise<string[]>>().mockResolvedValue(['x', 'y']);
      mountDropdown({ options: undefined, loadOptions });

      await getTrigger().trigger('click');
      await flushPromises();

      expect(loadOptions).toHaveBeenCalledOnce();
      expect(getOptions().map((o) => o.text())).toEqual(['x', 'y']);
    });

    it('shows a loading indicator while loadOptions is pending', async () => {
      let resolve!: (v: string[]) => void;
      const loadOptions = vi.fn<() => Promise<string[]>>(() => new Promise((r) => (resolve = r)));
      mountDropdown({ options: undefined, loadOptions });

      await getTrigger().trigger('click');
      await flushPromises();

      expect(getTrigger().attributes('aria-busy')).toBe('true');
      expect(getListbox().find('.status').exists()).toBe(true);

      resolve(['done']);
      await flushPromises();

      expect(getTrigger().attributes('aria-busy')).toBe('false');
      expect(getOptions().map((o) => o.text())).toEqual(['done']);
    });

    it('shows an error toast when loadOptions rejects', async () => {
      const loadOptions = vi.fn<() => Promise<string[]>>().mockRejectedValue(new Error('Network'));
      allowConsoleErrors();
      mountDropdown({ options: undefined, loadOptions });

      await getTrigger().trigger('click');
      await flushPromises();

      expect(mockToastError).toHaveBeenCalledOnce();
      expect(getListbox().text()).toContain('No options');
    });
  });
});
