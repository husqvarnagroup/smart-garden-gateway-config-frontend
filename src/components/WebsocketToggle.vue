<script setup lang="ts">
import { onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getWebsocketEnabled, setWebsocketEnabled } from '@/services/websocket';
import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

const { t } = useTranslation();
const toast = useToast();
const { pending: loading, run: runLoad } = useAsync(true);
const { current: enabled, saving, init, change, saveWithRollback } = useOptimisticSubmit<boolean>();

const toggle = async (newValue: boolean) => {
  change(newValue);
  try {
    await saveWithRollback(() => setWebsocketEnabled(newValue));
    toast.success(
      newValue
        ? t('success.enable', { feature: t('websocket.label') })
        : t('success.disable', { feature: t('websocket.label') }),
    );
  } catch {
    toast.error(t('error.update', { feature: t('websocket.label') }));
  }
};

onMounted(async () => {
  try {
    const config = await runLoad(getWebsocketEnabled);
    init(config.enabled);
  } catch {
    init(false);
    toast.error(t('error.load', { feature: t('websocket.label') }));
  }
});
</script>

<template>
  <BaseCard>
    <div class="row">
      <h2>{{ t('websocket.label') }}</h2>
      <SkeletonBlock v-if="loading" width="44px" height="24px" />
      <ToggleSwitch
        v-else
        :label="t('websocket.label')"
        :model-value="enabled ?? false"
        :loading="saving"
        @update:model-value="toggle"
      />
    </div>
  </BaseCard>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
