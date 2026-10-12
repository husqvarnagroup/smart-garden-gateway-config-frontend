<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';

defineProps<{ title: string }>();

const isOpen = defineModel<boolean>('open', { default: false });
</script>

<template>
  <BaseCard>
    <div class="header">
      <h2>{{ title }}</h2>
      <button
        type="button"
        class="chevron-toggle"
        :aria-expanded="isOpen"
        :aria-label="title"
        data-testid="expandable-toggle"
        @click="isOpen = !isOpen"
      >
        <span class="chevron" :class="{ open: isOpen }">&#8250;</span>
      </button>
    </div>
    <div v-if="isOpen" class="content">
      <slot />
    </div>
  </BaseCard>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h2 {
  margin: 0;
}

.chevron-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-grey-300);
  line-height: 0;
}

.chevron {
  display: inline-block;
  font-size: var(--text-xl);
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(-90deg);
}

.content {
  margin-top: var(--space-4);
}
</style>
