<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <section>
    <h2>{{ title }}</h2>
    <div class="rows">
      <slot />
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--space-4);
}

.rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
