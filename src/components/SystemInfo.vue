<script setup lang="ts">
import { onMounted } from 'vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import BaseCard from '@/components/BaseCard.vue';

const { load, data: version } = useAsync<GatewayVersion | null>(null);

const fetchSystem = () => load(getGatewayVersion);

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
