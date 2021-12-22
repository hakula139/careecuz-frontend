<template>
  <a-list-item>
    <a-comment class="p-3 bg-white rounded-2xl">
      <template #actions>
        <a-space>
          <a-button
            @click="
              $router.push({
                name: 'MessageReplyPage',
                params: {
                  channelId,
                  messageId: data.id,
                },
              })
            "
          >
            <template #icon>
              <message-outlined />
            </template>
            <span v-if="data.replies.length > 0">{{ data.replies.length }} 个回复</span>
            <span v-else>回复</span>
          </a-button>
          <span v-if="data.replies.length > 0">
            最后回复
            {{ getRelativeTime(data.replies[data.replies.length - 1].time) }}
          </span>
        </a-space>
      </template>
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
        <a-tooltip :title="data.time">
          <span>{{ getRelativeTime(data.time) }}</span>
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

defineProps<{
  channelId: number;
  data: Message;
}>();
</script>
