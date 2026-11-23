import type { RadioProps } from './Radio';
import type { ComputedRef, Ref } from 'vue';
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
}

export type RadioOptionTypeContextProps = RadioGroupOptionType;
