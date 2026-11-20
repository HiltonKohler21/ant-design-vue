import AbstractCalculator from './calculator';
import CSSCalculator from './CSSCalculator';
import NumCalculator from './NumCalculator';

export type { default as AbstractCalculator } from './calculator';
export { CSSCalculator, NumCalculator };

/**
 * 计算器工厂。
 * - `css` 模式：运算输出 `calc()` 表达式，可作用于 `var(--ant-xxx)`
 * - `number` 模式：纯数值运算（hash 模式兼容）
 */
export default function genCalc(
  type: 'css' | 'number',
  unitlessCssVar: Set<string>,
): (num: number | string | AbstractCalculator) => AbstractCalculator {
  const Calculator = type === 'css' ? CSSCalculator : NumCalculator;
  return (num: number | string | AbstractCalculator) => new Calculator(num, unitlessCssVar);
}
