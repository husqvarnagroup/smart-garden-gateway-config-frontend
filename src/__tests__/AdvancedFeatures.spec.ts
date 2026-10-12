// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import AdvancedFeatures from '@/components/AdvancedFeatures.vue';
import i18next from '@/i18n';

const SLOT_TEXT = 'slot content';
const WARNING = 'Continue at your own risk';

const mountAdvancedFeatures = () =>
  mount(AdvancedFeatures, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
    slots: {
      default: `<div data-testid="slot">${SLOT_TEXT}</div>`,
    },
  });

type Wrapper = ReturnType<typeof mountAdvancedFeatures>;

const clickToggle = (wrapper: Wrapper) =>
  wrapper.get('[data-testid="expandable-toggle"]').trigger('click');
const clickContinue = (wrapper: Wrapper) =>
  wrapper.get('[data-testid="advanced-continue"]').trigger('click');

describe('AdvancedFeatures', () => {
  it('starts collapsed with only the Advanced Settings title visible', () => {
    const wrapper = mountAdvancedFeatures();

    expect(wrapper.text()).toContain('Advanced Settings');
    expect(wrapper.text()).not.toContain(WARNING);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('expanding shows the warning and Continue, but not the settings yet', async () => {
    const wrapper = mountAdvancedFeatures();

    await clickToggle(wrapper);

    expect(wrapper.text()).toContain(WARNING);
    expect(wrapper.find('[data-testid="advanced-continue"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('Continue replaces the warning with the settings', async () => {
    const wrapper = mountAdvancedFeatures();

    await clickToggle(wrapper);
    await clickContinue(wrapper);

    expect(wrapper.text()).not.toContain(WARNING);
    expect(wrapper.get('[data-testid="slot"]').text()).toBe(SLOT_TEXT);
  });

  it('collapsing resets back to the warning on the next expand', async () => {
    const wrapper = mountAdvancedFeatures();

    await clickToggle(wrapper);
    await clickContinue(wrapper);
    await clickToggle(wrapper);
    await clickToggle(wrapper);

    expect(wrapper.text()).toContain(WARNING);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });
});
