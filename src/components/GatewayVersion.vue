<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getGatewayVersion, type GatewayVersion } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import SkeletonBlock from '@/components/SkeletonBlock.vue';

const { t } = useTranslation();
const toast = useToast();

const { pending: loading, run } = useAsync(true);
const gatewayVersion = ref<GatewayVersion | null>(null);
const version = computed(() => gatewayVersion.value?.gateway_version ?? null);

onMounted(async () => {
  try {
    gatewayVersion.value = await run(getGatewayVersion);
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: 'gateway version' }));
  }
});
</script>

<template>
  <div :aria-busy="loading" :aria-label="loading ? 'Loading gateway version' : undefined">
    <SkeletonBlock v-if="loading" width="60%" height="var(--space-5)" />
    <span v-else-if="version">{{ t('version') }} {{ version }}</span>
    <a href="/licenses">{{ t('licenses') }}</a>
  </div>
</template>

<style scoped>
div {
  width: 100%;
  min-height: var(--space-5);
  font-size: var(--text-sm);
  text-align: center;
  margin: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}
</style>
