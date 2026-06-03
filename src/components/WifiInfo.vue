<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import {
  getCurrentWifi,
  wifiScan,
  setWifi,
  type WifiConfig,
  type WifiNetwork,
  resetWifi,
} from '@/services/wifi';
import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import PasswordField from '@/components/PasswordField.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import WifiSignal from '@/components/WifiSignal.vue';
import WifiLockIcon from '@/components/WifiLockIcon.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();

const { pending: wifiLoading, run: runWifiLoad } = useAsync();
const { run: runWifiScan } = useAsync();
const {
  current: currentWifiConfig,
  saving: isWifiSaving,
  init: initWifiConfig,
  change: changeWifiConfig,
  saveWithRollback: saveWifiConfigWithRollback,
} = useOptimisticSubmit<WifiConfig>();
const scannedWifiNetworks = ref<WifiNetwork[]>([]);

const password = ref('');
const resettingWifi = ref(false);
const hiddenNetworkName = ref('');

const HIDDEN_WIFI_LABEL = 'Hidden Wifi';
const isHidden = (ssid: string) => !ssid || [...ssid].every((c) => c.charCodeAt(0) === 0);
const normaliseSsid = (ssid: string) => (isHidden(ssid) ? HIDDEN_WIFI_LABEL : ssid);

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
  return currentWifiConfig.value?.ssid === HIDDEN_WIFI_LABEL;
});

const isPasswordFieldVisible = computed(() => {
  const selectedNetwork = currentWifiConfig.value;
  if (!selectedNetwork) {
    return false;
  }
  return selectedNetwork.key_mgmt !== 'none';
});

const scanWifiNetworks = async (): Promise<string[]> => {
  const networks = await runWifiScan(wifiScan);
  scannedWifiNetworks.value = networks;
  return networks.map((network) => normaliseSsid(network.ssid));
};

const onWifiChange = (ssid: string) => {
  const security = scannedWifiNetworks.value.find(
    (network) => normaliseSsid(network.ssid) === ssid,
  )?.security;
  changeWifiConfig({
    ssid,
    key_mgmt: security || 'none',
  });
  password.value = '';
};

const getSignal = (ssid: string) =>
  scannedWifiNetworks.value.find((n) => normaliseSsid(n.ssid) === ssid)?.signal;
const isSecured = (security: string | null | undefined): boolean => {
  if (security === null || security === undefined) return false;
  return security !== 'none';
};
const getOptionSecurity = (ssid: string) =>
  scannedWifiNetworks.value.find((n) => normaliseSsid(n.ssid) === ssid)?.security;

onMounted(async () => {
  try {
    const wifi = await runWifiLoad(getCurrentWifi);
    initWifiConfig(wifi);
  } catch (error) {
    console.error(error);
    toast.error(t('error.update', { feature: t('network.label') }));
  }
});

const saveWifi = async () => {
  const ssid = currentWifiConfig?.value?.ssid;
  const security = currentWifiConfig.value?.key_mgmt;
  if (!ssid || !security) {
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
    toast.error(t('error.connect', { feature: t('network.label') }));
  }
};

const resetWifiConfig = async () => {
  resettingWifi.value = true;
  try {
    await resetWifi();
    hiddenNetworkName.value = '';
    password.value = '';
    toast.success(t('success.reset', { feature: t('network.label') }));
  } catch (error) {
    console.error(error);
    toast.error(t('error.reset', { feature: t('network.label') }));
  } finally {
    resettingWifi.value = false;
  }
};
</script>

<template>
  <BaseCard>
    <h2>{{ t('network.label') }}</h2>
    <div class="wifi">
      <DropdownSelect
        :disabled="wifiLoading || isWifiSaving"
        :model-value="normaliseSsid(currentWifiConfig?.ssid ?? '')"
        :load-options="scanWifiNetworks"
        @change="onWifiChange"
      >
        <template #value="{ value }">
          <div class="option">
            <WifiSignal :loading="wifiLoading && !currentWifiConfig" :signal="getSignal(value)" />
            <SkeletonBlock
              v-if="wifiLoading && !currentWifiConfig"
              class="name-skeleton"
              width="45%"
              height="var(--text-lg)"
            />
            <template v-else>
              <span class="name">{{ value }}</span>
              <WifiLockIcon :locked="isSecured(currentWifiConfig?.key_mgmt)" />
            </template>
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
      <div v-if="isHiddenNetworkSelected" class="field">
        <label>{{ t('network.label') }}</label>
        <input
          type="text"
          v-model="hiddenNetworkName"
          :placeholder="t('network.name.placeholder')"
          :disabled="wifiLoading || isWifiSaving"
        />
      </div>
      <div v-if="isPasswordFieldVisible">
        <PasswordField
          v-model="password"
          :label="t('login.password.label')"
          :placeholder="t('network.password.placeholder')"
          :disabled="wifiLoading || isWifiSaving"
          autocomplete="new-password"
        />
      </div>
      <StyledButton
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

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field label {
  font-weight: 700;
}

.field input {
  padding: var(--space-3) var(--space-4);
  border: var(--border-sm) solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field input::placeholder {
  color: var(--color-grey-300);
}

.name-skeleton {
  flex: 1;
  max-width: 100%;
}

.saving {
  flex-shrink: 0;
}
</style>
