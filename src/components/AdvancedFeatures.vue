<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

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
  <div>
    <button
      aria-label="Toggle advanced features"
      data-testid="advanced-toggle"
      class="chevron"
      :class="{ open: state !== 'hidden' }"
      @click="onChevronClick"
    >
      &#8250;
    </button>
    <BaseCard v-if="state === 'confirming'">
      <h2>{{ t('advanced.label') }}</h2>
      <p>{{ t('advanced.confirm') }}</p>
      <div class="actions">
        <StyledButton
          type="button"
          variant="secondary"
          data-testid="advanced-cancel"
          @click="state = 'hidden'"
        >
          {{ t('actions.cancel') }}
        </StyledButton>
        <StyledButton
          type="button"
          variant="primary"
          data-testid="advanced-continue"
          @click="state = 'open'"
        >
          {{ t('actions.continue') }}
        </StyledButton>
      </div>
    </BaseCard>
    <slot v-if="state === 'open'" />
  </div>
</template>

<style scoped>
.chevron {
  background: none;
  border: none;
  color: var(--color-grey-300);
  font-size: var(--text-xl);
  cursor: pointer;
  padding: var(--space-2) var(--space-4);
  line-height: 1;
  display: inline-block;
  text-align: center;
  transform: rotate(90deg);
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.chevron.open {
  transform: rotate(-90deg);
}

.chevron:hover {
  color: var(--color-grey-300);
}

p {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-grey-400);
}

.actions {
  display: flex;
  gap: var(--space-2);
}
</style>
