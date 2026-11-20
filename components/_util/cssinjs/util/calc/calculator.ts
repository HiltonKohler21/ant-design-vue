/** 计算器抽象基类（移植自 @ant-design/cssinjs v2 / util/calc） */
export default abstract class AbstractCalculator {
  abstract result: any;

  abstract add(num: number | string | AbstractCalculator): this;

  abstract sub(num: number | string | AbstractCalculator): this;

  abstract mul(num: number | string | AbstractCalculator): this;

  abstract div(num: number | string | AbstractCalculator): this;

  abstract equal(options?: { unit?: boolean }): string;
}
