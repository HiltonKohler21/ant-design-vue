import { nextTick, defineComponent, ref, watch, computed } from 'vue';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { booleanType, stringType, arrayType, functionType } from '../_util/type';
import type {
  RadioChangeEvent,
  RadioGroupButtonStyle,
  RadioGroupClassNamesType,
  RadioGroupOptionType,
  RadioGroupOrientation,
  RadioGroupSemanticClassNames,
  RadioGroupSemanticStyles,
  RadioGroupStylesType,
  RadioSemanticClassNames,
  RadioSemanticStyles,
} from './interface';
import { useInjectFormItemContext } from '../form/FormItemContext';
import { useProvideRadioGroupContext } from './context';

// CSSINJS
import useStyle from './style';

const RadioGroupSizeTypes = ['large', 'default', 'small'] as const;

export type RadioGroupSize = (typeof RadioGroupSizeTypes)[number];

export type RadioGroupOption = RadioGroupOptionType;

export type RadioGroupChildOption = {
  label?: any;
  value: any;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
  id?: string;
  required?: boolean;
  onChange?: (e: RadioChangeEvent) => void;
};

export const radioGroupProps = () => ({
  prefixCls: String,
  rootClassName: String,
  value: PropTypes.any,
  /** 非受控默认值 */
  defaultValue: PropTypes.any,
  size: stringType<RadioGroupSize>(),
  options: arrayType<Array<string | RadioGroupChildOption | number>>(),
  disabled: booleanType(),
  name: String,
  buttonStyle: stringType<RadioGroupButtonStyle>('outline'),
  id: String,
  optionType: stringType<RadioGroupOptionType>('default'),
  block: booleanType(),
  orientation: stringType<RadioGroupOrientation>(),
  vertical: booleanType(),
  classNames: {
    type: [Object, Function] as PropType<RadioGroupClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<RadioGroupStylesType>,
    default: undefined,
  },
  onChange: functionType<(e: RadioChangeEvent) => void>(),
  'onUpdate:value': functionType<(val: any) => void>(),
});

export type RadioGroupProps = Partial<ExtractPropTypes<ReturnType<typeof radioGroupProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ARadioGroup',
  inheritAttrs: false,
  props: radioGroupProps(),
  // emits: ['update:value', 'change'],
  setup(props, { slots, emit, attrs }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction, size } = useConfigInject('radio', props);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const stateValue = ref(props.value ?? props.defaultValue);
    const updatingValue = ref<boolean>(false);
    watch(
      () => props.value,
      val => {
        stateValue.value = val;
        updatingValue.value = false;
      },
    );

    const onRadioChange = (ev: RadioChangeEvent) => {
      const lastValue = stateValue.value;
      const { value } = ev.target;

      if (!('value' in props)) {
        stateValue.value = value;
      }
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!updatingValue.value && value !== lastValue) {
        updatingValue.value = true;
        emit('update:value', value);
        emit('change', ev);
        formItemContext.onFieldChange();
      }
      nextTick(() => {
        updatingValue.value = false;
      });
    };

    const isVertical = computed(() => {
      if (props.orientation !== undefined) {
        return props.orientation === 'vertical';
      }
      return !!props.vertical;
    });

    const mergedSemantic = computed(() =>
      mergeSemantic<RadioGroupSemanticClassNames, RadioGroupSemanticStyles, RadioGroupProps>(
        [props.classNames],
        [props.styles],
        {
          props: {
            ...props,
            value: stateValue.value,
            orientation: isVertical.value ? 'vertical' : 'horizontal',
            vertical: isVertical.value,
          },
        },
      ),
    );

    const itemSemanticClassNames = computed<RadioSemanticClassNames | undefined>(() => {
      const cn = mergedSemantic.value[0];
      if (!cn.item && !cn.itemIcon && !cn.itemLabel) return undefined;
      return {
        root: cn.item,
        icon: cn.itemIcon,
        label: cn.itemLabel,
      };
    });

    const itemSemanticStyles = computed<RadioSemanticStyles | undefined>(() => {
      const st = mergedSemantic.value[1];
      if (!st.item && !st.itemIcon && !st.itemLabel) return undefined;
      return {
        root: st.item,
        icon: st.itemIcon,
        label: st.itemLabel,
      };
    });

    useProvideRadioGroupContext({
      onChange: onRadioChange,
      value: stateValue,
      disabled: computed(() => props.disabled),
      name: computed(() => props.name),
      optionType: computed(() => props.optionType),
      block: computed(() => props.block),
      classNames: itemSemanticClassNames,
      styles: itemSemanticStyles,
    });

    return () => {
      const { options, buttonStyle, id = formItemContext.id.value } = props;
      const [mergedClassNames, mergedStyles] = mergedSemantic.value;

      const groupPrefixCls = `${prefixCls.value}-group`;

      const classString = classNames(
        groupPrefixCls,
        `${groupPrefixCls}-${buttonStyle}`,
        {
          [`${groupPrefixCls}-${size.value}`]: size.value,
          [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
          [`${groupPrefixCls}-block`]: props.block,
          [`${groupPrefixCls}-vertical`]: isVertical.value,
        },
        props.rootClassName,
        mergedClassNames.root,
        attrs.class,
        hashId.value,
      );

      let children = null;
      if (options && options.length > 0) {
        children = options.map(option => {
          if (typeof option === 'string' || typeof option === 'number') {
            return (
              <Radio
                key={option}
                prefixCls={prefixCls.value}
                disabled={props.disabled}
                value={option}
                checked={stateValue.value === option}
              >
                {option}
              </Radio>
            );
          }
          const {
            value,
            disabled,
            label,
            className,
            style,
            title,
            id: optId,
            required,
            onChange,
          } = option as RadioGroupChildOption;
          return (
            <Radio
              key={`radio-group-value-options-${value}`}
              prefixCls={prefixCls.value}
              disabled={disabled || props.disabled}
              value={value}
              checked={stateValue.value === value}
              class={className}
              style={style}
              title={title}
              id={optId}
              required={required}
              onChange={onChange}
            >
              {label}
            </Radio>
          );
        });
      } else {
        children = slots.default?.();
      }
      const mergedRootStyle = mergedStyles.root
        ? [mergedStyles.root, attrs.style as CSSProperties]
        : (attrs.style as CSSProperties);
      return wrapSSR(
        <div {...attrs} class={classString} style={mergedRootStyle} id={id}>
          {children}
        </div>,
      );
    };
  },
});
