<template>
  <div class="container px-10">
    <a-space
      class="py-6"
      size="large"
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
      :show-header="false"
      :pagination="false"
      :custom-row="customRow"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="['name'].includes(column.dataIndex)">
          <span class="text-lg">
            {{ text }}
          </span>
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
import { openMessage } from '@/composables';

const router = useRouter();

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
];

const channels = reactive({
  loading: true,
  columns,
  data: [] as Channel[],
});

const getChannels = (): void => {
  channels.loading = true;
  channelClient
    .getChannels()
    .then((resp) => {
      channels.data = resp.data;
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
