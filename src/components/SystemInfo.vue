<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';

const { t } = useTranslation();
const toast = useToast();
const { run } = useAsync();
const gatewayVersion = ref<GatewayVersion | null>(null);

onMounted(async () => {
  try {
    gatewayVersion.value = await run(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: 'system info' }));
  }
});
</script>

<template>
  <BaseCard>
    <h2>System</h2>
    <p>Version: {{ gatewayVersion?.gateway_version ?? '…' }}</p>
  </BaseCard>
</template>
