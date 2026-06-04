<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { addSshKey, getSshEnabled, setSshEnabled } from '@/services/ssh';
import { useAsync } from '@/composables/useAsync';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import SkeletonBlock from '@/components/SkeletonBlock.vue';
import StyledButton from '@/components/StyledButton.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

const { t } = useTranslation();
const toast = useToast();
const { pending: loading, run: runLoad } = useAsync(true);
const { current: enabled, saving, init, change, saveWithRollback } = useOptimisticSubmit<boolean>();
const { run: runAddSshKey, pending: savingSshKey } = useAsync();

const publicKey = ref('');

const toggle = async (newValue: boolean) => {
  change(newValue);
  try {
    await saveWithRollback(() => setSshEnabled(newValue));
    toast.success(
      newValue
        ? t('success.enable', { feature: t('ssh.label') })
        : t('success.disable', { feature: t('ssh.label') }),
    );
  } catch {
    toast.error(t('error.update', { feature: t('ssh.label') }));
  }
};

const submitKey = async () => {
  try {
    await runAddSshKey(() => addSshKey(publicKey.value));
    toast.success(t('success.add', { feature: t('ssh.key.label') }));
    publicKey.value = '';
  } catch {
    toast.error(t('error.add', { feature: t('ssh.key.label') }));
  }
};

onMounted(async () => {
  try {
    const config = await runLoad(getSshEnabled);
    init(config.enabled);
  } catch {
    init(false);
    toast.error(t('error.load', { feature: t('ssh.label') }));
  }
});
</script>

<template>
  <BaseCard>
    <div class="row">
      <h2>{{ t('ssh.label') }}</h2>
      <SkeletonBlock v-if="loading" width="44px" height="24px" />
      <ToggleSwitch
        v-else
        :label="t('ssh.label')"
        :model-value="enabled ?? false"
        :loading="saving"
        @update:model-value="toggle"
      />
    </div>
    <div class="key">
      <h3>{{ t('ssh.key.label') }}</h3>
      <textarea
        id="ssh-key-input"
        v-model="publicKey"
        :aria-label="t('ssh.key.label')"
        :placeholder="t('ssh.key.placeholder')"
        rows="3"
      />
      <StyledButton
        type="button"
        variant="primary"
        data-testid="add-ssh-key"
        :disabled="!publicKey.trim() || savingSshKey"
        :loading="savingSshKey"
        @click="submitKey"
      >
        {{ t('actions.add', { feature: t('ssh.key.label') }) }}
      </StyledButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.key {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

h3 {
  font-size: var(--text-sm);
  font-weight: 700;
  margin: 0;
  color: var(--color-grey-400);
}

textarea {
  padding: var(--space-3) var(--space-4);
  border: var(--border-sm) solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  font: inherit;
  resize: vertical;
  box-sizing: border-box;
  width: 100%;
}

textarea::placeholder {
  color: var(--color-grey-300);
}
</style>
