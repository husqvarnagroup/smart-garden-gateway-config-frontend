<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { setSshEnabled } from '@/services/ssh';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();

const apply = async (enable: boolean) => {
  try {
    await setSshEnabled(enable);
    toast.success(
      enable
        ? t('success.enable', { feature: t('ssh.label') })
        : t('success.disable', { feature: t('ssh.label') }),
    );
  } catch {
    toast.error(t('error.update', { feature: t('ssh.label') }));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('ssh.label') }}</h2>
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
  gap: var(--space-2);
}
</style>
