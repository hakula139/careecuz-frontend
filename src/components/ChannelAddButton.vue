<template>
  <a-button
    type="primary"
    size="large"
    @click="openChannelDrawer"
  >
    创建频道
  </a-button>

  <a-drawer
    placement="bottom"
    :visible="channelDrawer.visible"
    size="large"
    @close="closeChannelDrawer"
  >
    <template #extra>
      <a-button
        type="primary"
        :loading="channelDrawer.loading"
        size="large"
        @click="onAddChannelClick"
      >
        创建频道
      </a-button>
    </template>
    <a-form
      :model="channelDrawer.data"
      :wrapper-col="{ span: 24 }"
      hide-required-mark
      scroll-to-first-error
    >
      <a-form-item>
        <a-input
          v-model:value="channelDrawer.data.name"
          class="form-entry"
          placeholder="请输入频道名称"
          allow-clear
          :bordered="false"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import { Form } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

import { TIMEOUT } from '@/configs';
import { inject, openMessage } from '@/composables';
import { AddChannelReq, AddChannelResp, ChannelForm } from '@/types';
import { mockAddChannelResp } from '@/api/mock';

const router = useRouter();
const socket = inject<Socket>('socket');
const { useForm } = Form;

// #endregion

// #region channel drawer

const channelDrawer = reactive({
  visible: false,
  loading: false,
  data: {
    name: '',
  } as ChannelForm,
});

const channelFormRules = reactive({
  name: [
    {
      required: true,
      message: '频道名称不能为空',
      trigger: 'blur',
      whitespace: true,
    },
  ],
});

const { clearValidate, validate } = useForm(channelDrawer.data, channelFormRules);

const openChannelDrawer = (): void => {
  channelDrawer.visible = true;
};

const closeChannelDrawer = (): void => {
  channelDrawer.visible = false;
  clearValidate();
};

const onAddChannelResp = (resp: AddChannelResp): void => {
  channelDrawer.visible = false;
  channelDrawer.loading = false;
  if (resp.code === 200) {
    console.log('channel id:', resp.id);
    setTimeout(() => {
      router.push({
        name: 'ChannelPage',
        params: { id: resp.id },
      });
    }, 1000);
  } else {
    console.log('failed to add channel:', resp.message);
    openMessage('error', '创建失败');
  }
};

socket.on('addChannelResp', onAddChannelResp);

const addChannel = (): void => {
  channelDrawer.loading = true;
  socket.timeout(TIMEOUT).emit(
    'addChannelReq',
    {
      data: channelDrawer.data,
    } as AddChannelReq,
    (err: Error): void => {
      channelDrawer.loading = false;
      if (err) openMessage('error', '请求超时');
      // FIXME: remove mock data
      onAddChannelResp(mockAddChannelResp);
    },
  );
};

const onAddChannelClick = (): void => {
  validate()
    .then((): void => {
      addChannel();
    })
    .catch((err: ValidateErrorEntity): void => {
      console.log('validate error:', err);
      err.errorFields.forEach((field) => field.errors.forEach((message) => openMessage('warning', message)));
    });
};

// #endregion
</script>

<style>
@layer components {
  .ant-drawer .ant-drawer-body {
    @apply p-0;
  }

  .form-entry {
    input {
      @apply h-14 text-2xl;
    }

    .ant-input-clear-icon svg {
      @apply text-lg;
    }
  }
}
</style>
