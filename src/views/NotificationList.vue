<template>
  <a-page-header
    title="评论列表"
    @back="$router.go(-1)"
  />

  <div class="container px-0 md:px-4">
    <a-card :bordered="false">
      <a-skeleton
        :loading="notifications.loading"
        avatar
        active
        :paragraph="{ rows: 4 }"
      >
        <a-list
          item-layout="vertical"
          :data-source="notifications.data"
        >
          <template #renderItem="{ item }">
            <notification-list-item :data="item" />
          </template>
        </a-list>
      </a-skeleton>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';
import { Socket } from 'socket.io-client';

import { META_INFO } from '@/configs';
import { inject, openMessage } from '@/composables';
import { GetNotificationsResp, Notification } from '@/types';

const socket = inject<Socket>('socket');

// #endregion

// #region notification list

const notifications = reactive({
  loading: false,
  data: [] as Notification[],
});

const onGetNotificationsResp = (resp: GetNotificationsResp): void => {
  notifications.loading = false;
  if (resp.code === 200 && resp.data) {
    console.log('notifications:', resp.data);
    notifications.data = resp.data;
  } else {
    console.log('failed to get notifications:', resp.message);
    openMessage('error', '加载失败');
  }
};

const getNotifications = (): void => {
  notifications.loading = true;
  socket.emit('notifications:get', onGetNotificationsResp);
};

// #endregion

const reload = (): void => {
  document.title = META_INFO.TITLE;
  getNotifications();
};

reload();
</script>

<style scoped>
.ant-skeleton {
  @apply py-4;
}
</style>
