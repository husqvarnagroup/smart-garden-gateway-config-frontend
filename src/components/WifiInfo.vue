<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getCurrentWifi, type WifiConfig } from '@/services/wifi';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';

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
  <BaseCard>
    <h2>Wifi</h2>
    <p>SSID: {{ current?.ssid ?? '…' }}</p>
    <p>Security: {{ current?.key_mgmt ?? '…' }}</p>
  </BaseCard>
</template>
