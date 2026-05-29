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
        ? t('main.action.enable.successful', { feature: t('main.websocket.title') })
        : t('main.action.disable.successful', { feature: t('main.websocket.title') }),
    );
  } catch {
    toast.error(t('main.action.save.failed', { feature: t('main.websocket.title') }));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.websocket.title') }}</h2>
    <div class="actions">
      <StyledButton type="button" variant="secondary" @click="apply(false)">
        {{ t('main.action.disable') }}
      </StyledButton>
      <StyledButton type="button" variant="primary" @click="apply(true)">
        {{ t('main.action.enable') }}
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
