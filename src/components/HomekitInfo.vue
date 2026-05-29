<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { resetHomekit } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();
const { load } = useAsync();

const resetPairings = async () => {
  try {
    await load(resetHomekit);
    toast.success(t('main.homekit.reset.successful'));
  } catch (error) {
    console.error(error);
    toast.error(t('main.homekit.reset.failed'));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.homekit.label') }}</h2>
    <p>{{ t('main.homekit.text') }}</p>
    <StyledButton type="button" variant="secondary" @click="resetPairings">
      {{ t('main.homekit.reset.button') }}
    </StyledButton>
  </BaseCard>
</template>
