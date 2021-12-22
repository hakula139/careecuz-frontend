<template>
  <a-comment @click="() => {}">
    <template #author>
      <a-space>
        <span>{{ getUsername(data.user.userId) }}</span>
        <span>#{{ data.id }}</span>
        <caret-right-outlined v-if="data.replyTo" />
        <span v-if="data.replyTo">#{{ data.replyTo }}</span>
      </a-space>
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
      <a-tooltip :title="data.time">
        <span>{{ getRelativeTime(data.time) }}</span>
      </a-tooltip>
    </template>
  </a-comment>
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';

import { getRelativeTime, getUsername } from '@/composables';
import { Message, MessageForm } from '@/types';

// #endregion

defineProps<{
  data: Message;
}>();

// #region reply drawer

const replyDrawer = reactive({
  visible: false,
  data: {
    content: '',
    replyTo: 0,
  } as MessageForm,
});

// #endregion
</script>
