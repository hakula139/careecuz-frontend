<template>
  <a-comment>
    <template #author>
      <a-space>
        <span>{{ username }}</span>
        <span>#{{ messageIdMap?.get(data.id) || 0 }}</span>
        <caret-right-outlined v-if="parsedReplyTo" />
        <span v-if="parsedReplyTo">#{{ parsedReplyTo }}</span>
      </a-space>
    </template>
    <template #avatar>
      <a-avatar size="large">
        {{ username[0] }}
      </a-avatar>
    </template>
    <template #content>
      <div @click="onMessageClick">
        <markdown-text :text="data.content" />
      </div>
    </template>
    <template #datetime>
      <a-tooltip :title="getAbsoluteTime(data.time)">
        <span>{{ getRelativeTime(data.time) }}</span>
      </a-tooltip>
    </template>
  </a-comment>
</template>

<script setup lang="ts">
// #region imports

import { getAbsoluteTime, getRelativeTime, getUsername } from '@/composables';
import { Message } from '@/types';

// #endregion

const props = defineProps<{
  data: Message;
  messageIdMap?: Map<string, number>;
}>();

const emit = defineEmits<{
  (event: 'addMessage', replyTo: string): void;
}>();

// #region message item

const username = getUsername(props.data.user.id);

const parsedReplyTo = props.data.replyTo ? props.messageIdMap?.get(props.data.replyTo) : undefined;

const onMessageClick = (): void => {
  emit('addMessage', props.data.id);
};

// #endregion
</script>
