import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import omit from '../_util/omit';
import type { VueNode } from '../_util/type';
import { eventType } from '../_util/type';
import type { CompositionEventHandler } from '../_util/EventInterface';
import { inputProps as vcInputProps } from '../vc-input/inputProps';
import type { Variant } from '../config-provider/context';
import type { SemanticValue } from './util';

export type InputSemanticName = 'root' | 'prefix' | 'suffix' | 'input' | 'count';
export type InputSemanticClassNames = Partial<Record<InputSemanticName, string>>;
export type InputSemanticStyles = Partial<Record<InputSemanticName, CSSProperties>>;
export type InputClassNamesType<P = Record<string, any>> = SemanticValue<
  InputSemanticClassNames,
  P
>;
export type InputStylesType<P = Record<string, any>> = SemanticValue<InputSemanticStyles, P>;

export type TextAreaSemanticName = 'root' | 'textarea' | 'input' | 'count' | 'suffix';
export type TextAreaSemanticClassNames = Partial<Record<TextAreaSemanticName, string>>;
export type TextAreaSemanticStyles = Partial<Record<TextAreaSemanticName, CSSProperties>>;
export type TextAreaClassNamesType<P = Record<string, any>> = SemanticValue<
  TextAreaSemanticClassNames,
  P
>;
export type TextAreaStylesType<P = Record<string, any>> = SemanticValue<TextAreaSemanticStyles, P>;

export const inputDefaultValue = Symbol() as unknown as string;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}
const inputProps = () => {
  return {
    ...omit(vcInputProps(), [
      'wrapperClassName',
      'groupClassName',
      'inputClassName',
      'affixWrapperClassName',
    ]),
    variant: { type: String as PropType<Variant> },
    rootClassName: String,
    /** 语义化 classNames（支持对象与函数式）：root / prefix / suffix / input / count */
    classNames: {
      type: [Object, Function] as PropType<InputClassNamesType>,
      default: undefined,
    },
    /** 语义化 styles（支持对象与函数式）：root / prefix / suffix / input / count */
    styles: {
      type: [Object, Function] as PropType<InputStylesType>,
      default: undefined,
    },
  };
};
export default inputProps;
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;
export interface ShowCountProps {
  formatter: (args: { count: number; maxlength?: number }) => VueNode;
}
const textAreaProps = () => ({
  ...omit(inputProps(), ['prefix', 'addonBefore', 'addonAfter', 'suffix']),
  classNames: {
    type: [Object, Function] as PropType<TextAreaClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<TextAreaStylesType>,
    default: undefined,
  },
  rows: Number,
  autosize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  autoSize: { type: [Boolean, Object] as PropType<boolean | AutoSizeType>, default: undefined },
  onResize: { type: Function as PropType<(size: { width: number; height: number }) => void> },
  onCompositionstart: eventType<CompositionEventHandler>(),
  onCompositionend: eventType<CompositionEventHandler>(),
  valueModifiers: Object,
});

export { textAreaProps };

export type TextAreaProps = Partial<ExtractPropTypes<ReturnType<typeof textAreaProps>>>;
