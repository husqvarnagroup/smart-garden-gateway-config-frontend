<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import { useAuth } from '@/composables/useAuth';
import StyledButton from '@/components/StyledButton.vue';

const { t } = useTranslation();
const { logout } = useAuth();
</script>

<template>
  <StyledButton type="button" variant="primary" @click="logout">
    {{ t('actions.logout') }}
  </StyledButton>
</template>
