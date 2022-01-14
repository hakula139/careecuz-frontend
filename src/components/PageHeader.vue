<template>
  <a-layout-header class="sticky top-0 z-50 flex items-center justify-between px-4">
    <a-button
      type="text"
      @click="$router.push({ name: 'NotificationList' })"
    >
      <template #icon>
        <bell-outlined class="text-header" />
      </template>
    </a-button>
    <span
      class="text-header"
      @click="$router.push({ name: 'ChannelList' })"
    >
      {{ META_INFO.TITLE }}
    </span>
    <a-button
      type="text"
      @click="$router.push({ name: 'MyProfile' })"
    >
      <template #icon>
        <user-outlined class="text-header" />
      </template>
    </a-button>
  </a-layout-header>
</template>

<script setup lang="ts">
// #region imports

import { META_INFO } from '@/configs';

// #endregion
</script>

<style scoped>
.text-header {
  @apply text-2xl text-white;
}
</style>
