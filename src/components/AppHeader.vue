<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
const { t } = useTranslation();
</script>

<template>
  <header>
    <h1>{{ t('title') }}</h1>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  text-align: center;
  background-color: var(--color-white);
  padding: var(--space-4) 0;
}

h1 {
  font-size: var(--text-2xl);
  font-weight: 300;
  margin: 0;
}
</style>
