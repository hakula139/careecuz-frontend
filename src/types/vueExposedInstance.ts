/**
 * Due to a type inference issue in Vue 3.2 with TypeScript, we have to define
 * the type of exposed instances manually here as a workaround.
 * See: https://github.com/vuejs/vue-next/issues/4397
 */

import { ComponentPublicInstance } from 'vue';

import { ArithProblemListItem, TimeCounter } from '@/components';

export interface ArithProblemListItemExposed {
  checkAnswer: () => boolean;
}

export type ArithProblemListItemInstance = ComponentPublicInstance<
  typeof ArithProblemListItem & ArithProblemListItemExposed
>;

export interface TimeCounterExposed {
  timer: number;
  currentTime: () => string;
  resetTimer: () => void;
  startTimer: () => void;
}

export type TimeCounterInstance = ComponentPublicInstance<typeof TimeCounter & TimeCounterExposed>;
