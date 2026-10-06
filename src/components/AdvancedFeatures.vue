<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';

import ExpandableCard from '@/components/ExpandableCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const open = ref(false);
const confirmed = ref(false);

watch(open, (isOpen) => {
  if (!isOpen) confirmed.value = false;
});
</script>

<template>
  <ExpandableCard v-model:open="open" :title="t('advanced.label')">
    <template v-if="!confirmed">
      <p class="warning">{{ t('advanced.confirm') }}</p>
      <StyledButton
        type="button"
        variant="primary"
        data-testid="advanced-continue"
        @click="confirmed = true"
      >
        {{ t('actions.continue') }}
      </StyledButton>
    </template>
    <div v-else class="sections">
      <slot />
    </div>
  </ExpandableCard>
</template>

<style scoped>
.warning {
  margin: 0 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-grey-400);
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sections :slotted(section:not(:first-child)) {
  padding-top: var(--space-4);
  border-top: var(--border-sm) solid var(--color-grey-200);
}
</style>
