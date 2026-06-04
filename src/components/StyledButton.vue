<script setup lang="ts">
import Spinner from '@/components/LoadingSpinner.vue';

defineProps<{
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button :class="variant" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <Spinner v-if="loading" />
    <slot v-else />
  </button>
</template>

<style scoped>
button {
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

.primary {
  background-color: var(--color-orange-500);
  color: var(--color-white);
}

.primary:hover:not(:disabled) {
  background-color: var(--color-orange-600);
}

.secondary {
  background: var(--color-white);
  color: var(--color-overlay-md);
  box-shadow:
    0 0 0 1px var(--color-shadow-md) inset,
    0 0 0 0 var(--color-shadow-sm) inset;
}

.secondary:hover:not(:disabled) {
  color: var(--color-overlay-lg);
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
