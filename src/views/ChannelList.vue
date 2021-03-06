<template>
  <div class="container px-0 md:px-4">
    <a-space
      class="px-4 py-6 md:px-0"
      size="middle"
    >
      <a-button
        type="primary"
        size="large"
        @click="channelAddDrawerRef?.openChannelAddDrawer()"
      >
        创建频道
      </a-button>

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

  <channel-add-drawer ref="channelAddDrawerRef" />

  <page-footer />
</template>

<script setup lang="ts">
// #region imports

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import { ColumnsType } from 'ant-design-vue/es/table';

import { META_INFO } from '@/configs';
import { getRelativeTime, inject, openMessage } from '@/composables';
import { ChannelAddDrawerExposed, ChannelSummary, GetChannelsResp } from '@/types';

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
  data: [] as ChannelSummary[],
});

const compareChannels = (a: ChannelSummary, b: ChannelSummary): number => {
  if (a.isTop && !b.isTop) return -1;
  if (!a.isTop && b.isTop) return 1;
  return b.lastReplyTime.localeCompare(a.lastReplyTime);
};

const onGetChannelsResp = (resp: GetChannelsResp): void => {
  channels.loading = false;
  if (resp.code === 200 && resp.data !== undefined) {
    console.log('channels:', resp.data);
    channels.data = resp.data.sort(compareChannels) || [];
  } else {
    console.log('failed to get channels:', resp.message);
    openMessage('error', '加载失败');
  }
};

const getChannels = (): void => {
  channels.loading = true;
  socket.emit('channels:get', onGetChannelsResp);
};

const customRow = (record: ChannelSummary) => ({
  onClick: () => {
    router.push({
      name: 'ChannelPage',
      params: { channelId: record.id },
    });
  },
});

// #endregion

// #region channel add drawer

const channelAddDrawerRef = ref<ChannelAddDrawerExposed>();

// #endregion

const reload = (): void => {
  document.title = META_INFO.TITLE;
  getChannels();
};

reload();
</script>
