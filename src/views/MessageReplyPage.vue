<template>
  <a-drawer
    placement="bottom"
    :visible="replyDrawer.visible"
    height="100%"
    @close="closeReplyDrawer"
  >
    <a-skeleton
      :loading="replyDrawer.loading"
      avatar
      active
      :paragraph="{ rows: 4 }"
    >
      <message-item
        :data="replyDrawer.data"
        @add-message="openMessageAddDrawer"
      />

      <a-card
        :title="`${replyDrawer.data.replies.length} 个回复`"
        :head-style="{ padding: 0 }"
        :body-style="{ padding: '16px 0' }"
        :bordered="false"
      >
        <a-list
          item-layout="horizontal"
          :data-source="replyDrawer.data.replies"
        >
          <template #renderItem="{ item }">
            <message-item
              :data="item"
              :message-id-map="messageIdMap"
              @add-message="openMessageAddDrawer"
            />
          </template>
        </a-list>
        <div ref="listBottomRef" />
      </a-card>
    </a-skeleton>
  </a-drawer>

  <message-add-drawer
    ref="messageAddDrawerRef"
    :channel-id="channelId"
    :thread-id="threadId"
    :message-id-map="messageIdMap"
    @done="listScrollToBottom"
  />
</template>

<script setup lang="ts">
// #region imports

import {
  nextTick, onUnmounted, reactive, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { inject, openMessage, scrollIntoView } from '@/composables';
import {
  GetMessageReq, GetMessageResp, Message, MessageAddDrawerExposed, PushNewMessage, User,
} from '@/types';

const route = useRoute();
const router = useRouter();
const socket = inject<Socket>('socket');

// #endregion

// #region scroll to bottom

const listBottomRef = ref<HTMLDivElement>();

const listScrollToBottom = (): void => {
  if (listBottomRef.value) scrollIntoView(listBottomRef.value);
};

// #endregion

// #region reply drawer

const channelId = route.params.channelId as string;
const threadId = route.params.messageId as string;

const replyDrawer = reactive({
  visible: false,
  loading: false,
  data: {
    id: '',
    user: {
      id: '',
      isBlocked: false,
    } as User,
    content: '',
    time: '',
    replyTo: undefined,
    replies: [] as Message[],
  } as Message,
});

const openReplyDrawer = (): void => {
  replyDrawer.visible = true;
};

const closeReplyDrawer = (): void => {
  replyDrawer.visible = false;
  setTimeout((): void => {
    router.push({
      name: 'ChannelPage',
      params: { channelId },
    });
  }, 500);
};

const messageIdMap = ref(new Map<string, number>([]));

// Provide human-friendly message ids.
const getMessageIdMap = ({ id, replies }: Message): void => {
  messageIdMap.value.set(id, 0);
  replies.forEach((reply, i) => messageIdMap.value.set(reply.id, i + 1));
};

const compareMessages = (a: Message, b: Message): number => a.time.localeCompare(b.time);

const onGetMessageResp = (resp: GetMessageResp): void => {
  replyDrawer.loading = false;
  if (resp.code === 200 && resp.data) {
    console.log('message:', resp.data);
    Object.assign(replyDrawer.data, resp.data, {
      replies: resp.data.replies.sort(compareMessages),
    });
    getMessageIdMap(replyDrawer.data);
  } else if (resp.code === 404) {
    openMessage('error', '消息不存在');
    setTimeout(() => {
      router.go(-1);
    }, 1000);
  } else {
    console.log('failed to get message:', resp.message);
    openMessage('error', '加载失败');
  }
};

const getMessage = (): void => {
  replyDrawer.loading = true;
  socket.emit('message:get', { channelId, threadId } as GetMessageReq, onGetMessageResp);
};

// #endregion

// #region real-time message pushing

const onPushNewMessage = (resp: PushNewMessage): void => {
  console.log('new message:', resp.data);
  const { id, threadId: respThreadId } = resp.data;
  if (threadId === respThreadId) {
    replyDrawer.data.replies.push(resp.data);
    messageIdMap.value.set(id, messageIdMap.value.size);
    nextTick((): void => {
      listScrollToBottom();
    });
  }
};

socket.on('message:new', onPushNewMessage);

// #endregion

// #region message add drawer

const messageAddDrawerRef = ref<MessageAddDrawerExposed>();

const openMessageAddDrawer = (replyTo?: string): void => {
  messageAddDrawerRef.value?.openMessageAddDrawer(replyTo);
};

// #endregion

const reload = (): void => {
  openReplyDrawer();
  getMessage();
};

reload();

onUnmounted(() => {
  socket.off('message:new', onPushNewMessage);
});
</script>

<style scoped>
.ant-skeleton {
  @apply py-4;
}
</style>
