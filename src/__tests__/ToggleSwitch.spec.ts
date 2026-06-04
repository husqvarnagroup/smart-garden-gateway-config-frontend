import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ToggleSwitch from '@/components/ToggleSwitch.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

type ToggleProps = {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
};

const mountToggle = (props: ToggleProps) =>
  mount(ToggleSwitch, {
    props: {
      modelValue: props.modelValue,
      label: props.label ?? 'Toggle',
      disabled: props.disabled,
      loading: props.loading,
    },
  });

const getSwitch = (wrapper: ReturnType<typeof mountToggle>) => wrapper.get('[role="switch"]');

describe('ToggleSwitch', () => {
  it('renders as unchecked when model value is false', () => {
    const wrapper = mountToggle({ modelValue: false });
    expect(getSwitch(wrapper).attributes('aria-checked')).toBe('false');
  });

  it('renders as checked when model value is true', () => {
    const wrapper = mountToggle({ modelValue: true });
    expect(getSwitch(wrapper).attributes('aria-checked')).toBe('true');
  });

  it('applies the on class when model value is true', () => {
    const wrapper = mountToggle({ modelValue: true });
    expect(getSwitch(wrapper).classes()).toContain('on');
  });

  it('does not apply the on class when model value is false', () => {
    const wrapper = mountToggle({ modelValue: false });
    expect(getSwitch(wrapper).classes()).not.toContain('on');
  });

  it('emits true when clicked while unchecked', async () => {
    const wrapper = mountToggle({ modelValue: false });
    await getSwitch(wrapper).trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('emits false when clicked while checked', async () => {
    const wrapper = mountToggle({ modelValue: true });
    await getSwitch(wrapper).trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('is disabled when the disabled prop is true', () => {
    const wrapper = mountToggle({ modelValue: false, disabled: true });
    expect((getSwitch(wrapper).element as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when the loading prop is true', () => {
    const wrapper = mountToggle({ modelValue: false, loading: true });
    expect((getSwitch(wrapper).element as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows a loading spinner when loading is true', () => {
    const wrapper = mountToggle({ modelValue: false, loading: true });
    expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(true);
  });

  it('does not show a loading spinner when loading is false', () => {
    const wrapper = mountToggle({ modelValue: false });
    expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(false);
  });
});
