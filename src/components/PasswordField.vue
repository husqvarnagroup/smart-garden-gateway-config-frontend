<script setup lang="ts">
import { useId } from 'vue';

const model = defineModel<string>({ default: '' });

defineProps<{
  label: string;
  placeholder?: string;
  autocomplete?: 'current-password' | 'new-password';
}>();

const id = useId();
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      type="password"
      :placeholder="placeholder"
      name="password"
      :autocomplete="autocomplete"
      required
    />
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

label {
  font-weight: 700;
}

input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

input::placeholder {
  color: var(--color-grey-300);
}
</style>
