import { ArithOperator, arithOperators } from '@/types';

export const padNumber = (value: number): string =>
  value.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });

export const getRandomOperator = (): ArithOperator => arithOperators[Math.floor(Math.random() * arithOperators.length)];

export const getRandomNumber = (): number => Math.ceil(Math.random() * 9);
