<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';

defineProps<{
  label: string;
  disabled?: boolean;
  loading?: boolean;
}>();

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-label="label"
    :aria-checked="model"
    :disabled="disabled || loading"
    :class="{ on: model }"
    @click="model = !model"
  >
    <span class="track">
      <span class="knob">
        <LoadingSpinner v-if="loading" />
      </span>
    </span>
  </button>
</template>

<style scoped>
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

.track {
  display: flex;
  align-items: center;
  width: 44px;
  height: var(--space-6);
  border-radius: var(--radius-pill);
  background: var(--color-grey-200);
  padding: 3px;
  box-sizing: border-box;
  transition: background 200ms;
}

button.on .track {
  background: var(--color-orange-500);
}

.knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-white);
  transition: transform 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}

button.on .knob {
  transform: translateX(var(--space-5));
}
</style>
