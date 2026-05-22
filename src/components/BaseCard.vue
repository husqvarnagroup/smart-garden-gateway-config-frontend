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
  padding: 14px;
  margin-bottom: 14px;
}
</style>
