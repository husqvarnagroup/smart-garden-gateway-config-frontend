<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';

defineProps<{
  options: string[];
  loading: boolean;
  modelValue: string;
  highlighted: string;
}>();

const emit = defineEmits<{
  select: [value: string];
}>();
</script>

<template>
  <div role="listbox" tabindex="-1">
    <div v-if="loading" class="status">
      <LoadingSpinner />
    </div>
    <div v-else-if="options.length === 0" class="status">No options</div>
    <template v-else>
      <div
        v-for="option in options"
        :key="option"
        role="option"
        tabindex="0"
        :aria-selected="option === modelValue"
        :class="{ selected: option === modelValue, highlighted: option === highlighted }"
        @mousedown.prevent="emit('select', option)"
      >
        <slot name="option" :option="option">{{ option }}</slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
[role='listbox'] {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: var(--space-1) 0;
  background: var(--color-white);
  border: var(--border-sm) solid var(--color-grey-200);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  box-shadow: 0 var(--space-1) var(--space-3) var(--color-overlay-sm);
  max-height: var(--layout-dropdown-max-height);
  overflow-y: auto;
  z-index: 100;
  font-size: var(--text-sm);
}

[role='option'] {
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[role='option']:hover {
  background: var(--color-blue-50);
}

[role='option'].selected {
  font-weight: 600;
  background: var(--color-blue-100);
}

[role='option'].highlighted {
  background: var(--color-blue-50);
}

.status {
  padding: var(--space-2) var(--space-3);
  color: var(--color-grey-400);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}
</style>
