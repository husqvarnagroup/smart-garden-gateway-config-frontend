<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { authState, login } = useAuth()

const password = ref('')

const onSubmit = async () => {
  if (!password.value) {
    console.warn("Failed to login: No password.");
    return
  }

  try {
    await login(password.value)
    await router.push('/')
  } catch (error) {
    console.error("Failed to login:", error);
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="onSubmit">
      <h1>Login</h1>
      <input v-model="password" type="password" autocomplete="current-password" required />
      <p v-if="authState.error" class="error">{{ authState.error }}</p>
      <button type="submit" :disabled="authState.loading">
        {{ authState.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
main {
  display: grid;
  min-height: 100vh;
  place-items: center;
}

form {
  width: min(100%, 24rem);
  display: grid;
  gap: 1rem;
}

input,
button {
  font: inherit;
  padding: 0.75rem;
}

p {
  color: #b42318;
}
</style>
