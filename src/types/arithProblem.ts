export const arithOperators = ['+', '-'] as const;
export type ArithOperator = typeof arithOperators[number];

export interface ArithProblem {
  operator: ArithOperator;
  var1: number;
  var2: number;
}
