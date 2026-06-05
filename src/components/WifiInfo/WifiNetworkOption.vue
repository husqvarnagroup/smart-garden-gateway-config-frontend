<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import WifiSignal from '@/components/WifiSignal.vue';
import WifiLockIcon from '@/components/WifiLockIcon.vue';

defineProps<{
  name: string;
  signal?: number;
  locked: boolean;
}>();
</script>

<template>
  <div class="option">
    <WifiSignal :signal="signal" />
    <span class="name">{{ name }}</span>
    <WifiLockIcon :locked="locked" />
  </div>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--space-1);
}

.name {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
