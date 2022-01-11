<template>
  <a-drawer
    placement="bottom"
    :visible="channelAddDrawer.visible"
    :body-style="{ padding: 0 }"
    @close="closeChannelAddDrawer"
  >
    <template #extra>
      <a-button
        type="primary"
        :loading="channelAddDrawer.loading"
        size="large"
        @click="onAddChannelClick"
      >
        创建频道
      </a-button>
    </template>
    <a-form
      :model="channelAddDrawer.data"
      :wrapper-col="{ span: 24 }"
      hide-required-mark
      scroll-to-first-error
    >
      <a-form-item>
        <a-input
          v-model:value="channelAddDrawer.data.name"
          placeholder="请输入频道名称"
          allow-clear
          size="large"
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

const router = useRouter();
const socket = inject<Socket>('socket');
const { useForm } = Form;

// #endregion

// #region channel add drawer

const channelAddDrawer = reactive({
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

const { clearValidate, validate } = useForm(channelAddDrawer.data, channelFormRules);

const openChannelAddDrawer = (): void => {
  channelAddDrawer.visible = true;
};

const closeChannelAddDrawer = (): void => {
  channelAddDrawer.visible = false;
  clearValidate();
};

const onAddChannelResp = (resp: AddChannelResp): void => {
  channelAddDrawer.visible = false;
  channelAddDrawer.loading = false;
  if (resp.code === 200 && resp.id !== undefined) {
    console.log('channel id:', resp.id);
    router.push({
      name: 'ChannelPage',
      params: { channelId: resp.id },
    });
  } else {
    console.log('failed to add channel:', resp.message);
    openMessage('error', '创建失败');
  }
};

const addChannel = (): void => {
  channelAddDrawer.loading = true;
  console.log('add channel:', channelAddDrawer.data);
  socket.timeout(TIMEOUT).emit(
    'channel:add',
    {
      data: channelAddDrawer.data,
    } as AddChannelReq,
    (err: Error, resp: AddChannelResp): void => {
      channelAddDrawer.loading = false;
      if (err) {
        openMessage('error', '请求超时');
      } else {
        onAddChannelResp(resp);
      }
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

defineExpose({
  openChannelAddDrawer,
});
</script>
