<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  options: string[];
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const open = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const listRef = ref<HTMLDivElement | null>(null);

const selectedLabel = computed(() => props.modelValue || '—');

const toggle = () => {
  if (props.disabled) return;
  open.value = !open.value;
};

const select = (option: string) => {
  open.value = false;
  if (option === props.modelValue) return;
  emit('update:modelValue', option);
  emit('change', option);
};

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as Node;
  if (!triggerRef.value?.contains(target) && !listRef.value?.contains(target)) {
    open.value = false;
  }
};

const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      open.value = true;
    }
    return;
  }
  if (e.key === 'Escape') {
    open.value = false;
    triggerRef.value?.focus();
    return;
  }
  const idx = props.options.indexOf(props.modelValue);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = props.options[Math.min(idx + 1, props.options.length - 1)];
    if (next) select(next);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = props.options[Math.max(idx - 1, 0)];
    if (prev) select(prev);
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open.value = false;
    triggerRef.value?.focus();
  }
};

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div class="base-select" :class="{ 'base-select--disabled': disabled }">
    <button
      ref="triggerRef"
      type="button"
      class="base-select__trigger"
      :aria-expanded="open"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="base-select__value">{{ selectedLabel }}</span>
      <span class="base-select__arrow" aria-hidden="true">&#9660;</span>
    </button>

    <div v-if="open" ref="listRef" role="listbox" tabindex="-1" class="base-select__list">
      <div
        v-for="option in options"
        :key="option"
        role="option"
        tabindex="0"
        :aria-selected="option === modelValue"
        class="base-select__option"
        :class="{ 'base-select__option--selected': option === modelValue }"
        @mousedown.prevent="select(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
  font-size: 1rem;
}

.base-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 6px 8px;
  font-size: 1rem;
  background: #fff;
  border: 1px solid rgba(34, 36, 38, 0.35);
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.base-select--disabled .base-select__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-select__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.base-select__arrow {
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 0.7rem;
  color: #666;
}

.base-select__list {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  padding: 4px 0;
  background: #fff;
  border: 1px solid rgba(34, 36, 38, 0.35);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  font-size: 1rem;
}

.base-select__option {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-select__option:hover {
  background: #f0f4ff;
}

.base-select__option--selected {
  font-weight: 600;
  background: #e8eeff;
}
</style>
