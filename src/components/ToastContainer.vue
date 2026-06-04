<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type" role="alert">
        <span class="message">{{ toast.message }}</span>
        <button class="dismiss" :aria-label="`Dismiss ${toast.type}`" @click="dismiss(toast.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 9999;
  max-width: 360px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: 1.5;
  box-shadow: 0 2px 8px var(--color-shadow-md);
  pointer-events: all;
}

.toast.error {
  background: var(--color-red-50);
  border-left: 3px solid var(--color-red-600);
  color: var(--color-red-700);
}

.toast.success {
  background: var(--color-green-50);
  border-left: 3px solid var(--color-green-600);
  color: var(--color-green-600);
}

.toast.info {
  background: var(--color-blue-50);
  border-left: 3px solid var(--color-blue-500);
  color: var(--color-blue-500);
}

.message {
  flex: 1;
}

.dismiss {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--text-lg);
  line-height: 1;
  padding: 0;
  color: inherit;
  opacity: 0.6;
  flex-shrink: 0;
}

.dismiss:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
