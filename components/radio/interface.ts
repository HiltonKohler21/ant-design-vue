import type { RadioProps } from './Radio';
import type { RadioGroupProps } from './Group';
import type { ComputedRef, Ref } from 'vue';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type RadioSemanticName = 'root' | 'icon' | 'label';
export type RadioSemanticClassNames = SemanticClassNames<RadioSemanticName>;
export type RadioSemanticStyles = SemanticStyles<RadioSemanticName>;
export type RadioClassNamesType =
  | RadioSemanticClassNames
  | ((info: { props: RadioProps }) => RadioSemanticClassNames);
export type RadioStylesType =
  | RadioSemanticStyles
  | ((info: { props: RadioProps }) => RadioSemanticStyles);

export type RadioGroupSemanticName = 'root' | 'item' | 'itemIcon' | 'itemLabel';
export type RadioGroupSemanticClassNames = SemanticClassNames<RadioGroupSemanticName>;
export type RadioGroupSemanticStyles = SemanticStyles<RadioGroupSemanticName>;
export type RadioGroupClassNamesType =
  | RadioGroupSemanticClassNames
  | ((info: { props: RadioGroupProps }) => RadioGroupSemanticClassNames);
export type RadioGroupStylesType =
  | RadioGroupSemanticStyles
  | ((info: { props: RadioGroupProps }) => RadioGroupSemanticStyles);

export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean;
}

export type RadioGroupButtonStyle = 'outline' | 'solid';
export type RadioGroupOptionType = 'default' | 'button';
export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioChangeEvent {
  target: RadioChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface RadioGroupContext {
  onChange: (e: RadioChangeEvent) => void;
  value: Ref<any>;
  disabled: Ref<boolean>;
  name: Ref<string>;
  /**
   * Control the appearance for Radio to display as button or not
   *
   * @default 'default'
   * @internal
   */
  optionType?: Ref<RadioGroupOptionType>;
  block?: ComputedRef<boolean>;
  classNames?: Ref<RadioSemanticClassNames | undefined>;
  styles?: Ref<RadioSemanticStyles | undefined>;
}

export type RadioOptionTypeContextProps = RadioGroupOptionType;
