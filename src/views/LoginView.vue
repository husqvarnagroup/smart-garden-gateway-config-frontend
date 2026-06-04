<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import LoginLogo from '@/components/LoginLogo.vue';
import LoginForm from '@/components/LoginForm.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';
</script>

<template>
  <BaseLayout>
    <div class="container">
      <LoginLogo />
      <LoginForm />
      <GatewayVersion />
    </div>
  </BaseLayout>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
</style>
