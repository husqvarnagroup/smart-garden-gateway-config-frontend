<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { changePassword, resetPassword } from '@/services/password';
import { useAsync } from '@/composables/useAsync';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import ExpandableCard from '@/components/ExpandableCard.vue';
import PasswordField from '@/components/PasswordField.vue';
import StyledButton from '@/components/StyledButton.vue';

const NEW_PASSWORD_MIN_LENGTH = 8;
const NEW_PASSWORD_MAX_LENGTH = 50;

const { t } = useTranslation();
const toast = useToast();
const { logout } = useAuth();

const logoutAfterPasswordUpdate = () => logout().catch(() => undefined);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const { run: runChange, pending: changing } = useAsync();

const newPasswordInvalidLength = computed(
  () =>
    newPassword.value.length > 0 &&
    (newPassword.value.length < NEW_PASSWORD_MIN_LENGTH ||
      newPassword.value.length > NEW_PASSWORD_MAX_LENGTH),
);
const passwordsMismatch = computed(
  () => confirmPassword.value.length > 0 && newPassword.value !== confirmPassword.value,
);
const canSubmitChange = computed(
  () =>
    currentPassword.value.length > 0 &&
    newPassword.value.length >= NEW_PASSWORD_MIN_LENGTH &&
    newPassword.value.length <= NEW_PASSWORD_MAX_LENGTH &&
    confirmPassword.value.length > 0 &&
    !passwordsMismatch.value,
);

const submitChange = async () => {
  try {
    await runChange(() => changePassword(currentPassword.value, newPassword.value));
    toast.success(t('success.update', { feature: t('password.label') }));
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch {
    toast.error(t('error.update', { feature: t('password.label') }));
    return;
  }
  await logoutAfterPasswordUpdate();
};

const resetCurrentPassword = ref('');
const { run: runReset, pending: resetting } = useAsync();

const submitReset = async () => {
  try {
    await runReset(() => resetPassword(resetCurrentPassword.value));
    toast.success(t('success.reset', { feature: t('password.label') }));
    resetCurrentPassword.value = '';
  } catch {
    toast.error(t('error.reset', { feature: t('password.label') }));
    return;
  }
  await logoutAfterPasswordUpdate();
};
</script>

<template>
  <ExpandableCard :title="t('password.heading')">
    <p class="description">{{ t('password.description') }}</p>
    <form class="form" @submit.prevent="submitChange">
      <PasswordField
        v-model="currentPassword"
        data-testid="password-current"
        :label="t('password.current.label')"
        autocomplete="current-password"
        :disabled="changing"
      />
      <PasswordField
        v-model="newPassword"
        data-testid="password-new"
        :label="t('password.new.label')"
        autocomplete="new-password"
        :disabled="changing"
        :minlength="NEW_PASSWORD_MIN_LENGTH"
        :maxlength="NEW_PASSWORD_MAX_LENGTH"
        :error="newPasswordInvalidLength"
      />
      <p v-if="newPasswordInvalidLength" class="hint error">{{ t('password.lengthInvalid') }}</p>
      <PasswordField
        v-model="confirmPassword"
        data-testid="password-confirm"
        :label="t('password.confirm.label')"
        autocomplete="new-password"
        :disabled="changing"
        :maxlength="NEW_PASSWORD_MAX_LENGTH"
        :error="passwordsMismatch"
      />
      <p v-if="passwordsMismatch" class="hint error">{{ t('password.mismatch') }}</p>
      <StyledButton
        type="submit"
        variant="primary"
        :disabled="!canSubmitChange || changing"
        :loading="changing"
      >
        {{ t('actions.change', { feature: t('password.label') }) }}
      </StyledButton>
    </form>

    <div class="reset">
      <p class="hint">{{ t('password.reset.description') }}</p>
      <PasswordField
        v-model="resetCurrentPassword"
        data-testid="password-reset-current"
        :label="t('password.current.label')"
        autocomplete="current-password"
        :disabled="resetting"
      />
      <StyledButton
        type="button"
        variant="secondary"
        data-testid="reset-password"
        :disabled="resetCurrentPassword.length === 0 || resetting"
        :loading="resetting"
        @click="submitReset"
      >
        {{ t('actions.reset', { feature: t('password.label') }) }}
      </StyledButton>
    </div>
  </ExpandableCard>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.reset {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-sm) solid var(--color-grey-200);
}

.description {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-grey-400);
}

.hint {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-grey-400);
}

.hint.error {
  color: var(--color-red-600);
}
</style>
