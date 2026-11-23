import AbstractCalculator from './calculator';

const parseNum = (num: number | string | AbstractCalculator): number | undefined => {
  if (num instanceof NumCalculator) {
    return num.result;
  }
  if (typeof num === 'number') {
    return num;
  }
  if (typeof num === 'string') {
    const trimmed = num.trim();
    if (/^-?(?:\d+\.?\d*|\.\d+)(?:px)?$/i.test(trimmed)) {
      const parsed = parseFloat(trimmed);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
};

/** 纯数值计算器：hash 模式下直接求值并按选项补齐 px 单位，行为与 CSSCalculator 对齐 */
export default class NumCalculator extends AbstractCalculator {
  result = 0;

  constructor(num: number | string | AbstractCalculator) {
    super();
    const val = parseNum(num);
    if (val !== undefined) {
      this.result = val;
    }
  }

  add(num: number | string | AbstractCalculator): this {
    const val = parseNum(num);
    if (val !== undefined) {
      this.result += val;
    }
    return this;
  }

  sub(num: number | string | AbstractCalculator): this {
    const val = parseNum(num);
    if (val !== undefined) {
      this.result -= val;
    }
    return this;
  }

  mul(num: number | string | AbstractCalculator): this {
    const val = parseNum(num);
    if (val !== undefined) {
      this.result *= val;
    }
    return this;
  }

  div(num: number | string | AbstractCalculator): this {
    const val = parseNum(num);
    if (val !== undefined) {
      this.result /= val;
    }
    return this;
  }

  equal(options?: { unit?: boolean }): string {
    const { unit: cssUnit = true } = options || {};
    return cssUnit ? `${this.result}px` : `${this.result}`;
  }
}
