<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getCurrentTimezone, listTimezones, setTimezone } from '@/services/timezone';

import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';

const { t } = useTranslation();

const { withLoading, loading, error } = useLoading();
const selectedTimezone = ref<string>('');
const changeError = ref<string | null>(null);

const fetchData = () =>
  withLoading(async () => {
    const timezoneConfig = await getCurrentTimezone();
    selectedTimezone.value = timezoneConfig.timezone;
  });

const onTimezoneChange = async (value: string) => {
  const previousTimezone = selectedTimezone.value;
  changeError.value = null;
  try {
    await setTimezone(value);
    selectedTimezone.value = value;
  } catch (e) {
    changeError.value = e instanceof Error ? e.message : 'Failed to update timezone';
    selectedTimezone.value = previousTimezone;
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
      <DropdownSelect
        v-model="selectedTimezone"
        :load-options="listTimezones"
        @change="onTimezoneChange"
      />
      <p v-if="changeError">Failed to update timezone: {{ changeError }}</p>
    </template>
  </BaseCard>
</template>
