<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import LoginForm from '@/components/LoginForm.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';
</script>

<template>
  <BaseLayout>
    <div class="container">
      <div class="logo-container">
        <img src="/GARDENA-smart-system.png" alt="GARDENA smart system" class="logo" />
      </div>
      <LoginForm />
      <GatewayVersion />
    </div>
  </BaseLayout>
</template>

<style scoped>
.container {
  width: 100%;
}

.logo-container {
  text-align: center;
  padding: var(--space-4) 0;
}

.logo {
  width: 240px;
  height: auto;
}
</style>
