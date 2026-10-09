<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

const props = defineProps<{
  label: string;
  description: string;
  load: () => Promise<{ enabled: boolean }>;
  save: (enabled: boolean) => Promise<void>;
}>();

const { t } = useTranslation();
const toast = useToast();
const { pending: loading, run: runLoad } = useAsync(true);
const { current: enabled, saving, init, change, saveWithRollback } = useOptimisticSubmit<boolean>();

const toggle = async (newValue: boolean) => {
  change(newValue);
  try {
    await saveWithRollback(() => props.save(newValue));
    toast.success(
      newValue
        ? t('success.enable', { feature: props.label })
        : t('success.disable', { feature: props.label }),
    );
  } catch {
    toast.error(t('error.update', { feature: props.label }));
  }
};

onMounted(async () => {
  try {
    const config = await runLoad(props.load);
    init(config.enabled);
  } catch {
    init(false);
    toast.error(t('error.load', { feature: props.label }));
  }
});
</script>

<template>
  <div>
    <div class="row">
      <h3>{{ label }}</h3>
      <SkeletonBlock v-if="loading" width="44px" height="24px" />
      <ToggleSwitch
        v-else
        :label="label"
        :model-value="enabled ?? false"
        :loading="saving"
        @update:model-value="toggle"
      />
    </div>
    <p class="description">{{ description }}</p>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

h3 {
  font-size: var(--text-sm);
  font-weight: 700;
  margin: 0;
  color: var(--color-grey-400);
}

.description {
  margin: var(--space-1) 0 0;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-grey-400);
}
</style>
