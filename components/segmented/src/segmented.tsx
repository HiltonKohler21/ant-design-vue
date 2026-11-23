import { defineComponent, shallowRef, computed } from 'vue';
import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import classNames from '../../_util/classNames';
import { useMergeSemantic } from '../../_util/hooks/useMergeSemantic';
import type { SemanticClassNames, SemanticStyles } from '../../_util/hooks/useMergeSemantic';
import useConfigInject, { useComponentConfig } from '../../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../../_util/props-util';
import useStyle from '../style';
import type { CustomSlotsType, VueNode } from '../../_util/type';
import { functionType, someType, arrayType, booleanType, stringType } from '../../_util/type';
import type { ChangeEvent } from '../../_util/EventInterface';
import MotionThumb from './MotionThumb';
export type SegmentedValue = string | number;
export type segmentedSize = 'large' | 'small';
export type SegmentedOrientation = 'horizontal' | 'vertical';

export type SegmentedSemanticName = 'root' | 'icon' | 'label' | 'item';
export type SegmentedSemanticClassNames = SemanticClassNames<SegmentedSemanticName>;
export type SegmentedSemanticStyles = SemanticStyles<SegmentedSemanticName>;
export type SegmentedClassNamesType =
  | SegmentedSemanticClassNames
  | ((info: { props: SegmentedProps }) => SegmentedSemanticClassNames);
export type SegmentedStylesType =
  | SegmentedSemanticStyles
  | ((info: { props: SegmentedProps }) => SegmentedSemanticStyles);

export interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any;
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
  icon?: VueNode;
}
export interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}

function normalizeOptions(options: (SegmentedOption | string | number)[]) {
  return options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return option;
    }

    return {
      label: option?.toString(),
      title: option?.toString(),
      value: option as unknown as SegmentedBaseOption['value'],
    };
  });
}
export const segmentedProps = () => {
  return {
    prefixCls: String,
    rootClassName: String,
    options: arrayType<(SegmentedOption | string | number)[]>(),
    block: booleanType(),
    disabled: booleanType(),
    size: stringType<segmentedSize>(),
    shape: stringType<'default' | 'round'>(),
    /** 方向（antd 6.x 推荐，优先级高于 vertical） */
    orientation: stringType<SegmentedOrientation>(),
    vertical: booleanType(),
    /** 语义化 classNames（antd 6.x 支持对象或函数）：root / icon / label / item */
    classNames: {
      type: [Object, Function] as PropType<SegmentedClassNamesType>,
      default: undefined,
    },
    /** 语义化 styles（antd 6.x 支持对象或函数）：root / icon / label / item */
    styles: {
      type: [Object, Function] as PropType<SegmentedStylesType>,
      default: undefined,
    },
    value: { ...someType<SegmentedValue>([String, Number]), required: true },
    motionName: String,
    onChange: functionType<(val: SegmentedValue) => void>(),
    'onUpdate:value': functionType<(val: SegmentedValue) => void>(),
  };
};
export type SegmentedProps = Partial<ExtractPropTypes<ReturnType<typeof segmentedProps>>>;

const SegmentedOption: FunctionalComponent<
  SegmentedOption & {
    prefixCls: string;
    checked: boolean;
    semanticClassNames?: SegmentedSemanticClassNames;
    semanticStyles?: SegmentedSemanticStyles;
    onChange: (_event: ChangeEvent, val: SegmentedValue) => void;
  }
> = (props, { slots, emit }) => {
  const {
    value,
    disabled,
    payload,
    title,
    prefixCls,
    label = slots.label,
    icon,
    checked,
    className,
    semanticClassNames,
    semanticStyles,
  } = props;
  const handleChange = (event: InputEvent) => {
    if (disabled) {
      return;
    }

    emit('change', event, value);
  };

  const hasIcon = icon !== undefined && icon !== null && icon !== false;
  const optionInfo = {
    value,
    disabled,
    payload,
    title,
  };
  const resolvedLabel = typeof label === 'function' ? label(optionInfo) : label;

  return (
    <label
      class={classNames(
        {
          [`${prefixCls}-item-disabled`]: disabled,
        },
        className,
        semanticClassNames?.item,
      )}
      style={semanticStyles?.item}
    >
      <input
        class={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div
        class={classNames(`${prefixCls}-item-label`, semanticClassNames?.label)}
        style={semanticStyles?.label}
        title={typeof title === 'string' ? title : ''}
      >
        {hasIcon ? (
          <>
            <span
              class={classNames(`${prefixCls}-item-icon`, semanticClassNames?.icon)}
              style={semanticStyles?.icon}
            >
              {typeof icon === 'function' ? (icon as any)(optionInfo) : icon}
            </span>
            {resolvedLabel !== undefined && resolvedLabel !== null && resolvedLabel !== false && (
              <span>{resolvedLabel}</span>
            )}
          </>
        ) : (
          resolvedLabel ?? value
        )}
      </div>
    </label>
  );
};
SegmentedOption.inheritAttrs = false;

export default defineComponent({
  name: 'ASegmented',
  inheritAttrs: false,
  props: initDefaultProps(segmentedProps(), {
    options: [],
    motionName: 'thumb-motion',
  }),
  slots: Object as CustomSlotsType<{
    label: SegmentedBaseOption;
  }>,
  setup(props, { emit, slots, attrs }) {
    const { prefixCls, direction, size } = useConfigInject('segmented', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('segmented');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootRef = shallowRef<HTMLDivElement>();
    const thumbShow = shallowRef(false);

    const mergedVertical = computed<boolean>(() => {
      if (props.orientation !== undefined) {
        return props.orientation === 'vertical';
      }
      return !!props.vertical;
    });

    const mergedOrientation = computed<SegmentedOrientation>(() =>
      mergedVertical.value ? 'vertical' : 'horizontal',
    );

    const mergedPropsForSemantic = computed<SegmentedProps>(() => ({
      ...props,
      size: size.value as segmentedSize,
      shape: props.shape ?? 'default',
      vertical: mergedVertical.value,
      orientation: mergedOrientation.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SegmentedSemanticClassNames,
      SegmentedSemanticStyles,
      SegmentedProps
    >(
      () => [contextClassNames.value, props.classNames],
      () => [contextStyles.value, props.styles],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const segmentedOptions = computed(() => normalizeOptions(props.options));
    const handleChange = (_event: ChangeEvent, val: SegmentedValue) => {
      if (props.disabled) {
        return;
      }
      emit('update:value', val);
      emit('change', val);
    };
    return () => {
      const pre = prefixCls.value;
      return wrapSSR(
        <div
          {...attrs}
          class={classNames(
            pre,
            props.rootClassName,
            contextClassName.value,
            mergedClassNames.value.root,
            {
              [hashId.value]: true,
              [`${pre}-block`]: props.block,
              [`${pre}-vertical`]: mergedVertical.value,
              [`${pre}-shape-${props.shape}`]: props.shape === 'round',
              [`${pre}-disabled`]: props.disabled,
              [`${pre}-lg`]: size.value == 'large',
              [`${pre}-sm`]: size.value == 'small',
              [`${pre}-rtl`]: direction.value === 'rtl',
            },
            attrs.class,
          )}
          style={[contextStyle.value, mergedStyles.value.root, attrs.style as CSSProperties]}
          ref={rootRef}
        >
          <div class={`${pre}-group`}>
            <MotionThumb
              containerRef={rootRef}
              prefixCls={pre}
              value={props.value}
              motionName={`${pre}-${props.motionName}`}
              direction={direction.value}
              vertical={mergedVertical.value}
              getValueIndex={val => segmentedOptions.value.findIndex(n => n.value === val)}
              onMotionStart={() => {
                thumbShow.value = true;
              }}
              onMotionEnd={() => {
                thumbShow.value = false;
              }}
            />
            {segmentedOptions.value.map(segmentedOption => (
              <SegmentedOption
                key={segmentedOption.value}
                prefixCls={pre}
                checked={segmentedOption.value === props.value}
                onChange={handleChange}
                {...segmentedOption}
                semanticClassNames={mergedClassNames.value}
                semanticStyles={mergedStyles.value}
                className={classNames(segmentedOption.className, `${pre}-item`, {
                  [`${pre}-item-selected`]:
                    segmentedOption.value === props.value && !thumbShow.value,
                })}
                disabled={!!props.disabled || !!segmentedOption.disabled}
                v-slots={slots}
              />
            ))}
          </div>
        </div>,
      );
    };
  },
});
