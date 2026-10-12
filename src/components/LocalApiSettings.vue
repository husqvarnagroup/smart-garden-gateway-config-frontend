<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import SettingsSection from '@/components/SettingsSection.vue';
import WebsocketToggle from '@/components/WebsocketToggle.vue';
import CloudConnectionToggle from '@/components/CloudConnectionToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingsSection :title="t('localApi.label')">
    <WebsocketToggle />
    <CloudConnectionToggle />
  </SettingsSection>
</template>
