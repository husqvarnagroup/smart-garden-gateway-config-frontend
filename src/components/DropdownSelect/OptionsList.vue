<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';

defineProps<{
  options: string[];
  loading: boolean;
  error: string | null;
  modelValue: string;
  highlighted: string;
}>();

const emit = defineEmits<{
  (e: 'select', value: string): void;
  (e: 'retry'): void;
}>();
</script>

<template>
  <div role="listbox" tabindex="-1" class="base-select__list">
    <div v-if="loading" class="base-select__status">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="base-select__status base-select__status--error">
      <span>{{ error }}</span>
      <button type="button" class="base-select__retry" @click="emit('retry')">Retry</button>
    </div>
    <template v-else>
      <div
        v-for="option in options"
        :key="option"
        role="option"
        tabindex="0"
        :aria-selected="option === modelValue"
        class="base-select__option"
        :class="{
          'base-select__option--selected': option === modelValue,
          'base-select__option--highlighted': option === highlighted,
        }"
        @mousedown.prevent="emit('select', option)"
      >
        <slot name="option" :option="option">{{ option }}</slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
.base-select__list {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  padding: var(--space-1) 0;
  background: var(--color-white);
  border: 1px solid var(--color-shadow-md);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px var(--color-overlay-sm);
  max-height: var(--layout-dropdown-max-height);
  overflow-y: auto;
  z-index: 100;
  font-size: var(--text-base);
}

.base-select__option {
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-select__option:hover {
  background: var(--color-blue-50);
}

.base-select__option--selected {
  font-weight: 600;
  background: var(--color-blue-100);
}

.base-select__option--highlighted {
  background: var(--color-blue-50);
}

.base-select__status {
  padding: var(--space-2) var(--space-3);
  color: var(--color-grey-400);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.base-select__status--error {
  color: var(--color-red-600);
}

.base-select__retry {
  font-size: var(--text-sm);
  padding: var(--border-md) var(--space-2);
  cursor: pointer;
  border: 1px solid var(--color-red-600);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-red-600);
}

.base-select__retry:hover {
  background: var(--color-red-50);
}
</style>
