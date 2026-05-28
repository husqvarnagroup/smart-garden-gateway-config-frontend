<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import StyledButton from '@/components/StyledButton.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo.vue';
import HomekitInfo from '@/components/HomekitInfo.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';

const { t } = useTranslation();

const { logout } = useAuth();
</script>

<template>
  <BaseLayout>
    <section class="content">
      <TimezoneInfo />
      <WifiInfo />
      <HomekitInfo />
      <StyledButton type="button" variant="primary" @click="logout">
        {{ t('main.logout.button') }}
      </StyledButton>
      <GatewayVersion />
    </section>
  </BaseLayout>
</template>

<style scoped>
.content {
  padding: 16px;
}
</style>
