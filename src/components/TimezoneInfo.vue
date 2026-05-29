<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import {
  type TimezoneConfig,
  getCurrentTimezone,
  listTimezones,
  setTimezone,
} from '@/services/timezone';

import { useAsync } from '@/composables/useAsync';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';

const { t } = useTranslation();

const { loading, data, load } = useAsync<TimezoneConfig>();
const changeError = ref<string | null>(null);

const onTimezoneChange = async (value: string) => {
  const previous = data.value;
  changeError.value = null;
  try {
    await setTimezone(value);
    data.value = { timezone: value };
  } catch (e) {
    changeError.value = e instanceof Error ? e.message : 'Failed to update timezone';
    data.value = previous;
  }
};

onMounted(() => load(getCurrentTimezone));
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.timezone.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else>
      <DropdownSelect
        :model-value="data?.timezone ?? 'No Timezone Found'"
        :load-options="listTimezones"
        @change="onTimezoneChange"
      />
      <p v-if="changeError">Failed to update timezone: {{ changeError }}</p>
    </template>
  </BaseCard>
</template>
