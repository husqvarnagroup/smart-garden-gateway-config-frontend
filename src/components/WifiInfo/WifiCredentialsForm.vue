<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import PasswordField from '@/components/PasswordField.vue';

defineProps<{
  isHiddenNetworkSelected: boolean | undefined;
  isPasswordFieldVisible: boolean;
  disabled: boolean;
}>();

const hiddenNetworkName = defineModel<string>('hiddenNetworkName', { required: true });
const password = defineModel<string>('password', { required: true });

const { t } = useTranslation();
</script>

<template>
  <div v-if="isHiddenNetworkSelected" class="field">
    <label>{{ t('network.label') }}</label>
    <input
      v-model="hiddenNetworkName"
      type="text"
      data-testid="hidden-network-name"
      :placeholder="t('network.name.placeholder')"
      :disabled="disabled"
    />
  </div>
  <div v-if="isPasswordFieldVisible">
    <PasswordField
      v-model="password"
      :label="t('login.password.label')"
      :placeholder="t('network.password.placeholder')"
      :disabled="disabled"
      autocomplete="new-password"
    />
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field label {
  font-weight: 700;
}

.field input {
  padding: var(--space-3) var(--space-4);
  border: var(--border-sm) solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field input::placeholder {
  color: var(--color-grey-300);
}
</style>
