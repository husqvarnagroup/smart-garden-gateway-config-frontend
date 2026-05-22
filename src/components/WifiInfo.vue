<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getCurrentWifi, type WifiConfig } from '@/services/wifi';
import { useLoading } from '@/composables/useLoading';

const { withLoading } = useLoading();
const current = ref<WifiConfig | null>(null);

const fetchCurrentWifi = () =>
  withLoading(async () => {
    current.value = await getCurrentWifi();
  });

onMounted(() => {
  fetchCurrentWifi().catch(() => {});
});
</script>

<template>
  <section>
    <h2>Wifi</h2>
    <p>SSID: {{ current?.ssid ?? '…' }}</p>
    <p>Security: {{ current?.key_mgmt ?? '…' }}</p>
  </section>
</template>
