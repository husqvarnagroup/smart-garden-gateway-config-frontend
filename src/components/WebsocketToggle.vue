<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { getWebsocketEnabled, setWebsocketEnabled } from '@/services/websocket';
import SettingToggle from '@/components/SettingToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingToggle
    :label="t('websocket.label')"
    :description="t('websocket.description')"
    :load="getWebsocketEnabled"
    :save="setWebsocketEnabled"
  />
</template>
