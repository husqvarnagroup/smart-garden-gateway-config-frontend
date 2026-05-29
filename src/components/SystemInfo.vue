<script setup lang="ts">
import { onMounted } from 'vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';

const toast = useToast();
const { data: version, load } = useAsync<GatewayVersion | null>(null);

onMounted(async () => {
  try {
    await load(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error('Failed to load system info');
  }
});
</script>

<template>
  <BaseCard>
    <h2>System</h2>
    <p>Version: {{ version?.gateway_version ?? '…' }}</p>
  </BaseCard>
</template>
