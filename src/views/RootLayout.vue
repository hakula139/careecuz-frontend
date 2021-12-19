<template>
  <a-layout
    id="app"
    class="w-full h-screen overflow-y-auto"
  >
    <a-layout-header class="sticky top-0 z-50 flex items-center justify-center">
      <span class="text-2xl text-white">{{ meta.title }}</span>
    </a-layout-header>
    <a-layout-content>
      <router-view />
      <a-layout-footer class="px-2 text-center text-gray-500">
        &copy; {{ meta.currentYear }} {{ meta.title }}
        | Made with
        <span class="text-red-600">&hearts;</span>
        by {{ meta.author }}
      </a-layout-footer>
    </a-layout-content>
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
