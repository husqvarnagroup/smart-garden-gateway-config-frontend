<script setup lang="ts">
import { ref } from 'vue';

import SkeletonBlock from '@/components/SkeletonBlock.vue';

const logoLoaded = ref(false);

const onLoad = () => {
  logoLoaded.value = true;
};
</script>

<template>
  <div class="logo" :aria-busy="!logoLoaded">
    <SkeletonBlock v-if="!logoLoaded" class="placeholder" width="100%" height="100%" />
    <img
      src="/GARDENA-smart-system.png"
      alt="GARDENA smart system"
      width="4025"
      height="1466"
      decoding="async"
      fetchpriority="high"
      :class="{ loaded: logoLoaded }"
      @load="onLoad"
    />
  </div>
</template>

<style scoped>
.logo {
  width: 240px;
  aspect-ratio: 4025 / 1466;
  position: relative;
}

.placeholder,
img {
  position: absolute;
  inset: 0;
}

.placeholder {
  border-radius: var(--radius-md);
}

img {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 160ms ease-in-out;
}

img.loaded {
  opacity: 1;
}
</style>
