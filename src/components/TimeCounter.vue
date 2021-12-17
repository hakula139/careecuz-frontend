<template>
  <span v-if="timer">Current time spent: {{ currentTime() }}</span>
</template>

<script setup lang="ts">
import { defineExpose, ref } from 'vue';

import { padNumber } from '@/composables';

const timer = ref(0);

const currentTime = (): string => {
  const hour = Math.floor(timer.value / 3600);
  const minute = Math.floor(timer.value / 60);
  const second = timer.value % 60;
  return `${padNumber(hour)}:${padNumber(minute)}:${padNumber(second)}`;
};

let timerHandler = 0;

const resetTimer = (): void => {
  clearInterval(timerHandler);
  timer.value = 0;
};

const startTimer = (): void => {
  resetTimer();
  timerHandler = setInterval((): void => {
    timer.value += 1;
  }, 1000);
};

defineExpose({
  timer,
  currentTime,
  resetTimer,
  startTimer,
});
</script>
