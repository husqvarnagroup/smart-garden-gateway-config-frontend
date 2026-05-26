<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getGatewayVersion } from '@/services/system';

const gatewayVersion = ref<string | null>(null);

onMounted(() => {
  getGatewayVersion()
    .then((v) => (gatewayVersion.value = v.gateway_version))
    .catch((error) => {
      console.error('Failed to load Gateway Version:', error);
    });
});
</script>

<template>
  <p v-if="gatewayVersion">Version {{ gatewayVersion }} / <a href="/licenses">Licences</a></p>
</template>

<style scoped>
p {
  text-align: center;
  margin: 32px 0;
}
</style>
