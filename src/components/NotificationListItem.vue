<template>
  <a-comment>
    <template #author>
      <span>{{ fromUsername }}</span>
    </template>
    <template #avatar>
      <a-avatar size="large">
        {{ fromUsername[0] }}
      </a-avatar>
    </template>
    <template #content>
      <div @click="onNotificationClick">
        <span>{{ data.message.content }}</span>
        <a-card
          class="mt-5"
          :body-style="{ padding: '0 8px' }"
        >
          <a-comment>
            <template #author>
              <span>{{ toUsername }}</span>
            </template>
            <template #content>
              <span>{{ data.replyToMessage.content }}</span>
            </template>
            <template #datetime>
              <span>{{ getAbsoluteTime(data.replyToMessage.time) }}</span>
            </template>
          </a-comment>
        </a-card>
      </div>
    </template>
    <template #datetime>
      <span>{{ getAbsoluteTime(data.message.time) }}</span>
    </template>
  </a-comment>
</template>

<script setup lang="ts">
// #region imports

import { useRouter } from 'vue-router';

import { getAbsoluteTime, getUsername } from '@/composables';
import { useStore } from '@/store';
import { Notification } from '@/types';

const router = useRouter();
const store = useStore();

// #endregion

const props = defineProps<{
  data: Notification;
}>();

// #region message item

const fromUsername = getUsername(props.data.fromUserId);
const toUsername = getUsername(store.state.userId);

const onNotificationClick = (): void => {
  router.push({
    name: 'MessageReplyPage',
    params: {
      channelId: props.data.channelId,
      messageId: props.data.threadId,
    },
  });
};

// #endregion
</script>
