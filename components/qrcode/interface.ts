import type { VueNode } from '../_util/type';
import { functionType, objectType, stringType } from '../_util/type';
import type { Locale } from '../locale';

export type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

export interface StatusRenderInfo {
  status: Exclude<QRStatus, 'active'>;
  locale: Locale['QRCode'];
  onRefresh?: (e?: MouseEvent) => void;
}

export interface ImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
}
export const qrProps = () => {
  return {
    size: { type: Number, default: 160 },
    value: { type: String, required: true },
    type: stringType<'canvas' | 'svg'>('canvas'),
    color: String,
    bgColor: String,
    includeMargin: Boolean,
    imageSettings: objectType<ImageSettings>(),
  };
};

export const qrcodeProps = () => {
  return {
    ...qrProps(),
    rootClassName: String,
    errorLevel: stringType<'L' | 'M' | 'Q' | 'H'>('M'),

    icon: String,
    iconSize: { type: Number, default: 40 },

    status: stringType<QRStatus>('active'),
    /** 5.20+ 自定义状态渲染 */
    statusRender: functionType<(info: StatusRenderInfo) => VueNode>(),
    /** 点击刷新按钮回调（status=expired 时） */
    onRefresh: functionType<(e?: MouseEvent) => void>(),
    bordered: { type: Boolean, default: true },
  };
};

export interface QRCodeCanvasColor {
  dark?: string; // 默认#000000ff
  light?: string; // 默认#ffffffff
}

export interface QRCodeCanvasOptions {
  version?: number;
  errorCorrectionLevel?: string; // 默认"M"
  maskPattern?: number; // 遮罩符号的掩码图案
  toSJISFunc?: Function; // 将汉字转换为其 Shift JIS 值的帮助程序函数
  margin?: number;
  scale?: number;
  small?: boolean;
  width: number;
  color?: QRCodeCanvasColor;
}
