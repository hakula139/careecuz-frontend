<template>
  <a-drawer
    placement="bottom"
    :visible="messageAddDrawer.visible"
    :body-style="{ padding: 0 }"
    @close="closeMessageAddDrawer"
  >
    <template #extra>
      <a-button
        type="primary"
        :loading="messageAddDrawer.loading"
        size="large"
        @click="onAddMessageClick"
      >
        发表评论
      </a-button>
    </template>
    <a-form
      :model="messageAddDrawer.data"
      :wrapper-col="{ span: 24 }"
      hide-required-mark
      scroll-to-first-error
    >
      <a-form-item>
        <a-textarea
          v-model:value="messageAddDrawer.data.content"
          :placeholder="messageAddDrawer.placeHolder()"
          :auto-size="{ minRows: 2, maxRows: 5 }"
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
import { AddMessageReq, AddMessageResp, MessageForm } from '@/types';
import { mockAddMessageResp } from '@/api/mock';

const router = useRouter();
const socket = inject<Socket>('socket');
const { useForm } = Form;

// #endregion

// #region message add drawer

const messageAddDrawer = reactive({
  visible: false,
  loading: false,
  placeHolder: (): string =>
    (messageAddDrawer.data.replyTo ? `回复 #${messageAddDrawer.data.replyTo}` : '发条友善的评论吧～'),
  data: {
    content: '',
    replyTo: 0,
  } as MessageForm,
});

const messageFormRules = reactive({
  name: [
    {
      required: true,
      message: '评论内容不能为空',
      trigger: 'blur',
      whitespace: true,
    },
  ],
});

const { clearValidate, validate } = useForm(messageAddDrawer.data, messageFormRules);

const openMessageAddDrawer = (replyTo: number): void => {
  messageAddDrawer.data.replyTo = replyTo;
  messageAddDrawer.visible = true;
};

const closeMessageAddDrawer = (): void => {
  messageAddDrawer.visible = false;
  clearValidate();
};

const onAddMessageResp = (resp: AddMessageResp): void => {
  messageAddDrawer.visible = false;
  messageAddDrawer.loading = false;
  if (resp.code === 200) {
    console.log('channel id:', resp.id);
    router.push({
      name: 'MessagePage',
      params: { channelId: resp.id },
    });
  } else {
    console.log('failed to add channel:', resp.message);
    openMessage('error', '创建失败');
  }
};

socket.on('addMessageResp', onAddMessageResp);

const addMessage = (): void => {
  messageAddDrawer.loading = true;
  socket.timeout(TIMEOUT).emit(
    'addMessageReq',
    {
      // TODO: implement login, store userId and userToken into Vuex
      userId: '',
      userToken: '',
      data: messageAddDrawer.data,
    } as AddMessageReq,
    (err: Error): void => {
      messageAddDrawer.loading = false;
      if (err) openMessage('error', '请求超时');
      // FIXME: remove mock data
      onAddMessageResp(mockAddMessageResp);
    },
  );
};

const onAddMessageClick = (): void => {
  validate()
    .then((): void => {
      addMessage();
    })
    .catch((err: ValidateErrorEntity): void => {
      console.log('validate error:', err);
      err.errorFields.forEach((field) => field.errors.forEach((message) => openMessage('warning', message)));
    });
};

// #endregion

defineExpose({
  openMessageDrawer: openMessageAddDrawer,
});
</script>
