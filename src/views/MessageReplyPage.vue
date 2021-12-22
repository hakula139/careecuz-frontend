<template>
  <a-drawer
    placement="bottom"
    :visible="replyDrawer.visible"
    size="large"
    @close="closeReplyDrawer"
  >
    <a-list
      item-layout="horizontal"
      :loading="replyDrawer.loading"
      :data-source="replyDrawer.data.replies"
    >
      <template #renderItem="{ item }">
        <message-list-item :data="item" />
      </template>
    </a-list>
  </a-drawer>
</template>

<script setup lang="ts">
// #region imports

import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { TIMEOUT } from '@/configs';
import { inject, openMessage } from '@/composables';
import {
  GetMessageReq, GetMessageResp, Message, User,
} from '@/types';
import { getMockGetMessageResp } from '@/api/mock';

const route = useRoute();
const router = useRouter();
const socket = inject<Socket>('socket');

// #endregion

// #region reply drawer

const channelId = computed(() => parseInt(route.params.id[0], 10));
const messageId = computed(() => parseInt(route.params.id[1], 10));

const replyDrawer = reactive({
  visible: false,
  loading: false,
  data: {
    id: 0,
    user: {
      userId: '',
      isBlocked: false,
    } as User,
    content: '',
    time: '',
    replyTo: 0,
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
      params: { id: channelId.value },
    });
  }, 500);
};

const onGetMessageResp = (resp: GetMessageResp): void => {
  replyDrawer.loading = false;
  if (resp.code === 200) {
    console.log('message:', resp.data);
    replyDrawer.data = resp.data;
  } else {
    console.log('failed to get message:', resp.message);
    openMessage('error', '加载失败');
  }
};

socket.on('getMessageResp', onGetMessageResp);

const getMessage = (): void => {
  replyDrawer.loading = true;
  socket.timeout(TIMEOUT).emit(
    'getMessageReq',
    {
      channelId: channelId.value,
      messageId: messageId.value,
    } as GetMessageReq,
    (err: Error): void => {
      replyDrawer.loading = false;
      if (err) openMessage('error', '请求超时');
      // FIXME: remove mock data
      onGetMessageResp(getMockGetMessageResp());
    },
  );
};

// #endregion

const reload = (): void => {
  openReplyDrawer();
  getMessage();
};

reload();
</script>
