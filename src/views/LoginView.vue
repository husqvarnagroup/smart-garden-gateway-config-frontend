<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import LoginForm from '@/components/LoginForm.vue';
import GatewayVersion from '@/components/GatewayVersion.vue';
</script>

<template>
  <BaseLayout>
    <div class="container">
      <img src="/GARDENA-smart-system.png" alt="GARDENA smart system" />
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

img {
  width: 240px;
  height: auto;
}
</style>
