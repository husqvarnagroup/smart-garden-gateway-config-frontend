<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
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
  <BaseLayout>
    <section>
      <h1>Gateway</h1>
      <SystemInfo />
      <TimezoneInfo />
      <WifiInfo />
      <button type="button" @click="onLogout">Logout</button>
    </section>
  </BaseLayout>
</template>

<style scoped>
button {
  width: fit-content;
  font: inherit;
  padding: 0.75rem 1rem;
}
</style>
