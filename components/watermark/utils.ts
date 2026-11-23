import type { CSSProperties } from 'vue';

export interface WatermarkFontType {
  color?: CanvasFillStrokeStyles['fillStyle'];
  fontSize?: number | string;
  fontWeight?: 'normal' | 'light' | 'lighter' | 'weight' | 'bold' | 'bolder' | number;
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
  fontFamily?: string;
  textAlign?: CanvasTextAlign;
}

export type WatermarkFont = WatermarkFontType;

export interface WatermarkText {
  text: string;
  font?: WatermarkFontType;
}

export type WatermarkContent = string | WatermarkText;

export interface WatermarkContentLine {
  text: string;
  font: Required<WatermarkFontType>;
}

/** converting camel-cased strings to be lowercase and link it with Separator */
export function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getStyleStr(style: CSSProperties): string {
  return Object.keys(style)
    .map((key: keyof CSSProperties) => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(' ');
}

/** Returns the ratio of the device's physical pixel resolution to the css pixel resolution */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

export function getFontSize(font: Required<WatermarkFontType>, ratio = 1): number {
  return Number(font.fontSize) * ratio;
}

export function getCanvasFont(
  font: Required<WatermarkFontType>,
  ratio = 1,
  lineHeight?: number,
): string {
  const mergedLineHeight = lineHeight === undefined ? '' : `/${lineHeight}px`;
  const fontStyle = font.fontStyle === 'none' ? 'normal' : font.fontStyle;

  return `${fontStyle} normal ${font.fontWeight} ${getFontSize(font, ratio)}px${mergedLineHeight} ${
    font.fontFamily
  }`;
}

export function isWatermarkText(
  content: WatermarkContent | null | undefined,
): content is WatermarkText {
  return typeof content === 'object' && content !== null && 'text' in content;
}

export function getContentLines(
  content: WatermarkContent | WatermarkContent[] | undefined,
  defaultFont: Required<WatermarkFontType>,
): WatermarkContentLine[] {
  if (content === undefined || content === null) {
    return [];
  }
  const list = Array.isArray(content) ? content : [content];
  return list
    .filter((item): item is WatermarkContent => item !== undefined && item !== null)
    .map(item => {
      if (isWatermarkText(item)) {
        const lineFont = item.font || {};
        return {
          text: item.text ?? '',
          font: {
            color: lineFont.color ?? defaultFont.color,
            fontSize: lineFont.fontSize ?? defaultFont.fontSize,
            fontWeight: lineFont.fontWeight ?? defaultFont.fontWeight,
            fontStyle: lineFont.fontStyle ?? defaultFont.fontStyle,
            fontFamily: lineFont.fontFamily ?? defaultFont.fontFamily,
            textAlign: lineFont.textAlign ?? defaultFont.textAlign,
          },
        };
      }
      return {
        text: String(item),
        font: defaultFont,
      };
    });
}

/** Rotate with the watermark as the center point */
export function rotateWatermark(
  ctx: CanvasRenderingContext2D,
  rotateX: number,
  rotateY: number,
  rotate: number,
) {
  ctx.translate(rotateX, rotateY);
  ctx.rotate((Math.PI / 180) * Number(rotate));
  ctx.translate(-rotateX, -rotateY);
}

/** Whether to re-render the watermark */
export const reRendering = (mutation: MutationRecord, watermarkElement?: HTMLElement) => {
  let flag = false;
  // Whether to delete the watermark node
  if (mutation.removedNodes.length) {
    flag = Array.from(mutation.removedNodes).some(node => node === watermarkElement);
  }
  // Whether the watermark dom property value has been modified
  if (mutation.type === 'attributes' && mutation.target === watermarkElement) {
    flag = true;
  }
  return flag;
};
