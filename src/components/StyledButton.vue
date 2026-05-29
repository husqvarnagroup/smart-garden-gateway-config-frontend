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
  padding: 11px 21px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  min-height: calc(1.5em + 22px);
  box-sizing: border-box;
}

.btn--primary {
  background-color: #f15922;
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  background-color: #f64404;
}

.btn--secondary {
  background: #fff;
  color: rgba(0, 0, 0, 0.6);
  -webkit-box-shadow:
    0 0 0 1px rgba(34, 36, 38, 0.35) inset,
    0 0 0 0 rgba(34, 36, 38, 0.15) inset;
  box-shadow:
    0 0 0 1px rgba(34, 36, 38, 0.35) inset,
    0 0 0 0 rgba(34, 36, 38, 0.15) inset;
}

.btn--secondary:hover:not(:disabled) {
  color: rgba(0, 0, 0, 0.8);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
