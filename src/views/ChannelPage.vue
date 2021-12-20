<template>
  <a-page-header
    :title="channelPage.data.name"
    @back="router.go(-1)"
  />
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Channel } from '@/types';

const route = useRoute();
const router = useRouter();

// #region channel page

const channelPage = reactive({
  id: computed(() => parseInt(route.params.id as string, 10)),
  data: {
    name: '加载中...',
    messages: [],
  } as Channel,
});

// #endregion
</script>
