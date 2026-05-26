<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { isAuthenticated } = useAuth();

watch(isAuthenticated, (authenticated) => {
  if (!authenticated && route.meta.requiresAuth) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
