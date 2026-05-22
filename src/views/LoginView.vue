<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import StyledButton from '@/components/StyledButton.vue';
import PasswordField from '@/components/PasswordField.vue';

const router = useRouter();
const { authState, login } = useAuth();

const password = ref('');

const onSubmit = async () => {
  if (!password.value) {
    console.warn('Failed to login: No password.');
    return;
  }

  try {
    await login(password.value);
    await router.push('/');
  } catch (error) {
    console.error('Failed to login:', error);
  }
};
</script>

<template>
  <BaseLayout>
    <form @submit.prevent="onSubmit">
      <h1>Login</h1>
      <PasswordField v-model="password" label="Password" placeholder="Admin password" />
      <p v-if="authState.error" class="error">{{ authState.error }}</p>
      <StyledButton type="submit" variant="primary" :disabled="authState.loading">
        {{ authState.loading ? 'Signing in...' : 'Sign in' }}
      </StyledButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
form {
  width: min(100%, 24rem);
  display: grid;
  gap: 1rem;
}

p {
  color: #b42318;
}
</style>
