<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import WebsocketToggle from '@/components/WebsocketToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <section>
    <h2>{{ t('localApi.label') }}</h2>
    <div class="rows">
      <WebsocketToggle />
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--space-4);
}

.rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
