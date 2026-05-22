<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getCurrentTimezone, type TimezoneConfig } from '@/services/timezone';
import { useLoading } from '@/composables/useLoading';

const { withLoading } = useLoading();
const current = ref<TimezoneConfig | null>(null);

const fetchCurrentTimezone = () =>
  withLoading(async () => {
    current.value = await getCurrentTimezone();
  });

onMounted(() => {
  fetchCurrentTimezone().catch(() => {});
});
</script>

<template>
  <section>
    <h2>Timezone</h2>
    <p>{{ current?.timezone ?? '…' }}</p>
  </section>
</template>
