<template>
  <div class="container px-0 md:px-4">
    <a-space
      class="px-4 py-6 md:px-0"
      size="middle"
    >
      <channel-add-button />
      <a-button
        size="large"
        @click="reload"
      >
        刷新
      </a-button>
    </a-space>

    <a-table
      :loading="channels.loading"
      :columns="columns"
      :data-source="channels.data"
      row-key="id"
      :scroll="{ x: 320 }"
      :show-header="false"
      :pagination="false"
      :custom-row="customRow"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex == 'name'">
          <span class="text-lg">
            <up-square-outlined
              v-if="record.isTop"
              class="text-red-500"
            />
            {{ text }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'replyCount'">
          <span
            v-show="text > 0"
            class="text-purple-500"
          >
            <message-outlined />
            {{ text }}
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'lastReplyTime'">
          <span>{{ getRelativeTime(text) }}</span>
        </template>
      </template>
    </a-table>
  </div>

  <page-footer />
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import { ColumnsType } from 'ant-design-vue/es/table';

import { TIMEOUT } from '@/configs';
import { getRelativeTime, inject, openMessage } from '@/composables';
import { ChannelListItem, GetChannelsResp } from '@/types';
import { mockGetChannelsResp } from '@/api/mock';

const router = useRouter();
const socket = inject<Socket>('socket');

// #endregion

// #region channel table

const columns: ColumnsType = [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '回复数',
    dataIndex: 'replyCount',
    align: 'right',
    width: 90,
    ellipsis: true,
  },
  {
    title: '最后回复',
    dataIndex: 'lastReplyTime',
    align: 'right',
    width: 110,
    ellipsis: true,
  },
];

const channels = reactive({
  loading: true,
  data: [] as ChannelListItem[],
});

const compareChannels = (a: ChannelListItem, b: ChannelListItem): number => {
  if (a.isTop && !b.isTop) return -1;
  if (!a.isTop && b.isTop) return 1;
  return b.lastReplyTime.localeCompare(a.lastReplyTime);
};

const onGetChannelsResp = (resp: GetChannelsResp): void => {
  channels.loading = false;
  if (resp.code === 200) {
    console.log('channels:', resp.data);
    channels.data = resp.data.sort(compareChannels);
  } else {
    console.log('failed to get channels:', resp.message);
    openMessage('error', '加载失败');
  }
};

socket.on('getChannelsResp', onGetChannelsResp);

const getChannels = (): void => {
  channels.loading = true;
  socket.timeout(TIMEOUT).emit('getChannelsReq', (err: Error): void => {
    channels.loading = false;
    if (err) openMessage('error', '请求超时');
    // FIXME: remove mock data
    onGetChannelsResp(mockGetChannelsResp);
  });
};

const customRow = (record: ChannelListItem) => ({
  onClick: () => {
    router.push({
      name: 'ChannelPage',
      params: { id: record.id },
    });
  },
});

// #endregion

const reload = (): void => {
  getChannels();
};

reload();
</script>
