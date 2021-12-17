<template>
  <a-card size="small">
    <a-space>
      <span>{{ data.var1 }} {{ data.operator }} {{ data.var2 }} =</span>
      <a-input-number
        id="userInput"
        v-model:value="userInput"
        @change="startTimer"
      />
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { ArithOperator, ArithProblem } from '@/types';

const props = defineProps<{
  data: ArithProblem;
}>();

const emit = defineEmits<{
  (event: 'startTimer'): void;
}>();

type ArithOperatorFunc = (x: number, y: number) => number;
const operatorMap = new Map<ArithOperator, ArithOperatorFunc>([
  ['+', (x, y) => x + y],
  ['-', (x, y) => x - y],
]);

const userInput = ref(0);
const getAnswer = (): number => operatorMap.get(props.data.operator)!(props.data.var1, props.data.var2);
const checkAnswer = (): boolean => userInput.value === getAnswer();

const startTimer = (): void => emit('startTimer');

defineExpose({
  checkAnswer,
});
</script>
