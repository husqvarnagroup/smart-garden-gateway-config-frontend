<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import {
  getCurrentWifi,
  wifiScan,
  setWifi,
  type WifiConfig,
  type WifiNetwork,
} from '@/services/wifi';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import WifiSignal from '@/components/WifiSignal.vue';
import WifiLockIcon from '@/components/WifiLockIcon.vue';

const { t } = useTranslation();
const toast = useToast();

const { loading, data, load } = useAsync<WifiConfig>();
const scannedNetworks = ref<WifiNetwork[]>([]);

const HIDDEN_WIFI_LABEL = 'Hidden Wifi';
const isHidden = (ssid: string) => !ssid || [...ssid].every((c) => c.charCodeAt(0) === 0);
const normaliseSsid = (ssid: string) => (isHidden(ssid) ? HIDDEN_WIFI_LABEL : ssid);

const scanWifiNetworks = async (): Promise<string[]> => {
  const networks = await wifiScan();
  scannedNetworks.value = networks;
  return networks.map((network) => normaliseSsid(network.ssid));
};

const onWifiChange = async (ssid: string) => {
  const previous = data.value;
  const security =
    scannedNetworks.value.find((network) => normaliseSsid(network.ssid) === ssid)?.security ?? '';
  try {
    if (ssid === HIDDEN_WIFI_LABEL) {
      // TODO: SA-3020: handle hidden network selection
    } else {
      await setWifi(ssid, security, '');
    }
    data.value = { ssid, key_mgmt: security || 'none' };
  } catch (error) {
    console.error(error);
    data.value = previous;
    toast.error(t('main.networks.connect.failed'));
  }
};

const getSignal = (ssid: string) =>
  scannedNetworks.value.find((n) => normaliseSsid(n.ssid) === ssid)?.signal;
const isSecured = (security: string | null | undefined): boolean => {
  if (security === null || security === undefined) return false;
  return security !== 'none';
};
const getOptionSecurity = (ssid: string) =>
  scannedNetworks.value.find((n) => normaliseSsid(n.ssid) === ssid)?.security;

onMounted(async () => {
  try {
    await load(getCurrentWifi);
  } catch (error) {
    console.error(error);
    toast.error(t('main.networks.loading.failed'));
  }
});
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.networks.network.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else>
      <DropdownSelect
        :model-value="normaliseSsid(data?.ssid ?? '')"
        :load-options="scanWifiNetworks"
        @change="onWifiChange"
      >
        <template #value="{ value }">
          <div class="option">
            <WifiSignal :signal="getSignal(value)" />
            <span class="name">{{ value }}</span>
            <WifiLockIcon :locked="isSecured(data?.key_mgmt)" />
          </div>
        </template>
        <template #option="{ option }">
          <div class="option">
            <WifiSignal :signal="getSignal(option)" />
            <span class="name">{{ option }}</span>
            <WifiLockIcon :locked="isSecured(getOptionSecurity(option))" />
          </div>
        </template>
      </DropdownSelect>
    </template>
  </BaseCard>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--space-1);
}

.name {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
