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
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();

const { loading, data, load } = useAsync<TimezoneConfig>();
const saving = ref(false);

const onTimezoneChange = (value: string) => {
  data.value = { timezone: value };
};

const saveTimezone = async () => {
  if (!data.value?.timezone) return;
  saving.value = true;
  try {
    await setTimezone(data.value.timezone);
    toast.success(t('main.timezone.save.successful'));
  } catch (error) {
    console.error(error);
    toast.error(t('main.timezone.save.failed'));
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  try {
    await load(getCurrentTimezone);
  } catch (error) {
    console.error(error);
    toast.error(t('main.timezone.loading.failed'));
  }
});
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.timezone.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else>
      <div class="actions">
        <DropdownSelect
          :model-value="data?.timezone ?? 'No Timezone Found'"
          :load-options="listTimezones"
          @change="onTimezoneChange"
        />
        <StyledButton type="button" variant="primary" :loading="saving" @click="saveTimezone()">
          {{ t('main.timezone.save.button') }}
        </StyledButton>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
