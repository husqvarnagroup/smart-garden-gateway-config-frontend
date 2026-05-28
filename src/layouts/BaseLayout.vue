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
  background-color: #ececec;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  max-width: 450px;
  width: 100%;
}
</style>
