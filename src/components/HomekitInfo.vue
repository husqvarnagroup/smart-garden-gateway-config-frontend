<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { resetHomekit } from '@/services/system';
import { useAsync } from '@/composables/useAsync';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const { load } = useAsync();

const resetPairings = () =>
  load(async () => {
    await resetHomekit();
  });
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
