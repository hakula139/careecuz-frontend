<template>
  <a-page-header
    :title="channelPage.info.name"
    @back="$router.push({ name: 'ChannelList' })"
  />

  <div
    ref="containerRef"
    class="p-3 pt-0 overflow-y-auto h-full-content"
  >
    <a-list
      item-layout="horizontal"
      :data-source="channelPage.messages"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <message-list-item
            class="w-full"
            :channel-id="channelId"
            :data="item"
          />
        </a-list-item>
      </template>

      <template #header>
        <div class="flex justify-center">
          <a-button
            v-show="channelPage.messages.length > 0"
            :loading="channelPage.loading"
            @click="getHistoryMessages"
          >
            加载更多
          </a-button>
        </div>
      </template>
    </a-list>
  </div>

  <a-affix
    class="fixed right-8"
    :offset-bottom="100"
  >
    <a-space
      size="middle"
      direction="vertical"
    >
      <a-button
        type="primary"
        shape="circle"
        size="large"
        @click="openMessageAddDrawer"
      >
        <template #icon>
          <plus-outlined />
        </template>
      </a-button>
      <a-button
        shape="circle"
        size="large"
        @click="reload"
      >
        <template #icon>
          <reload-outlined />
        </template>
      </a-button>
      <a-button
        shape="circle"
        size="large"
        @click="containerScrollToBottom"
      >
        <template #icon>
          <caret-down-outlined />
        </template>
      </a-button>
    </a-space>
  </a-affix>

  <message-add-drawer
    ref="messageAddDrawerRef"
    :channel-id="channelId"
    @done="containerScrollToBottom"
  />

  <router-view />
</template>

<script setup lang="ts">
// #region imports

import {
  nextTick, onBeforeUnmount, reactive, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { Socket } from 'socket.io-client';

import { MAX_MESSAGE_COUNT, META_INFO } from '@/configs';
import {
  getPosition, inject, isAtBottom, openMessage, scrollToPosition,
} from '@/composables';
import {
  ChannelInfo,
  GetChannelReq,
  GetChannelResp,
  GetHistoryMessagesReq,
  GetHistoryMessagesResp,
  JoinChannel,
  LeaveChannel,
  MessageAddDrawerExposed,
  MessageSummary,
  PushNewMessageSummary,
} from '@/types';

const route = useRoute();
const socket = inject<Socket>('socket');

// #endregion

// #region scroll to bottom

const containerRef = ref<HTMLDivElement>();

const containerScrollToBottom = (): void => {
  if (containerRef.value) scrollToPosition(containerRef.value, 0);
};

// #endregion

// #region channel page

const channelId = route.params.channelId as string;

const channelPage = reactive({
  loading: true,
  info: {
    name: '加载中...',
  } as ChannelInfo,
  messages: [] as MessageSummary[],
});

const onGetChannelResp = (resp: GetChannelResp): void => {
  if (resp.code === 200 && resp.data !== undefined) {
    console.log('channel page:', resp.data);
    document.title = `${resp.data.name} - ${META_INFO.TITLE}`;
    channelPage.info = resp.data;
  } else {
    console.log('failed to get channel info:', resp.message);
    openMessage('error', '加载失败');
  }
};

const getChannel = (): void => {
  socket.emit('channel:get', { id: channelId } as GetChannelReq, onGetChannelResp);
};

// #endregion

// #region messages

const compareMessages = (a: MessageSummary, b: MessageSummary): number => a.time.localeCompare(b.time);

const onGetHistoryMessagesResp = (resp: GetHistoryMessagesResp): void => {
  channelPage.loading = false;
  if (resp.code === 200 && resp.data !== undefined) {
    console.log('history messages:', resp.data);
    const prevPosition = containerRef.value ? getPosition(containerRef.value) : 0;
    channelPage.messages.unshift(...resp.data.sort(compareMessages));
    nextTick((): void => {
      if (containerRef.value) {
        scrollToPosition(containerRef.value, prevPosition, !prevPosition);
      }
    });
  } else {
    console.log('failed to get history messages:', resp.message);
    openMessage('error', '加载失败');
  }
};

const getLastMessageId = (): string | undefined =>
  (channelPage.messages.length ? channelPage.messages[0].id : undefined);

const getHistoryMessages = (): void => {
  channelPage.loading = true;
  socket.emit(
    'messages:get:history',
    {
      channelId,
      maxMessageCount: MAX_MESSAGE_COUNT,
      lastMessageId: getLastMessageId(),
    } as GetHistoryMessagesReq,
    onGetHistoryMessagesResp,
  );
};

// #endregion

// #region real-time message pushing

const onPushNewMessageSummary = (resp: PushNewMessageSummary): void => {
  console.log('new message:', resp.data);
  const prevIsAtBottom = containerRef.value ? isAtBottom(containerRef.value) : true;
  if (!resp.data.replyTo) {
    channelPage.messages.push(resp.data);
  }
  nextTick((): void => {
    if (prevIsAtBottom) containerScrollToBottom();
  });
};

socket.on('message:new:summary', onPushNewMessageSummary);

const joinChannel = (): void => {
  console.log('join channel:', channelId);
  socket.emit('channel:join', {
    id: channelId,
  } as JoinChannel);
};

const leaveChannel = (): void => {
  console.log('leave channel:', channelId);
  socket.emit('channel:leave', {
    id: channelId,
  } as LeaveChannel);
};

// #endregion

// #region message add drawer

const messageAddDrawerRef = ref<MessageAddDrawerExposed>();

const openMessageAddDrawer = (): void => {
  messageAddDrawerRef.value?.openMessageAddDrawer();
};

// #endregion

const reload = (): void => {
  getChannel();
  channelPage.messages.length = 0;
  getHistoryMessages();
};

joinChannel();
reload();

onBeforeUnmount((): void => {
  leaveChannel();
});
</script>
