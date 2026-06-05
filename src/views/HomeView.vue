<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import TimezoneInfo from '@/components/TimezoneInfo.vue';
import WifiInfo from '@/components/WifiInfo/WifiInfo.vue';
import HomekitInfo from '@/components/HomekitInfo.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import WebsocketToggle from '@/components/WebsocketToggle.vue';
import AdvancedFeatures from '@/components/AdvancedFeatures.vue';
import SshSettings from '@/components/SshSettings.vue';

const { authState } = useAuth();
</script>

<template>
  <BaseLayout :disabled="authState.loading">
    <section>
      <TimezoneInfo />
      <WifiInfo />
      <HomekitInfo />
      <LogoutButton />
      <GatewayVersion />
      <AdvancedFeatures>
        <WebsocketToggle />
        <SshSettings />
      </AdvancedFeatures>
    </section>
  </BaseLayout>
</template>
