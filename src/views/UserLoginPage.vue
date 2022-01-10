<template>
  <div class="container flex flex-col items-center justify-center max-w-2xl p-4 h-full-content">
    <span class="my-8 text-4xl align-middle">欢迎来到 {{ META_INFO.TITLE }}</span>
    <a-form
      class="w-full"
      :model="userForm.data"
      :wrapper-col="{ span: 24 }"
      hide-required-mark
      scroll-to-first-error
    >
      <a-form-item>
        <a-input
          v-model:value="userForm.data.email"
          placeholder="邮箱地址"
          size="large"
          allow-clear
        >
          <template #prefix>
            <mail-outlined />
          </template>
          <template #addonAfter>
            <a-select
              v-model:value="emailDomain.selected"
              class="w-40"
              placeholder="请选择域名"
              :options="emailDomain.options"
              :filter-option="emailDomain.filterOption"
              size="large"
              show-search
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password
          v-model:value="userForm.data.password"
          type="password"
          placeholder="密码"
          size="large"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item v-if="userForm.isRegisterMode">
        <a-row :gutter="12">
          <a-col
            :xs="15"
            :sm="18"
          >
            <a-input
              v-model:value="userForm.data.verifyCode"
              placeholder="验证码"
              size="large"
              allow-clear
            >
              <template #prefix>
                <key-outlined />
              </template>
            </a-input>
          </a-col>
          <a-col
            :xs="9"
            :sm="6"
          >
            <a-button
              class="w-full"
              size="large"
              :disabled="countdown.value > 0"
              @click="sendVerifyCode"
            >
              {{ countdown.value > 0 ? `${countdown.value} s` : '发送' }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <div class="flex justify-center w-full">
          <a-button
            class="button-lg"
            type="primary"
            @click="onSubmitClick"
          >
            {{ userForm.isRegisterMode ? '注册' : '注册 / 登录' }}
          </a-button>
        </div>
      </a-form-item>
      <a-form-item
        v-if="!userForm.isRegisterMode"
        class="opacity-0"
      >
        <!-- placeholder -->
        <a-input size="large" />
      </a-form-item>
    </a-form>
  </div>

  <page-footer />
</template>

<script setup lang="ts">
// #region imports

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import { Form } from 'ant-design-vue';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { OptionData } from 'ant-design-vue/es/vc-select/interface';

import { supportedEmailDomains } from '@/assets/supportedEmailDomains';
import { META_INFO, SEND_VERIFY_CODE_INTERVAL, TIMEOUT } from '@/configs';
import { Countdown, inject, openMessage } from '@/composables';
import { useStore } from '@/store';
import {
  Resp, UserForm, UserAuthReq, UserAuthResp,
} from '@/types';
import { mockSendVerifyCodeResp } from '@/api/mock';

const router = useRouter();
const store = useStore();
const socket = inject<Socket>('socket');
const { useForm } = Form;

// #endregion

// #region user form

const emailDomain = reactive({
  selected: undefined as string | undefined,
  options: supportedEmailDomains.map(
    (domain: string): OptionData => ({
      value: `@${domain}`,
    }),
  ),
  filterOption: (input: string, { value }: OptionData): boolean =>
    value!.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0,
});

const userForm = reactive({
  loading: false,
  isRegisterMode: false,
  data: {
    email: '',
    password: '',
    verifyCode: undefined,
  } as UserForm,
});

const validateEmail = async (_rule: RuleObject, value: string): Promise<void> => {
  if (!value || !value.trim()) {
    return Promise.reject(new Error('请输入邮箱地址'));
  }
  if (!emailDomain.selected) {
    return Promise.reject(new Error('请选择邮箱域名'));
  }
  return Promise.resolve();
};

const validatePassword = async (_rule: RuleObject, value: string): Promise<void> => {
  if (!value) {
    return Promise.reject(new Error('请输入密码'));
  }
  return Promise.resolve();
};

const validateVerifyCode = async (_rule: RuleObject, value: string): Promise<void> => {
  if (userForm.isRegisterMode && !value) {
    return Promise.reject(new Error('请输入验证码'));
  }
  return Promise.resolve();
};

const userFormRules = reactive({
  email: [
    {
      validator: validateEmail,
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: validatePassword,
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: validateVerifyCode,
      trigger: 'blur',
    },
  ],
});

const { validate } = useForm(userForm.data, userFormRules);

const onUserLoginResp = (resp: UserAuthResp): void => {
  userForm.loading = false;
  if (resp.code === 200) {
    store.commit('authSuccess', resp);
    console.log('user logged in:', resp.userId);
    router.push({ name: 'ChannelList' });
  } else if (resp.code === 100) {
    console.log('user not registered:', userForm.data.email);
    userForm.isRegisterMode = true;
  } else {
    store.commit('authReset');
    console.log('failed to log in:', userForm.data.email, resp.message);
    openMessage('error', `登录失败: ${resp.message}`);
  }
};

const onUserRegisterResp = (resp: UserAuthResp): void => {
  userForm.loading = false;
  if (resp.code === 200) {
    store.commit('authSuccess', resp);
    console.log('user registered:', resp.userId);
    router.push({ name: 'ChannelList' });
  } else {
    store.commit('authReset');
    console.log('failed to register:', userForm.data.email, resp.message);
    openMessage('error', `注册失败: ${resp.message}`);
  }
};

const parseFormData = ({ email, password, verifyCode }: UserForm): UserForm => ({
  email: email + emailDomain.selected,
  password,
  verifyCode,
});

const login = (): void => {
  userForm.loading = true;
  console.log('login:', userForm.data.email);
  store.commit('authLoading');
  socket.timeout(TIMEOUT).emit(
    userForm.isRegisterMode ? 'user:register' : 'user:login',
    {
      data: parseFormData(userForm.data),
    } as UserAuthReq,
    (err: Error, resp: UserAuthResp): void => {
      userForm.loading = false;
      if (err) {
        openMessage('error', '请求超时');
      } else if (userForm.isRegisterMode) {
        onUserRegisterResp(resp);
      } else {
        onUserLoginResp(resp);
      }
    },
  );
};

const onSubmitClick = (): void => {
  validate()
    .then((): void => {
      login();
    })
    .catch((err: ValidateErrorEntity): void => {
      console.log('validate error:', err);
      err.errorFields.forEach((field) => field.errors.forEach((message) => openMessage('warning', message)));
    });
};

// #endregion

// #region verify code

const countdown = ref(new Countdown(SEND_VERIFY_CODE_INTERVAL));

const onSendVerifyCodeResp = (resp: Resp): void => {
  if (resp.code === 200) {
    countdown.value.start();
  } else {
    console.log('failed to send verify code:', userForm.data.email, resp.message);
    openMessage('error', `发送验证码失败: ${resp.message}`);
  }
};

socket.on('sendVerifyCodeResp', onSendVerifyCodeResp);

const sendVerifyCode = (): void => {
  console.log('send verify code:', userForm.data.email);
  socket.timeout(TIMEOUT).emit('sendVerifyCodeReq', (err: Error): void => {
    if (err) openMessage('error', '请求超时');
    // FIXME: remove mock data
    onSendVerifyCodeResp(mockSendVerifyCodeResp);
  });
};

// #endregion
</script>
