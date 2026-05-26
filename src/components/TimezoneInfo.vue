<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getCurrentTimezone, type TimezoneConfig } from '@/services/timezone';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';

const { t } = useTranslation();

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
  <BaseCard>
    <h2>{{ t('main.timezone.label') }}</h2>
    <p>{{ current?.timezone ?? '…' }}</p>
  </BaseCard>
</template>
