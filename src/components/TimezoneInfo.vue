<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import {
  getCurrentTimezone,
  listTimezones,
  setTimezone,
  type TimezoneConfig,
} from '@/services/timezone';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect.vue';

const { t } = useTranslation();

const { withLoading, loading, error } = useLoading();
const current = ref<TimezoneConfig | null>(null);
const timezones = ref<string[]>([]);
const selectedTimezone = ref<string>('');
const changeError = ref<string | null>(null);

const fetchData = () =>
  withLoading(async () => {
    const [timezoneConfig, timezone] = await Promise.all([getCurrentTimezone(), listTimezones()]);
    current.value = timezoneConfig;
    timezones.value = timezone;
    selectedTimezone.value = timezoneConfig.timezone;
  });

const onTimezoneChange = async (value: string) => {
  const previous = current.value?.timezone ?? '';
  changeError.value = null;
  try {
    current.value = await setTimezone(value);
    selectedTimezone.value = value;
  } catch (e) {
    changeError.value = e instanceof Error ? e.message : 'Failed to update timezone';
    selectedTimezone.value = previous;
  }
};

onMounted(() => {
  fetchData().catch(() => {});
});
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.timezone.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else-if="error">
      <p>Failed to load timezone data: {{ error }}</p>
      <button @click="fetchData().catch(() => {})">Retry</button>
    </template>

    <template v-else>
      <DropdownSelect v-model="selectedTimezone" :options="timezones" @change="onTimezoneChange" />
      <p v-if="changeError">Failed to update timezone: {{ changeError }}</p>
    </template>
  </BaseCard>
</template>
