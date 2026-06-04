<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import ToastContainer from '@/components/ToastContainer.vue';

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
  <ToastContainer />
</template>
