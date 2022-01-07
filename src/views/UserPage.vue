<template>
  <a-page-header
    title="用户信息"
    @back="$router.go(-1)"
  />

  <div class="flex justify-center p-6 h-full-content">
    <div class="flex flex-col justify-between">
      <a-space
        class="items-center"
        direction="vertical"
        size="large"
      >
        <a-avatar :size="144">
          <span class="leading-loose text-7xl">
            {{ username[0] }}
          </span>
        </a-avatar>
        <span class="text-3xl">
          {{ username }}
        </span>
      </a-space>

      <a-space
        class="items-center py-6"
        direction="vertical"
        size="large"
      >
        <a-button
          v-if="isMe"
          class="button-lg"
          type="primary"
          danger
          @click="logout"
        >
          退出登录
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
// #region imports

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUsername } from '@/composables';
import { useStore } from '@/store';

const route = useRoute();
const router = useRouter();
const store = useStore();

// #endregion

// #region user

const isMe = computed(() => !route.params.userId);
const userId = computed(() => (isMe.value ? store.state.userId : (route.params.userId as string)));
const username = computed(() => getUsername(userId.value));

const logout = (): void => {
  store.commit('authReset');
  console.log('logged out');
  router.push({ name: 'UserLoginPage' });
};

// #endregion
</script>
