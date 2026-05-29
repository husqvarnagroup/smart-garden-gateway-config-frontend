<script setup lang="ts">
import { onMounted } from 'vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import BaseCard from '@/components/BaseCard.vue';

const { data: version, load } = useAsync<GatewayVersion | null>(null);

onMounted(() => load(getGatewayVersion));
</script>

<template>
  <BaseCard>
    <h2>System</h2>
    <p>Version: {{ version?.gateway_version ?? '…' }}</p>
  </BaseCard>
</template>
