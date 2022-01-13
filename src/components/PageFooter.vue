<template>
  <a-layout-footer class="px-2 text-center text-gray-500">
    &copy; {{ currentYear }} {{ META_INFO.TITLE }}
    | Made with
    <heart-filled class="text-red-500" />
    by {{ META_INFO.AUTHOR }}
  </a-layout-footer>
</template>

<script setup lang="ts">
// #region imports

import { META_INFO } from '@/configs';

// #endregion

const currentYear = new Date().getFullYear();
</script>
