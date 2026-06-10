<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import { useToast } from '@/composables/useToast';
import type { WifiNetwork } from '@/services/wifi';
import { OTHER_WIFI_OPTION } from '@/components/WifiInfo/constants';

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

const { t } = useTranslation();
const toast = useToast();

const isSelectLoading = computed(() => props.loading && !props.hasCurrentWifi);

const getScannedNetwork = (ssid: string) => props.networks.find((network) => network.ssid === ssid);

const isOtherOption = (ssid: string) => ssid === OTHER_WIFI_OPTION;

const getSignal = (ssid: string) => getScannedNetwork(ssid)?.signal;
const getOptionSecurity = (ssid: string) => getScannedNetwork(ssid)?.security;
const labelFor = (ssid: string) => (isOtherOption(ssid) ? t('network.other.label') : ssid);

const loadOptionsWithOther = async () => {
  try {
    const options = await props.loadOptions();
    if (options.includes(OTHER_WIFI_OPTION)) {
      return options;
    }
    return [...options, OTHER_WIFI_OPTION];
  } catch (error) {
    // Keep manual entry available even when scan/list loading fails.
    console.error(error);
    toast.error('Failed to load options');
    return [OTHER_WIFI_OPTION];
  }
};

const isSecured = (security: string | null | undefined): boolean => {
  if (security === null || security === undefined) return false;
  return security !== 'none';
};
</script>

<template>
  <DropdownSelect
    :disabled="disabled"
    :model-value="modelValue"
    :load-options="loadOptionsWithOther"
    :reload-on-open="true"
    @change="emit('change', $event)"
  >
    <template #value="{ value }">
      <SkeletonBlock
        v-if="isSelectLoading"
        class="select-skeleton"
        width="100%"
        height="var(--text-lg)"
      />
      <p v-else-if="isOtherOption(value)" class="other">{{ labelFor(value) }}</p>
      <WifiNetworkOption
        v-else-if="hasCurrentWifi"
        :name="labelFor(value)"
        :signal="getSignal(value)"
        :locked="isSecured(currentSecurity)"
      />
    </template>
    <template #option="{ option }">
      <p v-if="isOtherOption(option)" class="other">{{ labelFor(option) }}</p>
      <WifiNetworkOption
        v-else
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

.other {
  margin: 0;
  font-style: italic;
  color: var(--color-grey-400);
}
</style>
