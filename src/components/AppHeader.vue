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
  background-color: #ffff;
}

h1 {
  font-size: 28px;
  font-weight: 300;
}
</style>
