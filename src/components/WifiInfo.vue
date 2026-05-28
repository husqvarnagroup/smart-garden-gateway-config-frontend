<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { getCurrentWifi, wifiScan, setWifi, type WifiNetwork } from '@/services/wifi';
import { useLoading } from '@/composables/useLoading';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect.vue';
import WifiSignal from '@/components/WifiSignal.vue';
import WifiLockIcon from '@/components/WifiLockIcon.vue';

const { t } = useTranslation();

const { withLoading, loading, error } = useLoading();
const selectedSsid = ref<string>('');
const currentSecurity = ref<string>('');
const scannedNetworks = ref<WifiNetwork[]>([]);
const changeError = ref<string | null>(null);

const HIDDEN_WIFI_LABEL = 'Hidden Wifi';
const isHidden = (ssid: string) => !ssid || [...ssid].every((c) => c.charCodeAt(0) === 0);
const normaliseSsid = (ssid: string) => (isHidden(ssid) ? HIDDEN_WIFI_LABEL : ssid);

const fetchCurrentWifi = () =>
  withLoading(async () => {
    const wifiConfig = await getCurrentWifi();
    selectedSsid.value = normaliseSsid(wifiConfig.ssid);
    currentSecurity.value = wifiConfig.key_mgmt;
  });

const scanWifiNetworks = async (): Promise<string[]> => {
  const networks = await wifiScan();
  scannedNetworks.value = networks;
  return networks.map((network) => normaliseSsid(network.ssid));
};

const onWifiChange = async (ssid: string) => {
  const previous = selectedSsid.value;
  const security =
    scannedNetworks.value.find((network) => normaliseSsid(network.ssid) === ssid)?.security ?? '';
  changeError.value = null;
  try {
    if (ssid === HIDDEN_WIFI_LABEL) {
      // TODO:  SA-3020: handle hidden network selection
    } else {
      await setWifi(ssid, security, '');
    }
    selectedSsid.value = ssid;
    currentSecurity.value = security || 'none';
  } catch (e) {
    changeError.value = e instanceof Error ? e.message : 'Failed to connect to network';
    selectedSsid.value = previous;
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

onMounted(() => {
  fetchCurrentWifi().catch(() => {});
});
</script>

<template>
  <BaseCard>
    <h2>{{ t('main.networks.network.label') }}</h2>

    <p v-if="loading">Loading…</p>

    <template v-else-if="error">
      <p>Failed to load wifi data: {{ error }}</p>
      <button @click="fetchCurrentWifi().catch(() => {})">Retry</button>
    </template>

    <template v-else>
      <DropdownSelect
        v-model="selectedSsid"
        :load-options="scanWifiNetworks"
        @change="onWifiChange"
      >
        <template #value="{ value }">
          <div class="wifi-option">
            <WifiSignal :signal="getSignal(value)" />
            <span class="wifi-option__name">{{ value }}</span>
            <WifiLockIcon :locked="isSecured(currentSecurity)" />
          </div>
        </template>
        <template #option="{ option }">
          <div class="wifi-option">
            <WifiSignal :signal="getSignal(option)" />
            <span class="wifi-option__name">{{ option }}</span>
            <WifiLockIcon :locked="isSecured(getOptionSecurity(option))" />
          </div>
        </template>
      </DropdownSelect>
      <p v-if="changeError">Failed to connect: {{ changeError }}</p>
    </template>
  </BaseCard>
</template>

<style scoped>
.wifi-option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
}

.wifi-option__name {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
