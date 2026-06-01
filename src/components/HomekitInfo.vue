<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { resetHomekit } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();
const { run: runHomekitReset } = useAsync();

const resetPairings = async () => {
  try {
    await runHomekitReset(resetHomekit);
    toast.success(t('success.reset', { feature: t('homekit.label') }));
  } catch (error) {
    console.error(error);
    toast.error(t('error.reset', { feature: t('homekit.label') }));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('homekit.label') }}</h2>
    <p>{{ t('homekit.description') }}</p>
    <StyledButton type="button" variant="secondary" @click="resetPairings">
      {{ t('actions.reset', { feature: t('homekit.label') }) }}
    </StyledButton>
  </BaseCard>
</template>
