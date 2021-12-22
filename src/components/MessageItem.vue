<template>
  <a-comment>
    <template #author>
      <span>{{ getUsername(data.user.userId) }}</span>
    </template>
    <template #avatar>
      <a-avatar size="large">
        {{ getUsername(data.user.userId)[0] }}
      </a-avatar>
    </template>
    <template #content>
      <p>{{ data.content }}</p>
    </template>
    <template #datetime>
      <span>{{ data.time }}</span>
    </template>
  </a-comment>
</template>

<script setup lang="ts">
// #region imports

import { getUsername } from '@/composables';
import { Message } from '@/types';

// #endregion

defineProps<{
  data: Message;
}>();
</script>
