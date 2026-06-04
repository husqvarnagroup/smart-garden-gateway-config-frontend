import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import I18NextVue from 'i18next-vue';

import AdvancedFeatures from '@/components/AdvancedFeatures.vue';
import BaseCard from '@/components/BaseCard.vue';
import i18next from '@/i18n';

const SLOT_TEXT = 'slot content';

const mountAdvancedFeatures = () =>
  mount(AdvancedFeatures, {
    global: {
      plugins: [[I18NextVue, { i18next }]],
    },
    slots: {
      default: `<div data-testid="slot">${SLOT_TEXT}</div>`,
    },
  });

const clickToggle = (wrapper: ReturnType<typeof mountAdvancedFeatures>) =>
  wrapper.get('[data-testid="advanced-toggle"]').trigger('click');
const clickContinue = (wrapper: ReturnType<typeof mountAdvancedFeatures>) =>
  wrapper.get('[data-testid="advanced-continue"]').trigger('click');
const clickCancel = (wrapper: ReturnType<typeof mountAdvancedFeatures>) =>
  wrapper.get('[data-testid="advanced-cancel"]').trigger('click');

describe('AdvancedFeatures', () => {
  it('starts in hidden state — card and slot not rendered', () => {
    const wrapper = mountAdvancedFeatures();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(false);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('chevron click transitions hidden → confirming (card visible, slot hidden)', async () => {
    const wrapper = mountAdvancedFeatures();
    await clickToggle(wrapper);

    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('chevron click while confirming transitions back to hidden', async () => {
    const wrapper = mountAdvancedFeatures();
    await clickToggle(wrapper);
    await clickToggle(wrapper);

    expect(wrapper.findComponent(BaseCard).exists()).toBe(false);
  });

  it('Cancel button transitions confirming → hidden', async () => {
    const wrapper = mountAdvancedFeatures();
    await clickToggle(wrapper);
    await clickCancel(wrapper);

    expect(wrapper.findComponent(BaseCard).exists()).toBe(false);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('chevron click while open transitions back to hidden (slot removed)', async () => {
    const wrapper = mountAdvancedFeatures();
    await clickToggle(wrapper);
    await clickContinue(wrapper);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(true);

    await clickToggle(wrapper);
    expect(wrapper.findComponent(BaseCard).exists()).toBe(false);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('Continue button transitions confirming → open (slot renders)', async () => {
    const wrapper = mountAdvancedFeatures();
    await clickToggle(wrapper);
    await clickContinue(wrapper);

    expect(wrapper.findComponent(BaseCard).exists()).toBe(false);
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="slot"]').text()).toBe(SLOT_TEXT);
  });
});
