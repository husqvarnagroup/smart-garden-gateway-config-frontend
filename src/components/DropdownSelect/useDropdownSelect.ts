import { ref, computed, onMounted, onBeforeUnmount, type ComponentPublicInstance } from 'vue';

export interface DropdownSelectProps {
  options?: string[];
  modelValue: string;
  disabled?: boolean;
  loadOptions?: () => Promise<string[]>;
}

export type DropdownSelectEmits = {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
};

export function useDropdownSelect(props: DropdownSelectProps, emit: DropdownSelectEmits) {
  const open = ref(false);
  const highlighted = ref('');
  const triggerRef = ref<HTMLButtonElement | null>(null);
  const listRef = ref<ComponentPublicInstance | null>(null);

  const loadedOptions = ref<string[] | null>(null);
  const listLoading = ref(false);
  const listError = ref<string | null>(null);

  const resolvedOptions = computed(() => {
    if (props.loadOptions) return loadedOptions.value ?? [];
    return props.options ?? [];
  });

  const selectedLabel = computed(() => props.modelValue || '—');

  const fetchOptions = async () => {
    if (!props.loadOptions) return;
    listLoading.value = true;
    listError.value = null;
    try {
      loadedOptions.value = await props.loadOptions();
    } catch (error) {
      listError.value = error instanceof Error ? error.message : 'Failed to load options';
    } finally {
      listLoading.value = false;
    }
  };

  const openList = async () => {
    open.value = true;
    highlighted.value = props.modelValue;
    if (props.loadOptions && loadedOptions.value === null && !listLoading.value) {
      await fetchOptions();
    }
  };

  const toggle = async () => {
    if (props.disabled) return;
    if (open.value) {
      open.value = false;
    } else {
      await openList();
    }
  };

  const retry = async () => {
    loadedOptions.value = null;
    await openList();
  };

  const select = (option: string) => {
    open.value = false;
    if (option === props.modelValue) return;
    emit('update:modelValue', option);
    emit('change', option);
  };

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (
      !triggerRef.value?.contains(target) &&
      !(listRef.value?.$el as HTMLElement)?.contains(target)
    ) {
      open.value = false;
    }
  };

  const onKeydown = async (e: KeyboardEvent) => {
    if (!open.value) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        await openList();
      }
      return;
    }
    if (e.key === 'Escape') {
      open.value = false;
      triggerRef.value?.focus();
      return;
    }
    const opts = resolvedOptions.value;
    const idx = opts.indexOf(highlighted.value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = opts[Math.min(idx + 1, opts.length - 1)];
      if (next) highlighted.value = next;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = opts[Math.max(idx - 1, 0)];
      if (prev) highlighted.value = prev;
    } else if (e.key === 'Tab') {
      if (highlighted.value) select(highlighted.value);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlighted.value) select(highlighted.value);
      triggerRef.value?.focus();
    }
  };

  onMounted(() => document.addEventListener('mousedown', onClickOutside));
  onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside));

  return {
    open,
    highlighted,
    triggerRef,
    listRef,
    resolvedOptions,
    selectedLabel,
    listLoading,
    listError,
    toggle,
    retry,
    select,
    onKeydown,
  };
}
