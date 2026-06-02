<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';

const { t } = useTranslation();
const toast = useToast();
const { pending: loading, run } = useAsync();
const gatewayVersion = ref<GatewayVersion | null>(null);

onMounted(async () => {
  try {
    gatewayVersion.value = await run(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: 'system info' }));
  }
});
</script>

<template>
  <BaseCard>
    <h2>System</h2>
    <div class="row">
      <span class="label">Version</span>
      <SkeletonBlock v-if="loading" width="var(--space-10)" height="var(--text-sm)" />
      <span v-else>{{ gatewayVersion?.gateway_version ?? 'Unavailable' }}</span>
    </div>
  </BaseCard>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.label {
  font-weight: 700;
}
</style>
