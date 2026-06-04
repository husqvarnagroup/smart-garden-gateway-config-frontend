<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, useId } from 'vue';
import PasswordVisibilityIcon from '@/components/PasswordVisibilityIcon.vue';

const model = defineModel<string>({ default: '' });

defineProps<{
  label: string;
  placeholder?: string;
  autocomplete?: 'current-password' | 'new-password';
  disabled?: boolean;
  error?: boolean;
}>();

const id = useId();
const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="control">
      <input
        :id="id"
        v-model="model"
        :type="isVisible ? 'text' : 'password'"
        :placeholder="placeholder"
        name="password"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :class="{ error }"
        required
      />
      <button
        type="button"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        :disabled="disabled"
        @click="toggleVisibility"
      >
        <PasswordVisibilityIcon :visible="isVisible" />
      </button>
    </div>
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

.control {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  padding: var(--space-3) var(--space-10) var(--space-3) var(--space-4);
  border: var(--border-sm) solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

input.error {
  border-color: var(--color-red-600);
}

input::placeholder {
  color: var(--color-grey-300);
}

button {
  position: absolute;
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-grey-400);
  line-height: 0;
}

button:hover {
  color: var(--color-grey-700);
}

button:disabled {
  cursor: not-allowed;
  color: var(--color-grey-300);
}
</style>
