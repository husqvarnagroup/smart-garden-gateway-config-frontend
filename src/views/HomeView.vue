<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo.vue';
import HomekitInfo from '@/components/HomekitInfo.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import WebsocketToggle from '@/components/WebsocketToggle.vue';
import AdvancedFeatures from '@/components/AdvancedFeatures.vue';
</script>

<template>
  <BaseLayout>
    <section class="content">
      <TimezoneInfo />
      <WifiInfo />
      <HomekitInfo />
      <LogoutButton />
      <GatewayVersion />
      <AdvancedFeatures>
        <WebsocketToggle />
      </AdvancedFeatures>
    </section>
  </BaseLayout>
</template>
