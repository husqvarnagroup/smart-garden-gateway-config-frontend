<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { getCloudConnectionEnabled, setCloudConnectionEnabled } from '@/services/cloudConnection';
import SettingToggle from '@/components/SettingToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingToggle
    :label="t('cloudConnection.label')"
    :description="t('cloudConnection.description')"
    :load="getCloudConnectionEnabled"
    :save="setCloudConnectionEnabled"
  />
</template>
