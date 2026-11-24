import type { CSSProperties, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';
import { booleanType, functionType, stringType, arrayType } from '../_util/type';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type CheckboxSemanticName = 'root' | 'icon' | 'label';
export type CheckboxSemanticClassNames = SemanticClassNames<CheckboxSemanticName>;
export type CheckboxSemanticStyles = SemanticStyles<CheckboxSemanticName>;
export type CheckboxClassNamesType =
  | CheckboxSemanticClassNames
  | ((info: { props: CheckboxProps }) => CheckboxSemanticClassNames);
export type CheckboxStylesType =
  | CheckboxSemanticStyles
  | ((info: { props: CheckboxProps }) => CheckboxSemanticStyles);

export type CheckboxGroupSemanticName = 'root' | 'item' | 'itemIcon' | 'itemLabel';
export type CheckboxGroupSemanticClassNames = SemanticClassNames<CheckboxGroupSemanticName>;
export type CheckboxGroupSemanticStyles = SemanticStyles<CheckboxGroupSemanticName>;
export type CheckboxGroupClassNamesType =
  | CheckboxGroupSemanticClassNames
  | ((info: { props: CheckboxGroupProps }) => CheckboxGroupSemanticClassNames);
export type CheckboxGroupStylesType =
  | CheckboxGroupSemanticStyles
  | ((info: { props: CheckboxGroupProps }) => CheckboxGroupSemanticStyles);

export type CheckboxValueType = string | number | boolean;
export interface CheckboxOptionType {
  label?: VueNode;
  value: CheckboxValueType;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
  id?: string;
  required?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export const abstractCheckboxGroupProps = () => {
  return {
    name: String,
    prefixCls: String,
    rootClassName: String,
    options: arrayType<Array<CheckboxOptionType | string | number>>(
      [] as Array<CheckboxOptionType | string | number>,
    ),
    disabled: Boolean,
    id: String,
    classNames: {
      type: [Object, Function] as PropType<CheckboxGroupClassNamesType>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<CheckboxGroupStylesType>,
      default: undefined,
    },
  };
};

export const checkboxGroupProps = () => {
  return {
    ...abstractCheckboxGroupProps(),
    defaultValue: arrayType<Array<CheckboxValueType>>(),
    value: arrayType<Array<CheckboxValueType>>(),
    onChange: functionType<(checkedValue: Array<CheckboxValueType>) => void>(),
    'onUpdate:value': functionType<(checkedValue: Array<CheckboxValueType>) => void>(),
  };
};

export type CheckboxGroupProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxGroupProps>>>;

export const abstractCheckboxProps = () => {
  return {
    prefixCls: String,
    rootClassName: String,
    defaultChecked: booleanType(),
    checked: booleanType(),
    required: booleanType(),
    disabled: booleanType(),
    isGroup: booleanType(),
    value: PropTypes.any,
    name: String,
    id: String,
    title: String,
    indeterminate: booleanType(),
    type: stringType('checkbox'),
    autofocus: booleanType(),
    classNames: {
      type: [Object, Function] as PropType<CheckboxClassNamesType>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<CheckboxStylesType>,
      default: undefined,
    },
    onChange: functionType<(e: CheckboxChangeEvent) => void>(),
    'onUpdate:checked': functionType<(checked: boolean) => void>(),
    onClick: functionType<MouseEventHandler>(),
    skipGroup: booleanType(false),
  };
};

export const checkboxProps = () => {
  return {
    ...abstractCheckboxProps(),
    indeterminate: booleanType(false),
  };
};

export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>;

export type CheckboxGroupContext = {
  cancelValue: (id: Symbol) => void;
  registerValue: (id: Symbol, value: string) => void;
  toggleOption: (option: CheckboxOptionType) => void;
  name: Ref<string>;
  disabled: Ref<boolean>;
  mergedValue: Ref<CheckboxValueType[]>;
  classNames?: Ref<CheckboxSemanticClassNames | undefined>;
  styles?: Ref<CheckboxSemanticStyles | undefined>;
};
export const CheckboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('CheckboxGroupContext');
