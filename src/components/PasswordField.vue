<script setup lang="ts">
const model = defineModel<string>({ default: '' });

defineProps<{
  label: string;
  placeholder?: string;
}>();
</script>

<template>
  <div class="field">
    <label class="field__label">{{ label }}</label>
    <input v-model="model" type="password" class="field__input" :placeholder="placeholder" />
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-weight: 700;
}

.field__input {
  padding: 12px 16px;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  background: #fff;
  font: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field__input::placeholder {
  color: #aaa;
}
</style>
