<template>
  <a-drawer
    placement="bottom"
    :visible="messageAddDrawer.visible"
    :height="messageAddDrawer.height()"
    :body-style="{ padding: 0 }"
    @close="closeMessageAddDrawer"
  >
    <template #extra>
      <a-space size="middle">
        <a-button
          type="text"
          shape="circle"
          @click="toggleMessageAddDrawerHeight"
        >
          <template #icon>
            <shrink-outlined v-if="messageAddDrawer.fullscreen" />
            <arrows-alt-outlined v-else />
          </template>
        </a-button>
        <a-button
          type="primary"
          :loading="messageAddDrawer.loading"
          @click="onAddMessageClick"
        >
          发表评论
        </a-button>
      </a-space>
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
          auto-size
          :bordered="false"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';
import { Socket } from 'socket.io-client';
import { Form } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

import { TIMEOUT } from '@/configs';
import { inject, openMessage } from '@/composables';
import { AddMessageReq, AddMessageResp, MessageForm } from '@/types';
import { mockAddMessageResp } from '@/api/mock';

const socket = inject<Socket>('socket');
const { useForm } = Form;

// #endregion

const props = defineProps<{
  channelId: number;
}>();

const emit = defineEmits<{
  (event: 'done'): void;
}>();

// #region message add drawer

const messageAddDrawer = reactive({
  visible: false,
  loading: false,
  fullscreen: false,
  height: (): string => (messageAddDrawer.fullscreen ? '100%' : '200px'),
  placeHolder: (): string =>
    (messageAddDrawer.data.replyTo ? `回复 #${messageAddDrawer.data.replyTo}` : '发条友善的评论吧～'),
  data: {
    content: '',
    replyTo: 0,
  } as MessageForm,
});

const messageFormRules = reactive({
  content: [
    {
      required: true,
      message: '评论内容不能为空',
      trigger: 'blur',
      whitespace: true,
    },
  ],
});

const { clearValidate, resetFields, validate } = useForm(messageAddDrawer.data, messageFormRules);

const openMessageAddDrawer = (replyTo: number = 0): void => {
  messageAddDrawer.data.replyTo = replyTo;
  messageAddDrawer.visible = true;
};

const closeMessageAddDrawer = (): void => {
  messageAddDrawer.visible = false;
  clearValidate();
};

const toggleMessageAddDrawerHeight = (): void => {
  messageAddDrawer.fullscreen = !messageAddDrawer.fullscreen;
};

const onAddMessageResp = (resp: AddMessageResp): void => {
  messageAddDrawer.visible = false;
  messageAddDrawer.loading = false;
  if (resp.code === 200) {
    console.log('message id:', resp.id);
    resetFields();
    emit('done');
  } else {
    console.log('failed to add message:', resp.message);
    openMessage('error', '发表失败');
  }
};

socket.on('addMessageResp', onAddMessageResp);

const addMessage = (): void => {
  messageAddDrawer.loading = true;
  console.log('add message:', messageAddDrawer.data);
  socket.timeout(TIMEOUT).emit(
    'addMessageReq',
    {
      // TODO: implement login, store userId and userToken into Vuex
      userId: '',
      userToken: '',
      channelId: props.channelId,
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
  openMessageAddDrawer,
});
</script>
