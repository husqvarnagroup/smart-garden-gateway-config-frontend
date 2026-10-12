// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ExpandableCard from '@/components/ExpandableCard.vue';

const mountExpandableCard = () =>
  mount(ExpandableCard, {
    props: { title: 'Some Settings' },
    slots: { default: '<div data-testid="slot">content</div>' },
  });

const getToggle = (wrapper: ReturnType<typeof mountExpandableCard>) =>
  wrapper.get('[data-testid="expandable-toggle"]');

describe('ExpandableCard', () => {
  it('starts collapsed, showing only the title', () => {
    const wrapper = mountExpandableCard();

    expect(wrapper.get('h2').text()).toBe('Some Settings');
    expect(getToggle(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });

  it('toggles the content open and closed', async () => {
    const wrapper = mountExpandableCard();

    await getToggle(wrapper).trigger('click');
    expect(getToggle(wrapper).attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(true);

    await getToggle(wrapper).trigger('click');
    expect(getToggle(wrapper).attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(false);
  });
});
