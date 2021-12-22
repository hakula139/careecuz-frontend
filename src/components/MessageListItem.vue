<template>
  <a-list-item>
    <a-comment class="p-3 bg-white rounded-2xl">
      <template #actions>
        <a-space>
          <a-button size="small">
            <span v-if="props.data.replies.length > 0">
              <message-outlined />
              {{ props.data.replies.length }} 个回复
            </span>
          </a-button>
        </a-space>
      </template>
      <template #author>
        <span>{{ getUsername(props.data.user.userId) }}</span>
      </template>
      <template #avatar>
        <a-avatar size="large">
          {{ getUsername(props.data.user.userId)[0] }}
        </a-avatar>
      </template>
      <template #content>
        <p>{{ props.data.content }}</p>
      </template>
      <template #datetime>
        <a-tooltip :title="props.data.time">
          <span>{{ getRelativeTime(props.data.time) }}</span>
        </a-tooltip>
      </template>
    </a-comment>
  </a-list-item>
</template>

<script setup lang="ts">
import { getRelativeTime, getUsername } from '@/composables';
import { Message } from '@/types';

const props = defineProps<{
  data: Message;
}>();
</script>
