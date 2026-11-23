import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useMergedState from '../_util/hooks/useMergedState';
import type { VueNode } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import CheckableTag from './CheckableTag';
import useStyle from './style';

export type CheckableTagValue = string | number;

export interface CheckableTagOption<T extends CheckableTagValue = CheckableTagValue> {
  value: T;
  label: VueNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  icon?: VueNode;
}

export type CheckableTagGroupSemanticName = 'root' | 'item';
export type CheckableTagGroupSemanticClassNames = Partial<
  Record<CheckableTagGroupSemanticName, string>
>;
export type CheckableTagGroupSemanticStyles = Partial<
  Record<CheckableTagGroupSemanticName, CSSProperties>
>;

export type CheckableTagGroupClassNamesType =
  | CheckableTagGroupSemanticClassNames
  | ((info: { props: CheckableTagGroupProps }) => CheckableTagGroupSemanticClassNames);

export type CheckableTagGroupStylesType =
  | CheckableTagGroupSemanticStyles
  | ((info: { props: CheckableTagGroupProps }) => CheckableTagGroupSemanticStyles);

const isPlainObj = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const resolveSemantic = <T, P>(
  semantic: T | ((info: { props: P }) => T) | undefined,
  props: P,
): T | undefined => {
  if (typeof semantic === 'function') {
    return (semantic as (info: { props: P }) => T)({ props });
  }
  return semantic;
};

export const checkableTagGroupProps = () => ({
  prefixCls: String,
  rootClassName: String,
  id: String,
  options: {
    type: Array as PropType<(CheckableTagOption<CheckableTagValue> | CheckableTagValue)[]>,
    default: undefined,
  },
  multiple: { type: Boolean, default: false },
  value: {
    type: [String, Number, Array] as PropType<CheckableTagValue | CheckableTagValue[] | null>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Number, Array] as PropType<CheckableTagValue | CheckableTagValue[] | null>,
    default: undefined,
  },
  disabled: { type: Boolean, default: undefined },
  onChange: Function as PropType<(value: CheckableTagValue | CheckableTagValue[] | null) => void>,
  'onUpdate:value': Function as PropType<
    (value: CheckableTagValue | CheckableTagValue[] | null) => void
  >,
  classNames: [Object, Function] as PropType<CheckableTagGroupClassNamesType>,
  styles: [Object, Function] as PropType<CheckableTagGroupStylesType>,
});

export type CheckableTagGroupProps = Partial<
  ExtractPropTypes<ReturnType<typeof checkableTagGroupProps>>
>;

const CheckableTagGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACheckableTagGroup',
  inheritAttrs: false,
  props: checkableTagGroupProps(),
  setup(props, { emit, attrs }) {
    const { prefixCls, direction, configProvider } = useConfigInject('tag', props);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);
    const tagConfig = computed(() => configProvider.tag?.value as any);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const [mergedValue, setMergedValue] = useMergedState<
      CheckableTagValue | CheckableTagValue[] | null | undefined
    >(props.defaultValue, {
      value: computed(() => props.value),
    });

    const parsedOptions = computed<CheckableTagOption<CheckableTagValue>[]>(() => {
      if (!Array.isArray(props.options)) {
        return [];
      }
      return props.options.map(option => {
        if (isPlainObj(option)) {
          return option as CheckableTagOption<CheckableTagValue>;
        }
        return { value: option as CheckableTagValue, label: option as CheckableTagValue };
      });
    });

    const handleChange = (checked: boolean, option: CheckableTagOption<CheckableTagValue>) => {
      let newValue: CheckableTagValue | CheckableTagValue[] | null = null;
      if (props.multiple) {
        const valueList = Array.isArray(mergedValue.value)
          ? (mergedValue.value as CheckableTagValue[])
          : [];
        newValue = checked
          ? [...valueList, option.value]
          : valueList.filter(item => item !== option.value);
      } else {
        newValue = checked ? option.value : null;
      }

      setMergedValue(newValue);
      emit('update:value', newValue);
      emit('change', newValue);
    };

    return () => {
      const groupPrefixCls = `${prefixCls.value}-checkable-group`;
      const ctxTag = tagConfig.value;
      const mergedPropsForSemantic: CheckableTagGroupProps = {
        ...props,
        disabled: mergedDisabled.value,
      };
      const mergedClassNames = mergeSemanticClassNames<CheckableTagGroupSemanticClassNames>(
        resolveSemantic(ctxTag?.classNames, mergedPropsForSemantic),
        resolveSemantic(props.classNames, mergedPropsForSemantic),
      );
      const mergedStyles = mergeSemanticStyles<CheckableTagGroupSemanticStyles>(
        resolveSemantic(ctxTag?.styles, mergedPropsForSemantic),
        resolveSemantic(props.styles, mergedPropsForSemantic),
      );

      return wrapSSR(
        <div
          {...attrs}
          id={props.id}
          class={[
            groupPrefixCls,
            ctxTag?.className,
            props.rootClassName,
            {
              [`${groupPrefixCls}-disabled`]: mergedDisabled.value,
              [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
            },
            hashId.value,
            attrs.class,
            mergedClassNames.root,
          ]}
          style={[ctxTag?.style, mergedStyles.root, attrs.style as CSSProperties]}
        >
          {parsedOptions.value.map(option => {
            const isChecked = props.multiple
              ? (Array.isArray(mergedValue.value) ? mergedValue.value : []).includes(option.value)
              : mergedValue.value === option.value;
            return (
              <CheckableTag
                key={option.value}
                prefixCls={props.prefixCls}
                class={classNames(
                  `${groupPrefixCls}-item`,
                  mergedClassNames.item,
                  option.className,
                )}
                style={[mergedStyles.item, option.style]}
                checked={isChecked}
                icon={option.icon}
                disabled={option.disabled ?? mergedDisabled.value}
                onChange={checked => handleChange(checked, option)}
              >
                {option.label}
              </CheckableTag>
            );
          })}
        </div>,
      );
    };
  },
});

export default CheckableTagGroup;
