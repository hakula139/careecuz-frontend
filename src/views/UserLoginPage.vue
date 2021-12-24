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
        <a-row>
          <a-col :span="14">
            <a-input
              v-model:value="userForm.data.email"
              placeholder="邮箱地址"
              size="large"
              allow-clear
            >
              <template #prefix>
                <mail-outlined />
              </template>
            </a-input>
          </a-col>
          <a-col :span="10">
            <a-select
              v-model:value="emailDomain.selected"
              placeholder="请选择域名"
              :options="emailDomain.options"
              :filter-option="emailDomain.filterOption"
              size="large"
              show-search
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="userForm.data.password"
          type="password"
          placeholder="密码"
          size="large"
          allow-clear
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="userForm.isRegisterMode">
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
      </a-form-item>
      <a-form-item>
        <div class="flex justify-center w-full">
          <a-button
            class="button-lg"
            type="primary"
            @click="onSubmitClick"
          >
            {{ userForm.isRegisterMode ? '注册' : '登录' }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>

  <page-footer />
</template>

<script setup lang="ts">
// #region imports

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import { Form } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { OptionData } from 'ant-design-vue/es/vc-select/interface';

import { supportedEmailDomains } from '@/assets/supportedEmailDomains';
import { META_INFO, TIMEOUT } from '@/configs';
import { inject, openMessage } from '@/composables';
import { useStore } from '@/store';
import { UserForm, UserLoginReq, UserLoginResp } from '@/types';
import { mockUserRegisterRequiredResp, mockUserRegisterResp } from '@/api/mock';

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
      value: domain,
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

const userFormRules = reactive({
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: 'blur',
      whitespace: true,
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      required: userForm.isRegisterMode,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
});

const { validate } = useForm(userForm.data, userFormRules);

const onUserLoginResp = (resp: UserLoginResp): void => {
  userForm.loading = false;
  if (resp.code === 200) {
    store.commit('authSuccess', resp);
    console.log('user logged in:', resp.id);
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

socket.on('userLoginResp', onUserLoginResp);

const onUserRegisterResp = (resp: UserLoginResp): void => {
  userForm.loading = false;
  if (resp.code === 200) {
    store.commit('authSuccess', resp);
    console.log('user registered:', resp.id);
    router.push({ name: 'ChannelList' });
  } else {
    store.commit('authReset');
    console.log('failed to register:', userForm.data.email, resp.message);
    openMessage('error', `注册失败: ${resp.message}`);
  }
};

socket.on('userRegisterResp', onUserRegisterResp);

const parseFormData = ({ email, password, verifyCode }: UserForm): UserForm => ({
  email: `${email}@${emailDomain.selected}`,
  password,
  verifyCode,
});

const login = (): void => {
  userForm.loading = true;
  console.log('login:', userForm.data.email);
  store.commit('authLoading');
  socket.timeout(TIMEOUT).emit(
    userForm.isRegisterMode ? 'userRegisterReq' : 'userLoginReq',
    {
      data: parseFormData(userForm.data),
    } as UserLoginReq,
    (err: Error): void => {
      userForm.loading = false;
      if (err) openMessage('error', '请求超时');
      // FIXME: remove mock data
      if (userForm.isRegisterMode) {
        onUserRegisterResp(mockUserRegisterResp);
      } else {
        onUserLoginResp(mockUserRegisterRequiredResp);
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
</script>
