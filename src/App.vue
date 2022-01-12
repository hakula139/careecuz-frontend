<template>
  <router-view />
</template>

<script lang="ts" setup>
// #region imports

import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

import { TIMEOUT } from '@/configs';
import { inject, openMessage } from '@/composables';
import { useStore } from '@/store';
import { PushUserInfo, Resp } from '@/types';

const router = useRouter();
const store = useStore();
const socket = inject<Socket>('socket');

// #endregion

const pushUserInfo = (retryLimit = 3): void => {
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
        if (err && retryLimit > 0) {
          pushUserInfo(retryLimit - 1); // retry after timeout
        } else if (err || resp.code !== 200) {
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
</script>
