<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';

defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <div>
    <AppHeader />
    <main :aria-busy="disabled">
      <slot />
    </main>
  </div>
</template>

<style scoped>
div {
  min-height: 100%;
  width: 100%;
  background-color: var(--color-grey-100);
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  max-width: var(--layout-max-width);
  width: 100%;
  padding: 0 var(--space-4);
  margin-top: var(--space-4);
  box-sizing: border-box;
}

main[aria-busy='true'] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
