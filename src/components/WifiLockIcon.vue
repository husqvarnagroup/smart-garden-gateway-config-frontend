<script setup lang="ts">
defineProps<{ locked: boolean }>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <!-- lock body -->
    <rect x="3" y="8" width="10" height="7" rx="1.5" fill="currentColor" />
    <!-- keyhole: circle + stem -->
    <circle cx="8" cy="11" r="1.2" fill="white" />
    <line
      x1="8"
      y1="11.8"
      x2="8"
      y2="13.5"
      stroke="white"
      stroke-width="1.2"
      stroke-linecap="round"
    />

    <!-- locked shackle: both arms go into body -->
    <path
      v-if="locked"
      d="M 5 8.5 L 5 5.2 A 3 3 0 0 1 11 5.2 L 11 8.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <!-- unlocked shackle: right arm raised above body -->
    <path
      v-else
      d="M 5 8.5 L 5 5.2 A 3 3 0 0 1 11 5.2 L 11 2.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
