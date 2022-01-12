<template>
  <router-view />
</template>

<script lang="ts" setup>
// #region imports

import { Socket } from 'socket.io-client';

import { TIMEOUT } from '@/configs';
import { inject } from '@/composables';
import { useStore } from '@/store';
import { PushUserInfo, Resp } from '@/types';

const store = useStore();
const socket = inject<Socket>('socket');

// #endregion

const pushUserInfo = (): void => {
  if (store.getters.isLoggedIn) {
    const { userId, userToken } = store.state;
    console.log('user info:', userId);
    socket.timeout(TIMEOUT).emit(
      'user:info',
      {
        userId,
        userToken,
      } as PushUserInfo,
      (err: Error, resp: Resp): void => {
        if (err || resp.code !== 200) {
          console.log('failed to push user info:', err ? err.message : resp.message);
        }
      },
    );
  }
};

socket.on('connect', pushUserInfo);
</script>
