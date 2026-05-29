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
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();

const { loading, data, load } = useAsync<TimezoneConfig>();
const saving = ref(false);
const changeError = ref<string | null>(null);

const onTimezoneChange = (value: string) => {
  data.value = { timezone: value };
};

const saveTimezone = async () => {
  if (!data.value?.timezone) return;
  const previous = data.value;
  changeError.value = null;
  saving.value = true;
  try {
    await setTimezone(data.value.timezone);
  } catch (e) {
    changeError.value = e instanceof Error ? e.message : 'Failed to update timezone';
    data.value = previous;
  } finally {
    saving.value = false;
  }
};

onMounted(() => load(getCurrentTimezone));
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.timezone.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else>
      <div class="timezone-actions">
        <DropdownSelect
          :model-value="data?.timezone ?? 'No Timezone Found'"
          :load-options="listTimezones"
          @change="onTimezoneChange"
        />
        <StyledButton type="button" variant="primary" :loading="saving" @click="saveTimezone()">
          {{ t('main.timezone.save.button') }}
        </StyledButton>
      </div>
      <p v-if="changeError" class="error">Failed to update timezone: {{ changeError }}</p>
    </template>
  </BaseCard>
</template>

<style scoped>
.timezone-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error {
  margin-top: 8px;
  margin-bottom: 0;
}
</style>
