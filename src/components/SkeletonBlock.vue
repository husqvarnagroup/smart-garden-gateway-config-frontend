<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
  }>(),
  {
    width: '100%',
    height: 'var(--space-6)',
  },
);
</script>

<template>
  <span class="block" aria-hidden="true" :style="{ width: props.width, height: props.height }" />
</template>

<style scoped>
.block {
  display: block;
  background: linear-gradient(
    90deg,
    var(--color-grey-100),
    var(--color-grey-200),
    var(--color-grey-100)
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
</style>
