<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="container">
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.container {
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
  box-sizing: border-box;
}
</style>
