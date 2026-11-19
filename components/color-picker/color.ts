import { TinyColor } from '@ctrl/tinycolor';

export const toHexFormat = (value?: string, alpha?: boolean): string =>
  value?.replace(/[^\w/]/g, '').slice(0, alpha ? 8 : 6) || '';

export const getHex = (value?: string, alpha?: boolean): string =>
  value ? toHexFormat(value, alpha) : '';

export interface HsbType {
  h: number;
  s: number;
  b: number;
  a?: number;
}

/**
 * 纯色聚合类（精简版，仅支持纯色，不含渐变）。
 * 基于 @ctrl/tinycolor 提供 HSV / RGB / HEX 转换。
 */
export class AggregationColor {
  private metaColor: TinyColor;
  public cleared = false;

  constructor(color: string | HsbType | AggregationColor) {
    if (color instanceof AggregationColor) {
      this.metaColor = color.metaColor.clone();
      this.cleared = color.cleared;
      return;
    }
    if (typeof color === 'object' && color !== null) {
      // HSB 对象
      this.metaColor = new TinyColor({
        h: color.h,
        s: color.s,
        v: color.b,
        a: color.a,
      });
    } else {
      this.metaColor = new TinyColor((color as string) || '');
    }
    if (!color) {
      this.metaColor = this.metaColor.setAlpha(0);
      this.cleared = true;
    }
  }

  toHsb(): HsbType {
    const { h, s, v, a } = this.metaColor.toHsv();
    return { h, s, b: v, a };
  }

  toHsbString(): string {
    const { h, s, v } = this.metaColor.toHsv();
    return `hsb(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
  }

  toHex(): string {
    return getHex(this.toHexString(), this.metaColor.getAlpha() < 1);
  }

  toHexString(): string {
    return this.metaColor.toHexString();
  }

  toRgb() {
    const { r, g, b, a } = this.metaColor.toRgb();
    return { r, g, b, a };
  }

  toRgbString(): string {
    const { r, g, b, a } = this.metaColor.toRgb();
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  }

  equals(color: AggregationColor): boolean {
    return this.metaColor.toHex8String() === color.metaColor.toHex8String();
  }

  isGradient(): boolean {
    return false;
  }
}

export function generateColor(color: string | HsbType | AggregationColor): AggregationColor {
  if (color instanceof AggregationColor) {
    return color;
  }
  return new AggregationColor(color);
}

export function genAlphaColor(color: AggregationColor): AggregationColor {
  return new AggregationColor(color.toHexString());
}
