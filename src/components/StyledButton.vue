<script setup lang="ts">
import Spinner from '@/components/LoadingSpinner.vue';

defineProps<{
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button :class="['btn', `btn--${variant}`]" :disabled="disabled || loading">
    <Spinner v-if="loading" />
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  width: 100%;
  text-align: center;
  cursor: pointer;
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  box-sizing: border-box;
}

.btn--primary {
  background-color: var(--color-orange-500);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-orange-600);
}

.btn--secondary {
  background: var(--color-white);
  color: var(--color-overlay-md);
  box-shadow:
    0 0 0 1px var(--color-shadow-md) inset,
    0 0 0 0 var(--color-shadow-sm) inset;
}

.btn--secondary:hover:not(:disabled) {
  color: var(--color-overlay-lg);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
