<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

<template>
  <span class="spinner" aria-label="Loading" />
</template>

<style scoped>
.spinner {
  display: block;
  width: 1.5em;
  height: 1.5em;
  box-sizing: border-box;
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
