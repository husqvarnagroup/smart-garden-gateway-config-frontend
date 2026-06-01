<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { addSshKey, setSshEnabled } from '@/services/ssh';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import BaseCard from '@/components/BaseCard.vue';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const toast = useToast();
const { run: runSshChange } = useAsync();
const { run: runAddSshKey, pending: savingSshKey } = useAsync();

const publicKey = ref('');

const apply = async (enable: boolean) => {
  try {
    await runSshChange(() => setSshEnabled(enable));
    toast.success(
      enable
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
</script>

<template>
  <BaseCard>
    <h2>{{ t('ssh.label') }}</h2>
    <div class="actions">
      <StyledButton type="button" variant="secondary" @click="apply(false)">
        {{ t('actions.disable') }}
      </StyledButton>
      <StyledButton type="button" variant="primary" @click="apply(true)">
        {{ t('actions.enable') }}
      </StyledButton>
    </div>
    <div class="key">
      <label for="ssh-key-input">{{ t('ssh.key.label') }}</label>
      <textarea
        id="ssh-key-input"
        v-model="publicKey"
        :placeholder="t('ssh.key.placeholder')"
        rows="3"
      />
      <StyledButton
        type="button"
        variant="primary"
        data-testid="add-ssh-key"
        :disabled="!publicKey.trim() || savingSshKey"
        @click="submitKey"
      >
        {{ t('actions.add', { feature: t('ssh.key.label') }) }}
      </StyledButton>
    </div>
  </BaseCard>
</template>

<style scoped>
.actions {
  display: flex;
  gap: var(--space-2);
}

.key {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

label {
  font-weight: 700;
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
