<script setup lang="ts">
import { onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';

const { t } = useTranslation();
const toast = useToast();

const { data, load } = useAsync<GatewayVersion | null>(null);

onMounted(async () => {
  try {
    await load(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error('Failed to load gateway version');
  }
});
</script>

<template>
  <p v-if="data?.gateway_version">
    {{ t('version') }} {{ data.gateway_version }} / <a href="/licenses">{{ t('licenses') }}</a>
  </p>
</template>

<style scoped>
p {
  text-align: center;
  margin: var(--space-8) 0;
}
</style>
