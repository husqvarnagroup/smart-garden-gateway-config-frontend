<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { useAuth } from '@/composables/useAuth';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const { authState, logout } = useAuth();
</script>

<template>
  <StyledButton
    type="button"
    variant="primary"
    :disabled="authState.loading"
    :loading="authState.loading"
    @click="logout"
  >
    {{ t('actions.logout') }}
  </StyledButton>
</template>
