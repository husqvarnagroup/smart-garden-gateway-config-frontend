<template>
  <span class="spinner" aria-label="Loading" />
</template>

<style scoped>
.spinner {
  display: block;
  width: 1em;
  height: 1em;
  border: 2px solid rgba(128, 128, 128, 0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
