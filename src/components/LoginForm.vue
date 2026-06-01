<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import PasswordField from '@/components/PasswordField.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();

const router = useRouter();
const { authState, login } = useAuth();
const toast = useToast();

const password = ref('');

const onSubmit = async () => {
  try {
    await login(password.value);
    await router.push('/');
  } catch (error) {
    console.error(error);
    toast.error(t('error.general', { verb: t('actions.login') }));
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <PasswordField
      v-model="password"
      :label="t('login.password.label')"
      :placeholder="t('login.password.placeholder')"
      autocomplete="current-password"
    />
    <p v-if="authState.error" class="error">{{ authState.error }}</p>
    <StyledButton
      type="submit"
      variant="primary"
      :disabled="authState.loading || password.length === 0"
    >
      {{ authState.loading ? t('actions.signingIn') : t('actions.login') }}
    </StyledButton>
  </form>
</template>

<style scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.error {
  color: var(--color-red-700);
  margin: 0;
}
</style>
