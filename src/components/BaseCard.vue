<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--color-white);
  box-shadow: 0 1px 2px 0 var(--color-shadow-sm);
  border: var(--border-sm) solid var(--color-shadow-sm);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  border-radius: 0;
}

.card:first-child {
  margin-top: 0;
}
</style>
