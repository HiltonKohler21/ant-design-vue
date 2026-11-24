import type { PropType } from 'vue';
import type { VueNode } from '../_util/type';
import { functionType, objectType, someType, stringType } from '../_util/type';
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import type { Locale } from '../locale';

export type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

export type QRCodeSemanticName = 'root' | 'cover';
export type QRCodeSemanticClassNames = SemanticClassNames<QRCodeSemanticName>;
export type QRCodeSemanticStyles = SemanticStyles<QRCodeSemanticName>;
export type QRCodeClassNamesType = SemanticClassNamesType<Record<string, any>, QRCodeSemanticName>;
export type QRCodeStylesType = SemanticStylesType<Record<string, any>, QRCodeSemanticName>;

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
    value: { type: [String, Array] as PropType<string | string[]>, required: true },
    type: stringType<'canvas' | 'svg'>('canvas'),
    color: String,
    bgColor: String,
    includeMargin: Boolean,
    marginSize: Number,
    imageSettings: objectType<ImageSettings>(),
  };
};

export const qrcodeProps = () => {
  return {
    ...qrProps(),
    rootClassName: String,
    classNames: someType<QRCodeClassNamesType>([Object, Function]),
    styles: someType<QRCodeStylesType>([Object, Function]),
    errorLevel: stringType<'L' | 'M' | 'Q' | 'H'>('M'),
    boostLevel: { type: Boolean, default: true },

    icon: String,
    iconSize: {
      type: [Number, Object] as PropType<number | { width: number; height: number }>,
      default: 40,
    },

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
