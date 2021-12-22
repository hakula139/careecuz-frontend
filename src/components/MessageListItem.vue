<template>
  <a-list-item>
    <a-comment class="p-3 bg-white rounded-2xl">
      <template #actions>
        <a-space>
          <a-button @click="$router.push({ name: 'MessageReplyPage', params: { id: props.data.id } })">
            <template #icon>
              <message-outlined />
            </template>
            <span v-if="props.data.replies.length > 0">{{ props.data.replies.length }} 个回复</span>
            <span v-else>回复</span>
          </a-button>
          <span v-if="props.data.replies.length > 0">
            最后回复
            {{ getRelativeTime(props.data.replies[props.data.replies.length - 1].time) }}
          </span>
        </a-space>
      </template>
      <template #author>
        <span>{{ getUsername(props.data.user.userId) }}</span>
      </template>
      <template #avatar>
        <a-avatar size="large">
          {{ getUsername(props.data.user.userId)[0] }}
        </a-avatar>
      </template>
      <template #content>
        <p>{{ props.data.content }}</p>
      </template>
      <template #datetime>
        <a-tooltip :title="props.data.time">
          <span>{{ getRelativeTime(props.data.time) }}</span>
        </a-tooltip>
      </template>
    </a-comment>
  </a-list-item>
</template>

<script setup lang="ts">
// #region imports

import { getRelativeTime, getUsername } from '@/composables';
import { Message } from '@/types';

// #endregion

const props = defineProps<{
  data: Message;
}>();
</script>
