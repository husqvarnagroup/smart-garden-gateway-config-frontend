<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import StyledButton from '@/components/StyledButton.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo.vue';

const { logout } = useAuth();

</script>

<template>
  <BaseLayout>
    <section>
      <h1>Gateway</h1>
      <SystemInfo />
      <TimezoneInfo />
      <WifiInfo />
      <StyledButton type="button" variant="primary" @click="logout">Logout</StyledButton>
    </section>
  </BaseLayout>
</template>

<style scoped>
main {
  display: grid;
  min-height: 100vh;
  place-items: center;
}
</style>
