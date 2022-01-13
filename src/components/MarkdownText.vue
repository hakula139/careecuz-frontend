<!-- eslint-disable vue/no-v-html -->

<template>
  <div
    class="markdown-body"
    v-html="renderText(text)"
  />
</template>

<script setup lang="ts">
// #region imports

import { renderText } from '@/composables';

// #endregion

defineProps<{
  text: string;
}>();
</script>
