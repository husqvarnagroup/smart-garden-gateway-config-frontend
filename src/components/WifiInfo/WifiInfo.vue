<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { setWifi, type WifiConfig, type WifiNetwork, resetWifi } from '@/services/wifi';
import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';
import { getNormalisedNetworks, getNormalisedWifiInfo } from '@/utils/wifiUtils.ts';
import WifiCredentialsForm from './WifiCredentialsForm.vue';
import WifiNetworkSelect from './WifiNetworkSelect.vue';

const { t } = useTranslation();
const toast = useToast();

const { pending: wifiLoading, run: runWifiLoad } = useAsync(true);
const { run: runWifiScan } = useAsync();
const { pending: resettingWifi, run: runWifiReset } = useAsync();
const {
  current: currentWifiConfig,
  saving: isWifiSaving,
  init: initWifiConfig,
  change: changeWifiConfig,
  saveWithRollback: saveWifiConfigWithRollback,
} = useOptimisticSubmit<WifiConfig>();
const scannedWifiNetworks = ref<WifiNetwork[]>([]);

const password = ref('');
const hiddenNetworkName = ref('');

const isSaveButtonDisabled = computed(() => {
  const selectedNetwork = currentWifiConfig.value;
  if (!selectedNetwork) {
    return true;
  } else if (selectedNetwork.key_mgmt === 'none') {
    return false;
  } else if (password.value.length < 8 || password.value.length > 63) {
    return true;
  }
  return false;
});

const isHiddenNetworkSelected = computed(() => {
  return currentWifiConfig.value?.isHidden;
});

const isPasswordFieldVisible = computed(() => {
  const selectedNetwork = currentWifiConfig.value;
  if (!selectedNetwork) {
    return false;
  }
  return selectedNetwork.key_mgmt !== 'none';
});

const showNoWifi = computed(() => !wifiLoading.value && currentWifiConfig.value === undefined);

const scanWifiNetworks = async (): Promise<string[]> => {
  const networks = await runWifiScan(getNormalisedNetworks);
  scannedWifiNetworks.value = networks;
  return networks.map((network) => network.ssid);
};

const onWifiChange = (ssid: string) => {
  const selectedNetwork = scannedWifiNetworks.value.find((network) => network.ssid === ssid);
  changeWifiConfig({
    ssid,
    key_mgmt: selectedNetwork?.security || 'none',
    isHidden: selectedNetwork?.isHidden,
  });
  password.value = '';
};

onMounted(async () => {
  try {
    const wifi = await runWifiLoad(getNormalisedWifiInfo);
    if (wifi) {
      initWifiConfig(wifi);
    }
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: t('network.label') }));
  }
});

const saveWifi = async () => {
  const ssid = currentWifiConfig?.value?.ssid;
  const security = currentWifiConfig.value?.key_mgmt;
  if (!ssid || !security) {
    toast.error(t('error.update', { feature: t('network.label') }));
    return;
  }
  try {
    await saveWifiConfigWithRollback(() =>
      setWifi(
        isHiddenNetworkSelected.value ? hiddenNetworkName.value : ssid,
        security,
        password.value,
      ),
    );
    toast.success(t('success.save'));
  } catch (error) {
    console.error(error);
    toast.error(t('error.update', { feature: t('network.label') }));
  }
};

const resetWifiConfig = async () => {
  try {
    await runWifiReset(resetWifi);
    hiddenNetworkName.value = '';
    password.value = '';
    toast.success(t('success.reset', { feature: t('network.label') }));
  } catch (error) {
    console.error(error);
    toast.error(t('error.reset', { feature: t('network.label') }));
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('network.label') }}</h2>
    <div class="wifi">
      <WifiNetworkSelect
        :disabled="wifiLoading || isWifiSaving"
        :model-value="currentWifiConfig?.ssid ?? ''"
        :current-security="currentWifiConfig?.key_mgmt"
        :current-is-hidden="currentWifiConfig?.isHidden"
        :networks="scannedWifiNetworks"
        :loading="wifiLoading"
        :has-current-wifi="Boolean(currentWifiConfig)"
        :load-options="scanWifiNetworks"
        @change="onWifiChange"
      />
      <WifiCredentialsForm
        v-model:hidden-network-name="hiddenNetworkName"
        v-model:password="password"
        :is-hidden-network-selected="isHiddenNetworkSelected"
        :is-password-field-visible="isPasswordFieldVisible"
        :disabled="wifiLoading || isWifiSaving"
      />
      <p v-if="showNoWifi" class="info" data-testid="wifi-lan-info">{{ t('network.noWifi') }}</p>
      <StyledButton
        v-else
        data-testid="save-wifi"
        type="button"
        variant="primary"
        :loading="isWifiSaving"
        @click="saveWifi()"
        :disabled="isSaveButtonDisabled"
      >
        {{ t('actions.save') }}
      </StyledButton>
      <div class="divider">
        <span>{{ t('network.divider') }}</span>
      </div>
      <StyledButton
        data-testid="reset-wifi"
        type="button"
        variant="secondary"
        :loading="resettingWifi"
        @click="resetWifiConfig()"
      >
        {{ t('network.reset') }}
      </StyledButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.wifi {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-grey-400);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: var(--border-sm);
  background: var(--color-grey-200);
}

.divider span {
  flex-shrink: 0;
}

.info {
  margin: 0;
  min-height: calc(var(--space-3) * 2 + var(--space-5) + var(--space-5));
  padding: var(--space-3) 0;
  color: var(--color-grey-400);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}
</style>
