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

export interface GradientColorPoint {
  color: AggregationColor;
  percent: number;
}

/**
 * 颜色聚合类：支持纯色与渐变色（colors 数组）。
 * 基于 @ctrl/tinycolor 提供 HSV / RGB / HEX 转换。
 */
/** 解析 linear-gradient 字符串为渐变色点数组 */
export function parseGradientString(str: string): GradientColorPoint[] | null {
  const m = str.match(/^linear-gradient\((.*)\)$/i);
  if (!m) return null;
  // 匹配 color percent%（color 可为 rgb(...) / rgba(...) / #hex）
  const colorRe = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s+(\d+(?:\.\d+)?)%/g;
  const points: GradientColorPoint[] = [];
  let match;
  while ((match = colorRe.exec(m[1])) !== null) {
    points.push({
      color: new AggregationColor(match[1]),
      percent: parseFloat(match[2]),
    });
  }
  return points.length >= 2 ? points : null;
}

export class AggregationColor {
  private metaColor: TinyColor;
  private colors?: GradientColorPoint[];
  public cleared = false;

  constructor(
    color:
      | string
      | HsbType
      | AggregationColor
      | GradientColorPoint[]
      | { r: number; g: number; b: number; a?: number },
  ) {
    if (color instanceof AggregationColor) {
      this.metaColor = color.metaColor.clone();
      this.colors = color.colors?.map(info => ({
        color: new AggregationColor(info.color),
        percent: info.percent,
      }));
      this.cleared = color.cleared;
      return;
    }
    const isArray = Array.isArray(color);
    // 解析 linear-gradient 字符串
    if (typeof color === 'string' && color.startsWith('linear-gradient')) {
      const parsed = parseGradientString(color);
      if (parsed) {
        this.colors = parsed;
        this.metaColor = parsed[0].color.metaColor.clone();
        return;
      }
    }
    if (isArray && color.length) {
      this.colors = color.map(({ color: c, percent }) => ({
        color: new AggregationColor(c),
        percent,
      }));
      this.metaColor = this.colors[0].color.metaColor.clone();
    } else if (typeof color === 'object' && color !== null && !isArray) {
      if ('h' in color && 's' in color) {
        // HSB 对象
        this.metaColor = new TinyColor({
          h: color.h,
          s: color.s,
          v: color.b,
          a: color.a,
        });
      } else {
        // RGB 对象
        this.metaColor = new TinyColor(color as any);
      }
    } else {
      this.metaColor = new TinyColor((color as string) || '');
    }
    if (!color || (isArray && !this.colors)) {
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

  isGradient(): boolean {
    return !!this.colors && !this.cleared;
  }

  getColors(): GradientColorPoint[] {
    return this.colors || [{ color: this, percent: 0 }];
  }

  toCssString(): string {
    const { colors } = this;
    if (colors) {
      const colorsStr = colors.map(c => `${c.color.toRgbString()} ${c.percent}%`).join(', ');
      return `linear-gradient(90deg, ${colorsStr})`;
    }
    return this.metaColor.toRgbString();
  }

  equals(color: AggregationColor): boolean {
    if (!color || this.isGradient() !== color.isGradient()) {
      return false;
    }
    if (!this.isGradient()) {
      return this.toHexString() === color.toHexString();
    }
    return (
      this.colors!.length === color.colors!.length &&
      this.colors!.every((c, i) => {
        const target = color.colors![i];
        return c.percent === target.percent && c.color.equals(target.color);
      })
    );
  }
}

export function generateColor(
  color:
    | string
    | HsbType
    | AggregationColor
    | GradientColorPoint[]
    | { r: number; g: number; b: number; a?: number },
): AggregationColor {
  if (color instanceof AggregationColor) {
    return color;
  }
  return new AggregationColor(color);
}

export function genAlphaColor(color: AggregationColor, alpha?: number): AggregationColor {
  const rgba = color.toRgb();
  if (!rgba.r && !rgba.g && !rgba.b) {
    const hsba = color.toHsb();
    hsba.a = alpha || 1;
    return generateColor(hsba);
  }
  rgba.a = alpha || 1;
  return generateColor(rgba);
}

export const getRoundNumber = (value: number) => Math.round(Number(value || 0));

export const getColorAlpha = (color: AggregationColor) =>
  getRoundNumber((color.toHsb().a ?? 1) * 100);

/** 获取渐变百分比位置的颜色插值 */
export const getGradientPercentColor = (
  colors: { color: AggregationColor; percent: number }[],
  percent: number,
): string => {
  const filledColors = [
    { percent: 0, color: colors[0].color },
    ...colors,
    { percent: 100, color: colors[colors.length - 1].color },
  ];
  for (let i = 0; i < filledColors.length - 1; i += 1) {
    const startPtg = filledColors[i].percent;
    const endPtg = filledColors[i + 1].percent;
    const startColor = filledColors[i].color;
    const endColor = filledColors[i + 1].color;
    if (startPtg <= percent && percent <= endPtg) {
      const dist = endPtg - startPtg;
      if (dist === 0) {
        return startColor.toRgbString();
      }
      const ratio = ((percent - startPtg) / dist) * 100;
      const startRgb = startColor.toRgb();
      const endRgb = endColor.toRgb();
      const mix = (a: number, b: number) => Math.round(a + ((b - a) * ratio) / 100);
      const r = mix(startRgb.r, endRgb.r);
      const g = mix(startRgb.g, endRgb.g);
      const b = mix(startRgb.b, endRgb.b);
      const a = startRgb.a + ((endRgb.a - startRgb.a) * ratio) / 100;
      return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    }
  }
  return '';
};
