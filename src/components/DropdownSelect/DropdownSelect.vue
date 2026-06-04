<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import OptionsList from './OptionsList.vue';
import {
  useDropdownSelect,
  type DropdownSelectProps,
  type DropdownSelectEmits,
} from './useDropdownSelect';

const props = defineProps<DropdownSelectProps>();
const emit = defineEmits<DropdownSelectEmits>();

const {
  open,
  highlighted,
  triggerRef,
  listRef,
  resolvedOptions,
  selectedLabel,
  listLoading,
  toggle,
  select,
  onKeydown,
} = useDropdownSelect(props, emit);
</script>

<template>
  <div :class="{ disabled, open }">
    <button
      ref="triggerRef"
      type="button"
      :aria-expanded="open"
      :aria-busy="listLoading"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="value">
        <slot name="value" :value="modelValue">{{ selectedLabel }}</slot>
      </span>
      <span class="arrow" aria-hidden="true">&#9660;</span>
    </button>

    <OptionsList
      v-if="open"
      ref="listRef"
      :options="resolvedOptions"
      :loading="listLoading"
      :model-value="modelValue"
      :highlighted="highlighted"
      @select="select"
    >
      <template v-if="$slots.option" #option="{ option }">
        <slot name="option" :option="option" />
      </template>
    </OptionsList>
  </div>
</template>

<style scoped>
div {
  position: relative;
  width: 100%;
  font-size: var(--text-sm);
}

button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  font-size: var(--text-sm);
  font-weight: lighter;
  background: var(--color-white);
  border: var(--border-sm) solid var(--color-grey-200);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
  height: 2.5rem;
  padding: 0 var(--space-3);
}

.disabled button {
  opacity: 0.5;
  cursor: not-allowed;
}

.open button {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-color: var(--color-white);
}

.value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.arrow {
  flex-shrink: 0;
  margin-left: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-grey-400);
}
</style>
