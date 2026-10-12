<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { getTelemetryConsent, setTelemetryConsent } from '@/services/telemetry';
import SettingToggle from '@/components/SettingToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingToggle
    :label="t('telemetry.label')"
    :description="t('telemetry.description')"
    :load="getTelemetryConsent"
    :save="setTelemetryConsent"
  />
</template>
