<template>
  <a-page-header
    :title="channelPage.info.name"
    @back="router.go(-1)"
  >
    <a-list
      item-layout="horizontal"
      :data-source="channelPage.messages"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment>
            <template #actions>
              <a-space>
                <a-button size="small">
                  <span v-if="item.replies.length > 0">
                    <message-outlined />
                    {{ item.replies.length }} 个回复
                  </span>
                </a-button>
              </a-space>
            </template>
            <template #author>
              <span>{{ getUsername(item.user.userId) }}</span>
            </template>
            <template #avatar>
              <a-avatar :size="50">
                {{ item.user.userId[0] }}
              </a-avatar>
            </template>
            <template #content>
              <p>{{ item.content }}</p>
            </template>
            <template #datetime>
              <a-tooltip :title="item.time">
                <span>{{ getRelativeTime(item.time) }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>
  </a-page-header>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { MAX_MESSAGE_COUNT, TIMEOUT } from '@/configs';
import {
  getRelativeTime, getUsername, inject, openMessage,
} from '@/composables';
import {
  ChannelInfo,
  GetChannelReq,
  GetChannelResp,
  GetHistoryMessagesReq,
  GetHistoryMessagesResp,
  Message,
  PushNewMessage,
} from '@/types';
import { mockGetChannelResp, mockGetHistoryMessagesResp } from '@/api/mock';

const route = useRoute();
const router = useRouter();
const socket = inject<Socket>('socket');

// #region channel page

const channelPage = reactive({
  id: computed(() => parseInt(route.params.id as string, 10)),
  info: {
    name: '加载中...',
  } as ChannelInfo,
  messages: [] as Message[],
});

const onGetChannelResp = (resp: GetChannelResp): void => {
  if (resp.code === 200) {
    console.log('channel page:', resp.data);
    channelPage.info = resp.data;
  } else {
    console.log('failed to get channel info:', resp.message);
    openMessage('error', '加载失败');
  }
};

socket.on('getChannelResp', onGetChannelResp);

const getChannel = (): void => {
  socket.timeout(TIMEOUT).emit(
    'getChannelReq',
    {
      id: channelPage.id,
    } as GetChannelReq,
    (err: Error): void => {
      if (err) openMessage('error', '请求超时');
      // FIXME: remove mock data
      onGetChannelResp(mockGetChannelResp);
    },
  );
};

// #endregion

// #region messages

const onGetHistoryMessagesResp = (resp: GetHistoryMessagesResp): void => {
  if (resp.code === 200) {
    console.log('history messages:', resp.data);
    channelPage.messages.unshift(...resp.data);
  }
};

socket.on('getHistoryMessagesResp', onGetHistoryMessagesResp);

const getLastMessageId = (): number => (channelPage.messages.length ? channelPage.messages[0].id : 0);

const getHistoryMessages = (): void => {
  socket.timeout(TIMEOUT).emit(
    'getHistoryMessagesReq',
    {
      id: channelPage.id,
      maxMessageCount: MAX_MESSAGE_COUNT,
      lastMessageId: getLastMessageId(),
    } as GetHistoryMessagesReq,
    (_err: Error): void => {
      // FIXME: remove mock data
      onGetHistoryMessagesResp(mockGetHistoryMessagesResp);
    },
  );
};

const onPushNewMessage = (resp: PushNewMessage): void => {
  console.log('new message:', resp.data);
  channelPage.messages.push(resp.data);
};

socket.on('pushNewMessage', onPushNewMessage);

// #endregion

const reload = (): void => {
  getChannel();
  getHistoryMessages();
};

reload();
</script>
