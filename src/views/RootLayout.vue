<template>
  <a-layout class="w-full h-screen overflow-y-auto">
    <a-layout-header class="flex items-center justify-center">
      <span class="text-2xl text-white title">{{ meta.title }}</span>
    </a-layout-header>
    <a-layout-content />
    <a-layout-footer class="text-center">
      &copy; {{ meta.currentYear }} {{ meta.title }}
      | Made with
      <span class="text-red-600">&hearts;</span>
      by {{ meta.author }}
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const meta = {
  title: 'CareeCuz',
  author: 'Hakula',
  currentYear: computed(() => new Date().getFullYear()),
};
</script>
