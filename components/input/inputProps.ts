import type { ExtractPropTypes, PropType } from 'vue';
import omit from '../_util/omit';
import type { VueNode } from '../_util/type';
import { eventType } from '../_util/type';
import type { CompositionEventHandler } from '../_util/EventInterface';
import { inputProps as vcInputProps } from '../vc-input/inputProps';
import type { Variant } from '../config-provider/context';
import type { InputSemanticName, SemanticNames, SemanticStylesMap } from '../_util/semantic';

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
    /** 语义化 classNames（antd 5.25+）：prefix / suffix / input / count */
    classNames: {
      type: Object as PropType<SemanticNames<InputSemanticName>>,
      default: undefined,
    },
    /** 语义化 styles（antd 5.25+）：prefix / suffix / input / count */
    styles: {
      type: Object as PropType<SemanticStylesMap<InputSemanticName>>,
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
