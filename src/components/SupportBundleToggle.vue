<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { getSupportBundleConsent, setSupportBundleConsent } from '@/services/supportBundle';
import SettingToggle from '@/components/SettingToggle.vue';

const { t } = useTranslation();
</script>

<template>
  <SettingToggle
    :label="t('supportBundle.label')"
    :description="t('supportBundle.description')"
    :load="getSupportBundleConsent"
    :save="setSupportBundleConsent"
  />
</template>
