<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import StyledButton from '@/components/StyledButton.vue';
import SystemInfo from '@/components/SystemInfo.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo.vue';

const { t } = useTranslation();

const { logout } = useAuth();
</script>

<template>
  <BaseLayout>
    <section>
      <h1>{{ t('title') }}</h1>
      <SystemInfo />
      <TimezoneInfo />
      <WifiInfo />
      <StyledButton type="button" variant="primary" @click="logout">{{
        t('main.logout.button')
      }}</StyledButton>
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
