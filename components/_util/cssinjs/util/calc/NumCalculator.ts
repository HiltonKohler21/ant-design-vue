import AbstractCalculator from './calculator';

/** 纯数值计算器：hash 模式下不产生 calc()，保持原有数值行为 */
export default class NumCalculator extends AbstractCalculator {
  result: number = 0;

  constructor(num: number | string | AbstractCalculator) {
    super();
    if (num instanceof NumCalculator) {
      this.result = num.result;
    } else if (typeof num === 'number') {
      this.result = num;
    }
  }

  add(num: number | string | AbstractCalculator): this {
    if (num instanceof NumCalculator) {
      this.result += num.result;
    } else if (typeof num === 'number') {
      this.result += num;
    }
    return this;
  }

  sub(num: number | string | AbstractCalculator): this {
    if (num instanceof NumCalculator) {
      this.result -= num.result;
    } else if (typeof num === 'number') {
      this.result -= num;
    }
    return this;
  }

  mul(num: number | string | AbstractCalculator): this {
    if (num instanceof NumCalculator) {
      this.result *= num.result;
    } else if (typeof num === 'number') {
      this.result *= num;
    }
    return this;
  }

  div(num: number | string | AbstractCalculator): this {
    if (num instanceof NumCalculator) {
      this.result /= num.result;
    } else if (typeof num === 'number') {
      this.result /= num;
    }
    return this;
  }

  equal(): string {
    return String(this.result);
  }
}
