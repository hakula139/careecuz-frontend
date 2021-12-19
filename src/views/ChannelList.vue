<template>
  <div class="container px-0 md:px-4">
    <a-space
      class="px-4 py-6 md:px-0"
      size="middle"
    >
      <a-button
        type="primary"
        size="large"
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
      :columns="channels.columns"
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
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';

import { Channel } from '@/types/channel';
import { channelClient } from '@/api';
import { getRelativeTime, openMessage } from '@/composables';

const router = useRouter();

const columns = [
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
  columns,
  data: [] as Channel[],
});

const compareChannels = (a: Channel, b: Channel): number => {
  if (a.isTop && !b.isTop) return -1;
  if (!a.isTop && b.isTop) return 1;
  return b.lastReplyTime.localeCompare(a.lastReplyTime);
};

const getChannels = (): void => {
  channels.loading = true;
  channelClient
    .getChannels()
    .then((resp) => {
      console.log('channels:', resp.data);
      channels.data = resp.data.sort(compareChannels);
    })
    .catch((err: AxiosError) => {
      console.log('failed to get channels:', err.message);
      openMessage('error', '加载失败');
    })
    .finally(() => {
      channels.loading = false;
    });
};

const customRow = (record: Channel) => ({
  onClick: () => {
    router.push({
      name: 'ChannelPage',
      params: { id: record.id },
    });
  },
});

const reload = (): void => {
  getChannels();
};

reload();
</script>
