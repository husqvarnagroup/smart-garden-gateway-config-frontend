<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getCloudConnectionEnabled, setCloudConnectionEnabled } from '@/services/cloudConnection';
import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

const { t } = useTranslation();
const toast = useToast();
const { pending: loading, run: runLoad } = useAsync(true);
const { current: enabled, saving, init, change, saveWithRollback } = useOptimisticSubmit<boolean>();

const toggle = async (newValue: boolean) => {
  change(newValue);
  try {
    await saveWithRollback(() => setCloudConnectionEnabled(newValue));
    toast.success(
      newValue
        ? t('success.enable', { feature: t('cloudConnection.label') })
        : t('success.disable', { feature: t('cloudConnection.label') }),
    );
  } catch {
    toast.error(t('error.update', { feature: t('cloudConnection.label') }));
  }
};

onMounted(async () => {
  try {
    const config = await runLoad(getCloudConnectionEnabled);
    init(config.enabled);
  } catch {
    init(false);
    toast.error(t('error.load', { feature: t('cloudConnection.label') }));
  }
});
</script>

<template>
  <div class="row">
    <h3>{{ t('cloudConnection.label') }}</h3>
    <SkeletonBlock v-if="loading" width="44px" height="24px" />
    <ToggleSwitch
      v-else
      :label="t('cloudConnection.label')"
      :model-value="enabled ?? false"
      :loading="saving"
      @update:model-value="toggle"
    />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h3 {
  font-size: var(--text-sm);
  font-weight: 700;
  margin: 0;
  color: var(--color-grey-400);
}
</style>
