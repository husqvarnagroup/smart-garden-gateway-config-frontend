<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { setWebsocketEnabled } from '@/services/websocket';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const apply = async (enable: boolean) => {
  errorMessage.value = null;
  successMessage.value = null;
  try {
    await setWebsocketEnabled(enable);
    successMessage.value = enable
      ? t('main.websocket.enable.successful')
      : t('main.websocket.disable.successful');
  } catch {
    errorMessage.value = t('main.websocket.save.failed');
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.websocket.title') }}</h2>
    <div class="actions">
      <StyledButton type="button" variant="secondary" @click="apply(false)">
        {{ t('main.websocket.disable.button') }}
      </StyledButton>
      <StyledButton type="button" variant="primary" @click="apply(true)">
        {{ t('main.websocket.enable.button') }}
      </StyledButton>
    </div>
    <p v-if="successMessage" class="feedback feedback--success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>
  </BaseCard>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
}

.feedback {
  margin: var(--space-2) 0 0;
  font-size: var(--text-sm);
}

.feedback--success {
  color: var(--color-green-600);
}

.feedback--error {
  color: var(--color-red-600);
}
</style>
