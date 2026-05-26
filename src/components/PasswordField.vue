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
  gap: 8px;
}

label {
  font-weight: 700;
}

input {
  padding: 12px 16px;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  background: #fff;
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

input::placeholder {
  color: #aaa;
}
</style>
