<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';

const { withLoading } = useLoading();
const version = ref<GatewayVersion | null>(null);

const fetchSystem = () =>
  withLoading(async () => {
    version.value = await getGatewayVersion();
  });

onMounted(() => {
  fetchSystem().catch(() => {});
});
</script>

<template>
  <BaseCard>
    <h2>System</h2>
    <p>Version: {{ version?.gateway_version ?? '…' }}</p>
  </BaseCard>
</template>
