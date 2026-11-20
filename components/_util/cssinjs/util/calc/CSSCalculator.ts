import AbstractCalculator from './calculator';

const CALC_UNIT = 'CALC_UNIT';
const regexp = new RegExp(CALC_UNIT, 'g');

function unit(value: number | string) {
  if (typeof value === 'number') {
    return `${value}${CALC_UNIT}`;
  }
  return value;
}

/**
 * CSS 表达式计算器：把 JS 算术运算转成 `calc()` 表达式，
 * 从而支持 `var(--ant-xxx)` 参与运算（CSS 里变量不能直接参与算术）。
 */
export default class CSSCalculator extends AbstractCalculator {
  result: string = '';

  unitlessCssVar: Set<string>;

  lowPriority?: boolean;

  constructor(num: number | string | AbstractCalculator, unitlessCssVar: Set<string>) {
    super();

    this.unitlessCssVar = unitlessCssVar;

    if (num instanceof CSSCalculator) {
      this.result = `(${num.result})`;
    } else if (typeof num === 'number') {
      this.result = unit(num) as string;
    } else if (typeof num === 'string') {
      this.result = num;
    }
  }

  add(num: number | string | AbstractCalculator): this {
    if (num instanceof CSSCalculator) {
      this.result = `${this.result} + ${num.getResult()}`;
    } else if (typeof num === 'number' || typeof num === 'string') {
      this.result = `${this.result} + ${unit(num)}`;
    }
    this.lowPriority = true;
    return this;
  }

  sub(num: number | string | AbstractCalculator): this {
    if (num instanceof CSSCalculator) {
      this.result = `${this.result} - ${num.getResult()}`;
    } else if (typeof num === 'number' || typeof num === 'string') {
      this.result = `${this.result} - ${unit(num)}`;
    }
    this.lowPriority = true;
    return this;
  }

  mul(num: number | string | AbstractCalculator): this {
    if (num instanceof CSSCalculator) {
      this.result = `${this.result} * ${num.getResult(true)}`;
    } else if (typeof num === 'number' || typeof num === 'string') {
      this.result = `${this.result} * ${num}`;
    }
    this.lowPriority = false;
    return this;
  }

  div(num: number | string | AbstractCalculator): this {
    if (num instanceof CSSCalculator) {
      this.result = `${this.result} / ${num.getResult(true)}`;
    } else if (typeof num === 'number' || typeof num === 'string') {
      this.result = `${this.result} / ${num}`;
    }
    this.lowPriority = false;
    return this;
  }

  getResult(force?: boolean): string {
    return this.lowPriority || force ? `(${this.result})` : this.result;
  }

  equal(options?: { unit?: boolean }): string {
    const { unit: cssUnit } = options || {};
    let mergedUnit: boolean = true;
    if (typeof cssUnit === 'boolean') {
      mergedUnit = cssUnit;
    } else if (Array.from(this.unitlessCssVar).some(cssVar => this.result.includes(cssVar))) {
      mergedUnit = false;
    }
    this.result = this.result.replace(regexp, mergedUnit ? 'px' : '');
    if (typeof this.lowPriority !== 'undefined') {
      return `calc(${this.result})`;
    }
    return this.result;
  }
}
