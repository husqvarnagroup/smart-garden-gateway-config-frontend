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
import SkeletonBlock from '@/components/SkeletonBlock.vue';
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

    <div class="actions">
      <DropdownSelect
        :disabled="timezoneLoading || timezoneSaving"
        :model-value="currentTimezone?.timezone ?? ''"
        :load-options="listTimezones"
        @change="changeTimezone({ timezone: $event })"
      >
        <template #value>
          <SkeletonBlock
            v-if="timezoneLoading && !currentTimezone"
            width="100%"
            height="var(--text-lg)"
          />
          <span v-else>{{ currentTimezone?.timezone ?? t('timezone.notfound') }}</span>
        </template>
      </DropdownSelect>
      <StyledButton
        type="button"
        variant="primary"
        :disabled="timezoneLoading || !currentTimezone?.timezone"
        :loading="timezoneSaving"
        @click="saveTimezone()"
      >
        {{ t('actions.save') }}
      </StyledButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
