<template>
  <a-comment>
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
      <div @click="onMessageClick">
        <p>{{ data.content }}</p>
      </div>
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

import { getRelativeTime, getUsername } from '@/composables';
import { Message } from '@/types';

// #endregion

const props = defineProps<{
  data: Message;
}>();

const emit = defineEmits<{
  (event: 'addMessage', replyTo: number): void;
}>();

// #region reply list item

const onMessageClick = (): void => {
  emit('addMessage', props.data.id);
};

// #endregion
</script>
