<template>
  <a-layout class="w-full h-screen overflow-y-auto">
    <a-layout-header class="sticky top-0 z-50 flex items-center justify-center">
      <span class="text-2xl text-white">{{ META_INFO.TITLE }}</span>
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
// #region imports

import { META_INFO } from '@/configs';

// #endregion
</script>
