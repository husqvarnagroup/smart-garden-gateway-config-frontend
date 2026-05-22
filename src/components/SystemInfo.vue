<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useLoading } from '@/composables/useLoading';

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
  <section>
    <h2>System</h2>
    <p>Version: {{ version?.gateway_version ?? '…' }}</p>
  </section>
</template>
