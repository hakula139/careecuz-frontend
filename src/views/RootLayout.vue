<template>
  <a-layout class="w-full h-screen overflow-y-auto">
    <a-layout-header class="flex items-center justify-center">
      <span class="text-2xl text-white title">{{ metaInfo.title }}</span>
    </a-layout-header>
    <a-layout-content />
    <a-layout-footer class="text-center">
      &copy; {{ currentYear }} {{ metaInfo.title }}
      | Made with
      <span class="text-red-600">&#9829;</span>
      by {{ metaInfo.author }}
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const metaInfo = {
  title: 'CareeCuz',
  author: 'Hakula',
};

const currentYear = computed(() => new Date().getFullYear());
</script>
