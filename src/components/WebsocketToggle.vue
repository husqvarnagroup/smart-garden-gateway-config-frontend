<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { setWebsocketEnabled } from '@/services/websocket';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const { withLoading } = useLoading();

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const apply = (enable: boolean) =>
  withLoading(async () => {
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
  });
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
  gap: 8px;
}

.feedback {
  margin: 10px 0 0;
  font-size: 13px;
}

.feedback--success {
  color: #2d8a4e;
}

.feedback--error {
  color: #c0392b;
}
</style>
