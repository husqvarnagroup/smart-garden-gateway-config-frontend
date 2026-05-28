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
  listError,
  toggle,
  retry,
  select,
  onKeydown,
} = useDropdownSelect(props, emit);
</script>

<template>
  <div class="base-select" :class="{ 'base-select--disabled': disabled }">
    <button
      ref="triggerRef"
      type="button"
      class="base-select__trigger"
      :aria-expanded="open"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="base-select__value">
        <slot name="value" :value="modelValue">{{ selectedLabel }}</slot>
      </span>
      <span class="base-select__arrow" aria-hidden="true">&#9660;</span>
    </button>

    <OptionsList
      v-if="open"
      ref="listRef"
      :options="resolvedOptions"
      :loading="listLoading"
      :error="listError"
      :model-value="modelValue"
      :highlighted="highlighted"
      @select="select"
      @retry="retry"
    >
      <template v-if="$slots.option" #option="{ option }">
        <slot name="option" :option="option" />
      </template>
    </OptionsList>
  </div>
</template>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
  font-size: 1rem;
}

.base-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 6px 8px;
  font-size: 1rem;
  background: #fff;
  border: 1px solid rgba(34, 36, 38, 0.35);
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.base-select--disabled .base-select__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-select__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.base-select__arrow {
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 0.7rem;
  color: #666;
}
</style>
