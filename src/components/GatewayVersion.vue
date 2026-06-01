<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';

const { t } = useTranslation();
const toast = useToast();

const { run } = useAsync();
const gatewayVersion = ref<GatewayVersion | null>(null);

onMounted(async () => {
  try {
    gatewayVersion.value = await run(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: 'gateway version' }));
  }
});
</script>

<template>
  <p v-if="gatewayVersion?.gateway_version">
    {{ t('version') }} {{ gatewayVersion.gateway_version }} /
    <a href="/licenses">{{ t('licenses') }}</a>
  </p>
</template>

<style scoped>
p {
  text-align: center;
  margin: var(--space-8) 0;
}
</style>
