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
import {
  ALWAYS_MANUAL_SECURITIES,
  OPEN_WIFI_SECURITY,
  OTHER_WIFI_OPTION,
  SECURED_WIFI_SECURITY,
} from '@/components/WifiInfo/constants';
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

const isManualNetworkSelected = computed(() => currentWifiConfig.value?.ssid === OTHER_WIFI_OPTION);

const toBackendSecurity = (security?: string | null): string => {
  const normalised = security?.trim();
  if (!normalised || normalised === OPEN_WIFI_SECURITY) {
    return OPEN_WIFI_SECURITY;
  }
  return SECURED_WIFI_SECURITY;
};

const hiddenDiscoveredSecurities = computed(() => {
  return scannedWifiNetworks.value
    .filter((network) => network.isHidden)
    .map((network) => network.security?.trim())
    .filter(
      (security): security is string =>
        Boolean(security) && security?.toLowerCase() !== 'unsupported',
    );
});

const manualSecurityOptions = computed(() => {
  return [...new Set([...ALWAYS_MANUAL_SECURITIES, ...hiddenDiscoveredSecurities.value])];
});

const defaultManualSecurity = computed(() => {
  return SECURED_WIFI_SECURITY;
});

const resolveManualSecuritySelection = (security?: string | null): string => {
  const value = security?.trim();
  if (!value) {
    return defaultManualSecurity.value;
  }
  const knownOptions = manualSecurityOptions.value;
  if (knownOptions.includes(value)) {
    return value;
  }
  return toBackendSecurity(value);
};

const selectedSecurity = computed(() => {
  return currentWifiConfig.value?.key_mgmt ?? '';
});

const isSaveButtonDisabled = computed(() => {
  const selectedNetwork = currentWifiConfig.value;
  if (!selectedNetwork) {
    return true;
  }

  if (isManualNetworkSelected.value && hiddenNetworkName.value.trim().length === 0) {
    return true;
  }

  const security = selectedSecurity.value;
  if (!security) {
    return true;
  }

  if (security === OPEN_WIFI_SECURITY) {
    return false;
  }

  if (password.value.length < 8 || password.value.length > 63) {
    return true;
  }

  return false;
});

const isPasswordFieldVisible = computed(() => {
  return Boolean(selectedSecurity.value && selectedSecurity.value !== OPEN_WIFI_SECURITY);
});

const showNoWifi = computed(() => !wifiLoading.value && currentWifiConfig.value === undefined);

const scanWifiNetworks = async (): Promise<string[]> => {
  const networks = await runWifiScan(getNormalisedNetworks);
  scannedWifiNetworks.value = networks;
  return networks.filter((network) => !network.isHidden).map((network) => network.ssid);
};

const onWifiChange = (ssid: string) => {
  if (ssid === OTHER_WIFI_OPTION) {
    const security =
      isManualNetworkSelected.value && currentWifiConfig.value
        ? currentWifiConfig.value.key_mgmt
        : resolveManualSecuritySelection();
    changeWifiConfig({
      ssid: OTHER_WIFI_OPTION,
      key_mgmt: security,
      isHidden: true,
    });
    password.value = '';
    return;
  }

  const selectedNetwork = scannedWifiNetworks.value.find((network) => network.ssid === ssid);
  changeWifiConfig({
    ssid,
    key_mgmt: toBackendSecurity(selectedNetwork?.security),
    isHidden: false,
  });
  password.value = '';
};

const onSecurityChange = (security: string) => {
  const selectedNetwork = currentWifiConfig.value;
  if (!selectedNetwork) {
    return;
  }
  changeWifiConfig({
    ...selectedNetwork,
    key_mgmt: security,
  });
  password.value = '';
};

const manualSecurityModel = computed({
  get: () => currentWifiConfig.value?.key_mgmt ?? '',
  set: onSecurityChange,
});

onMounted(async () => {
  try {
    const wifi = await runWifiLoad(getNormalisedWifiInfo);
    if (wifi) {
      if (wifi.isHidden) {
        initWifiConfig({
          ...wifi,
          ssid: OTHER_WIFI_OPTION,
          key_mgmt: resolveManualSecuritySelection(wifi.key_mgmt),
        });
      } else {
        initWifiConfig(wifi);
      }
    }
  } catch (error) {
    console.error(error);
    toast.error(t('error.load', { feature: t('network.label') }));
  }
});

const saveWifi = async () => {
  const ssid = isManualNetworkSelected.value
    ? hiddenNetworkName.value.trim()
    : currentWifiConfig?.value?.ssid;
  const security = selectedSecurity.value;
  if (!ssid || !security) {
    toast.error(t('error.update', { feature: t('network.label') }));
    return;
  }
  try {
    await saveWifiConfigWithRollback(() => setWifi(ssid, security, password.value));
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
        :networks="scannedWifiNetworks"
        :loading="wifiLoading"
        :has-current-wifi="Boolean(currentWifiConfig)"
        :load-options="scanWifiNetworks"
        @change="onWifiChange"
      />
      <WifiCredentialsForm
        v-model:hidden-network-name="hiddenNetworkName"
        v-model:security="manualSecurityModel"
        v-model:password="password"
        :show-manual-network-name="isManualNetworkSelected"
        :show-manual-security="isManualNetworkSelected"
        :security-options="manualSecurityOptions"
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
