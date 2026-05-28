<script setup lang="ts">
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
      <span class="base-select__spinner" aria-label="Loading" />
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

.base-select__option--highlighted {
  background: #f0f4ff;
}

.base-select__status {
  padding: 8px 12px;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.base-select__spinner {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-top-color: #555;
  border-radius: 50%;
  animation: base-select-spin 0.7s linear infinite;
}

@keyframes base-select-spin {
  to {
    transform: rotate(360deg);
  }
}

.base-select__status--error {
  color: #c0392b;
}

.base-select__retry {
  font-size: 0.85rem;
  padding: 2px 8px;
  cursor: pointer;
  border: 1px solid #c0392b;
  border-radius: 3px;
  background: transparent;
  color: #c0392b;
}

.base-select__retry:hover {
  background: #fdf0ef;
}
</style>
