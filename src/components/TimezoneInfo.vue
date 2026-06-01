<script setup lang="ts">
import { onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';

import {
  type TimezoneConfig,
  getCurrentTimezone,
  listTimezones,
  setTimezone,
} from '@/services/timezone';

import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();

const { pending: timezoneLoading, run: runTimezoneLoad } = useAsync();
const {
  current: currentTimezone,
  saving: timezoneSaving,
  init: initTimezone,
  change: changeTimezone,
  saveWithRollback: saveTimezoneWithRollback,
} = useOptimisticSubmit<TimezoneConfig>();

const saveTimezone = async () => {
  const timezone = currentTimezone.value?.timezone;
  if (!timezone) return;

  try {
    await saveTimezoneWithRollback(() => setTimezone(timezone));
    toast.success(t('success.save'));
  } catch (error) {
    console.error(error);
    toast.error(t('error.update', { feature: t('timezone.label') }));
  }
};

onMounted(async () => {
  try {
    const timezone = await runTimezoneLoad(getCurrentTimezone);
    initTimezone(timezone);
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: t('timezone.label') }));
  }
});
</script>

<template>
  <BaseCard>
    <h2>{{ t('timezone.label') }}</h2>

    <p v-if="timezoneLoading">Loading…</p>

    <template v-else>
      <div class="actions">
        <DropdownSelect
          :model-value="currentTimezone?.timezone ?? 'No Timezone Found'"
          :load-options="listTimezones"
          @change="changeTimezone({ timezone: $event })"
        />
        <StyledButton
          type="button"
          variant="primary"
          :loading="timezoneSaving"
          @click="saveTimezone()"
        >
          {{ t('actions.save') }}
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
