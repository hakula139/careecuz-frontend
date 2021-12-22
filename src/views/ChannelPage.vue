<template>
  <a-page-header
    :title="channelPage.info.name"
    @back="router.push({ name: 'ChannelList' })"
  />
  <div
    ref="containerRef"
    class="content-container"
  >
    <a-list
      item-layout="horizontal"
      :data-source="channelPage.messages"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment class="p-3 bg-white rounded-2xl">
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
              <a-avatar size="large">
                {{ getUsername(item.user.userId)[0] }}
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

      <template #header>
        <div
          ref="containerHeaderRef"
          class="flex justify-center"
        >
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
    :offset-bottom="60"
  >
    <a-button
      shape="circle"
      size="large"
      @click="scrollToPosition(0)"
    >
      <template #icon>
        <caret-down-outlined />
      </template>
    </a-button>
  </a-affix>
</template>

<script setup lang="ts">
// #region imports

import {
  computed, nextTick, onUnmounted, reactive, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { MAX_MESSAGE_COUNT, META_INFO, TIMEOUT } from '@/configs';
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
import { mockGetChannelResp, getMockGetHistoryMessagesResp, getMockPushNewMessage } from '@/api/mock';

const route = useRoute();
const router = useRouter();
const socket = inject<Socket>('socket');

// #endregion

// #region scroll

const containerRef = ref<HTMLDivElement>();

const getPosition = (): number => {
  const el = containerRef.value;
  return el ? el.scrollHeight - el.scrollTop - el.clientHeight : 0;
};

const isAtBottom = (): boolean => getPosition() <= 0;

const scrollToPosition = (position: number, smooth: boolean = true): void => {
  const el = containerRef.value;
  if (el) {
    el.scrollTo({
      top: el.scrollHeight - el.clientHeight - position,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
};

// #endregion

// #region channel page

const channelPage = reactive({
  loading: true,
  id: computed(() => parseInt(route.params.id as string, 10)),
  info: {
    name: '加载中...',
  } as ChannelInfo,
  messages: [] as Message[],
});

const onGetChannelResp = (resp: GetChannelResp): void => {
  if (resp.code === 200) {
    console.log('channel page:', resp.data);
    document.title = `${resp.data.name} - ${META_INFO.TITLE}`;
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
  channelPage.loading = false;
  if (resp.code === 200) {
    console.log('history messages:', resp.data);
    const prevPosition = getPosition();
    channelPage.messages.unshift(...resp.data);
    nextTick((): void => {
      scrollToPosition(prevPosition, !prevPosition);
    });
  }
};

socket.on('getHistoryMessagesResp', onGetHistoryMessagesResp);

const getLastMessageId = (): number => (channelPage.messages.length ? channelPage.messages[0].id : 0);

const getHistoryMessages = (): void => {
  channelPage.loading = true;
  socket.timeout(TIMEOUT).emit(
    'getHistoryMessagesReq',
    {
      id: channelPage.id,
      maxMessageCount: MAX_MESSAGE_COUNT,
      lastMessageId: getLastMessageId(),
    } as GetHistoryMessagesReq,
    (_err: Error): void => {
      channelPage.loading = false;
      // FIXME: remove mock data
      onGetHistoryMessagesResp(getMockGetHistoryMessagesResp());
    },
  );
};

const onPushNewMessage = (resp: PushNewMessage): void => {
  console.log('new message:', resp.data);
  const prevIsAtBottom = isAtBottom();
  channelPage.messages.push(resp.data);
  nextTick((): void => {
    if (prevIsAtBottom) {
      scrollToPosition(0);
    }
  });
};

socket.on('pushNewMessage', onPushNewMessage);

// FIXME: remove mock data
const intervalHandler = setInterval((): void => {
  onPushNewMessage(getMockPushNewMessage());
}, 2000);

// #endregion

const reload = (): void => {
  getChannel();
  getHistoryMessages();
};

reload();

onUnmounted((): void => {
  clearInterval(intervalHandler);
});
</script>

<style scoped>
@layer components {
  .content-container {
    @apply p-3 pt-0 overflow-y-auto;
    height: calc(100% - 72px);
  }
}
</style>
