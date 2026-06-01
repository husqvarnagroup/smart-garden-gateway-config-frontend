<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { setWebsocketEnabled } from '@/services/websocket';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();

const apply = async (enable: boolean) => {
  try {
    await setWebsocketEnabled(enable);
    toast.success(
      enable
        ? t('success.enable', { feature: t('websocket.label') })
        : t('success.disable', { feature: t('websocket.label') }),
    );
  } catch {
    toast.error(t('error.update', { feature: t('websocket.label') }));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('websocket.label') }}</h2>
    <div class="actions">
      <StyledButton type="button" variant="secondary" @click="apply(false)">
        {{ t('actions.disable') }}
      </StyledButton>
      <StyledButton type="button" variant="primary" @click="apply(true)">
        {{ t('actions.enable') }}
      </StyledButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
}
</style>
