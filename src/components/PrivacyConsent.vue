<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import SettingsSection from '@/components/SettingsSection.vue';
import TelemetryToggle from '@/components/TelemetryToggle.vue';
import SupportBundleToggle from '@/components/SupportBundleToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingsSection :title="t('privacy.label')">
    <TelemetryToggle />
    <SupportBundleToggle />
  </SettingsSection>
</template>
