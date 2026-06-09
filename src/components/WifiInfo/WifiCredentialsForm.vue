<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PasswordField from '@/components/PasswordField.vue';
import { OPEN_WIFI_SECURITY } from '@/components/WifiInfo/constants';

defineProps<{
  showManualNetworkName: boolean;
  showManualSecurity: boolean;
  securityOptions: string[];
  isPasswordFieldVisible: boolean;
  disabled: boolean;
}>();

const hiddenNetworkName = defineModel<string>('hiddenNetworkName', { required: true });
const security = defineModel<string>('security', { required: true });
const password = defineModel<string>('password', { required: true });

const { t } = useTranslation();

const securityLabel = (value: string) =>
  value === OPEN_WIFI_SECURITY ? t('network.security.none') : value;
</script>

<template>
  <div v-if="showManualNetworkName" class="field">
    <label>{{ t('network.label') }}</label>
    <input
      v-model="hiddenNetworkName"
      type="text"
      data-testid="hidden-network-name"
      :placeholder="t('network.name.placeholder')"
      :disabled="disabled"
    />
  </div>
  <div v-if="showManualSecurity" class="field">
    <label>{{ t('network.security.label') }}</label>
    <DropdownSelect
      :model-value="security"
      :options="securityOptions"
      :disabled="disabled"
      @change="security = $event"
    >
      <template #value="{ value }">{{ securityLabel(value) }}</template>
      <template #option="{ option }">{{ securityLabel(option) }}</template>
    </DropdownSelect>
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
