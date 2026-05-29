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
  <div :class="{ disabled }">
    <button
      ref="triggerRef"
      type="button"
      :aria-expanded="open"
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
div {
  position: relative;
  width: 100%;
  font-size: var(--text-base);
}

button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-2);
  font-size: var(--text-base);
  background: var(--color-white);
  border: 1px solid var(--color-shadow-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
}

.disabled button {
  opacity: 0.5;
  cursor: not-allowed;
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
