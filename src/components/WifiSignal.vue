<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  signal?: number;
}>();

const level = computed(() => {
  const dBm = props.signal;
  if (dBm == null) return 'none';
  if (dBm >= -55) {
    return 'strong';
  } else if (dBm < -55 && dBm >= -75) {
    return 'medium';
  } else if (dBm < -75 && dBm > -85) {
    return 'weak';
  } else {
    return 'none';
  }
});

const opacity = computed(() => ({
  bar1: level.value !== 'none' ? 1 : 0.2,
  bar2: level.value === 'strong' || level.value === 'medium' ? 1 : 0.2,
  bar3: level.value === 'strong' ? 1 : 0.2,
}));
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <rect x="2" y="10" width="3" height="5" rx="0.75" fill="currentColor" :opacity="opacity.bar1" />
    <rect
      x="6.5"
      y="6"
      width="3"
      height="9"
      rx="0.75"
      fill="currentColor"
      :opacity="opacity.bar2"
    />
    <rect
      x="11"
      y="2"
      width="3"
      height="13"
      rx="0.75"
      fill="currentColor"
      :opacity="opacity.bar3"
    />
  </svg>
</template>
