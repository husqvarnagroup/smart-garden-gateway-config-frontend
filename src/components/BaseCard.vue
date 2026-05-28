<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  -webkit-box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  border: 1px solid rgba(34, 36, 38, 0.15);
  padding: 16px;
  margin: 16px 0;
  border-radius: 0;
}

.card:first-child {
  margin-top: 0;
}
</style>
