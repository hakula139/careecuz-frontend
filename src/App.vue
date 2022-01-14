<template>
  <router-view />
</template>

<script lang="ts" setup>
// #region imports

import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { TIMEOUT } from '@/configs';
import { getUsername, inject, openMessage } from '@/composables';
import { useStore } from '@/store';
import { PushNewNotification, PushUserInfo, Resp } from '@/types';

const router = useRouter();
const store = useStore();
const socket = inject<Socket>('socket');

// #endregion

// #region initialize socket

const pushUserInfo = (): void => {
  if (store.getters.isLoggedIn) {
    const { userId, token } = store.state;
    console.log('pushing user info:', userId);
    socket.timeout(TIMEOUT).emit(
      'user:info',
      {
        userId,
        token,
      } as PushUserInfo,
      (err: Error, resp: Resp): void => {
        if (err) {
          router.go(0);
        } else if (resp.code !== 200) {
          const errorMessage = err ? '请求超时' : resp.message;
          console.log('failed to push user info:', errorMessage);
          openMessage('error', `请重新登录: ${errorMessage}`);
          store.commit('authReset');
          router.push({ name: 'UserLoginPage' });
        }
      },
    );
  }
};

socket.on('connect', pushUserInfo);

// #endregion

// #region notification

const popNotification = (resp: PushNewNotification): void => {
  console.log('new notification:', resp.data);
  const { user } = resp.data.message;
  openMessage('info', `收到来自 ${getUsername(user.id)} 的回复，点击查看详情`, 5, () => {
    router.push({ name: 'NotificationList' });
  });
};

socket.on('notification:new', popNotification);

// #endregion
</script>
