<template>
  <div class="container">
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #ececec;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  max-width: 450px;
  width: 100%;
}
</style>
