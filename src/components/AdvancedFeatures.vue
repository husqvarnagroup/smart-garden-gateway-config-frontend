<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

type State = 'hidden' | 'confirming' | 'open';

const { t } = useTranslation();
const state = ref<State>('hidden');

const onChevronClick = () => {
  state.value = state.value === 'hidden' ? 'confirming' : 'hidden';
};
</script>

<template>
  <div class="advanced-features">
    <button
      class="chevron-btn"
      :class="{ 'chevron-btn--open': state !== 'hidden' }"
      @click="onChevronClick"
    >
      &#8250;
    </button>
    <BaseCard v-if="state === 'confirming'">
      <p class="confirm-text">
        {{ t('main.websocket.label') }} &mdash; {{ t('main.websocket.confirm') }}
      </p>
      <div class="confirm-actions">
        <StyledButton type="button" variant="secondary" @click="state = 'hidden'">
          {{ t('main.websocket.confirm.no') }}
        </StyledButton>
        <StyledButton type="button" variant="primary" @click="state = 'open'">
          {{ t('main.websocket.confirm.yes') }}
        </StyledButton>
      </div>
    </BaseCard>
    <slot v-if="state === 'open'" />
  </div>
</template>

<style scoped>
.advanced-features {
  text-align: center;
}

:deep(.card) {
  text-align: left;
}

.chevron-btn {
  background: none;
  border: none;
  color: #bbb;
  font-size: 22px;
  cursor: pointer;
  padding: 8px 16px;
  line-height: 1;
  display: inline-block;
  transform: rotate(90deg);
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.chevron-btn--open {
  transform: rotate(-90deg);
}

.chevron-btn:hover {
  color: #999;
}

.confirm-text {
  margin: 0 0 10px;
  font-size: 13px;
  color: #666;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}
</style>
