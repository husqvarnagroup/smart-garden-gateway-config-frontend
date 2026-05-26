<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import PasswordField from '@/components/PasswordField.vue';
import StyledButton from '@/components/StyledButton.vue';

const router = useRouter();
const { authState, login } = useAuth();

const password = ref('');

const onSubmit = async () => {
  try {
    await login(password.value);
    await router.push('/');
  } catch (error) {
    console.error('Failed to login:', error);
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <PasswordField
      v-model="password"
      label="Password"
      placeholder="Admin password"
      autocomplete="current-password"
    />
    <p v-if="authState.error" class="error">{{ authState.error }}</p>
    <StyledButton type="submit" variant="primary" :disabled="authState.loading">
      {{ authState.loading ? 'Signing in...' : 'Sign in' }}
    </StyledButton>
  </form>
</template>

<style scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 14px;
  box-sizing: border-box;
}

.error {
  color: #b42318;
  margin: 0;
}
</style>
