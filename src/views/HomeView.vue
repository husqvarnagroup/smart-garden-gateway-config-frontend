<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const onLogout = async () => {
  logout()
  await router.push('/login')
}
</script>

<template>
  <main>
    <section>
      <h1>Home</h1>
      <p class="status">Session active</p>
      <button type="button" @click="onLogout">Logout</button>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  min-height: 100vh;
  place-items: center;
}

button {
  width: fit-content;
  font: inherit;
  padding: 0.75rem 1rem;
}
</style>
