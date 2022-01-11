<template>
  <a-comment class="px-3 bg-white rounded-2xl">
    <template #actions>
      <a-space size="middle">
        <a-button @click="openReplyPage">
          <template #icon>
            <message-outlined />
          </template>
          <span v-if="data.replyCount > 0">{{ data.replyCount }}</span>
          <span v-else>回复</span>
        </a-button>
        <span v-if="data.replyCount > 0">
          最后回复
          {{ getRelativeTime(data.lastReplyTime) }}
        </span>
      </a-space>
    </template>
    <template #author>
      <span>{{ username }}</span>
    </template>
    <template #avatar>
      <a-avatar size="large">
        {{ username[0] }}
      </a-avatar>
    </template>
    <template #content>
      <div @click="openReplyPage">
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

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { getRelativeTime, getUsername } from '@/composables';
import { MessageSummary } from '@/types';

const router = useRouter();

// #endregion

const props = defineProps<{
  channelId: string;
  data: MessageSummary;
}>();

// #region message list item

const username = computed(() => getUsername(props.data.user.userId));

const openReplyPage = (): void => {
  router.push({
    name: 'MessageReplyPage',
    params: {
      channelId: props.channelId,
      messageId: props.data.id,
    },
  });
};

// #endregion
</script>
