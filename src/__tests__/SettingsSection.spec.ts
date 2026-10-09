// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import SettingsSection from '@/components/SettingsSection.vue';

describe('SettingsSection', () => {
  it('renders the title and slot content inside a section', () => {
    const wrapper = mount(SettingsSection, {
      props: { title: 'Some Settings' },
      slots: { default: '<div data-testid="slot">content</div>' },
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.get('h2').text()).toBe('Some Settings');
    expect(wrapper.find('[data-testid="slot"]').exists()).toBe(true);
  });
});
