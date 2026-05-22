<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import SystemInfo from '@/components/SystemInfo.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo.vue';

const router = useRouter();
const { logout } = useAuth();

const onLogout = async () => {
  await logout();
  await router.push('/login');
};
</script>

<template>
  <main>
    <section>
      <h1>Gateway</h1>
      <SystemInfo />
      <TimezoneInfo />
      <WifiInfo />
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
