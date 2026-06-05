<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import type { WifiNetwork } from '@/services/wifi';

import WifiNetworkOption from './WifiNetworkOption.vue';

const props = defineProps<{
  modelValue: string;
  currentSecurity?: string | null;
  networks: WifiNetwork[];
  loading: boolean;
  disabled: boolean;
  hasCurrentWifi: boolean;
  loadOptions: () => Promise<string[]>;
}>();

const emit = defineEmits<{
  change: [ssid: string];
}>();

const isSelectLoading = computed(() => props.loading && !props.hasCurrentWifi);

const getScannedNetwork = (ssid: string) => props.networks.find((network) => network.ssid === ssid);

const getSignal = (ssid: string) => getScannedNetwork(ssid)?.signal;
const getOptionSecurity = (ssid: string) => getScannedNetwork(ssid)?.security;
const isSecured = (security: string | null | undefined): boolean => {
  if (security === null || security === undefined) return false;
  return security !== 'none';
};
</script>

<template>
  <DropdownSelect
    :disabled="disabled"
    :model-value="modelValue"
    :load-options="loadOptions"
    @change="emit('change', $event)"
  >
    <template #value="{ value }">
      <SkeletonBlock
        v-if="isSelectLoading"
        class="select-skeleton"
        width="100%"
        height="var(--text-lg)"
      />
      <WifiNetworkOption
        v-else-if="hasCurrentWifi"
        :name="value"
        :signal="getSignal(value)"
        :locked="isSecured(currentSecurity)"
      />
    </template>
    <template #option="{ option }">
      <WifiNetworkOption
        :name="option"
        :signal="getSignal(option)"
        :locked="isSecured(getOptionSecurity(option))"
      />
    </template>
  </DropdownSelect>
</template>

<style scoped>
.select-skeleton {
  max-width: 100%;
}
</style>
