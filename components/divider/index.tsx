import { flattenChildren } from '../_util/props-util';
import type { ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

export const dividerProps = () => ({
  prefixCls: String,
  rootClassName: String,
  type: {
    type: String as PropType<'horizontal' | 'vertical' | ''>,
    default: 'horizontal',
  },
  dashed: {
    type: Boolean,
    default: false,
  },
  /** 5.13+ 替代 dashed，可选 solid / dashed / dotted */
  variant: String as PropType<'solid' | 'dashed' | 'dotted'>,
  size: String as PropType<'small' | 'middle' | 'medium' | 'large'>,
  orientation: {
    type: String as PropType<'left' | 'right' | 'center' | 'start' | 'end'>,
    default: 'center',
  },
  plain: {
    type: Boolean,
    default: false,
  },
  orientationMargin: [String, Number],
});
export type DividerProps = Partial<ExtractPropTypes<ReturnType<typeof dividerProps>>>;

const Divider = defineComponent({
  name: 'ADivider',
  inheritAttrs: false,
  compatConfig: { MODE: 3 },
  props: dividerProps(),
  setup(props, { slots, attrs }) {
    const {
      configProvider,
      prefixCls: prefixClsRef,
      direction,
      size: contextSize,
    } = useConfigInject('divider', props);
    const dividerConfig = computed(() => (configProvider as any).divider?.value);
    const [wrapSSR, hashId] = useStyle(prefixClsRef);
    const mergedOrientation = computed(() => {
      const { orientation } = props;
      if (orientation === 'left') {
        return direction.value === 'rtl' ? 'right' : 'left';
      }
      if (orientation === 'right') {
        return direction.value === 'rtl' ? 'left' : 'right';
      }
      if (orientation === 'start') {
        return 'left';
      }
      if (orientation === 'end') {
        return 'right';
      }
      return orientation;
    });
    const hasCustomMarginLeft = computed(
      () => mergedOrientation.value === 'left' && props.orientationMargin != null,
    );
    const hasCustomMarginRight = computed(
      () => mergedOrientation.value === 'right' && props.orientationMargin != null,
    );
    const classString = computed(() => {
      const { type, dashed, plain, variant } = props;
      const mergedVariant =
        variant ?? (dashed ? 'dashed' : undefined) ?? dividerConfig.value?.variant ?? 'solid';
      const mergedSize = props.size ?? contextSize.value;
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [dividerConfig.value?.className as string]: !!dividerConfig.value?.className,
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: !!hashId.value,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-dashed`]: mergedVariant === 'dashed',
        [`${prefixCls}-dotted`]: mergedVariant === 'dotted',
        [`${prefixCls}-sm`]: mergedSize === 'small',
        [`${prefixCls}-md`]: mergedSize === 'middle' || mergedSize === 'medium',
        [`${prefixCls}-plain`]: !!plain,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
        [`${prefixCls}-no-default-orientation-margin-left`]: hasCustomMarginLeft.value,
        [`${prefixCls}-no-default-orientation-margin-right`]: hasCustomMarginRight.value,
      };
    });
    const innerStyle = computed(() => {
      const marginValue =
        typeof props.orientationMargin === 'number'
          ? `${props.orientationMargin}px`
          : props.orientationMargin;
      if (direction.value === 'rtl') {
        return {
          ...(hasCustomMarginLeft.value && { marginInlineStart: marginValue }),
          ...(hasCustomMarginRight.value && { marginInlineEnd: marginValue }),
        };
      }
      return {
        ...(hasCustomMarginLeft.value && { marginLeft: marginValue }),
        ...(hasCustomMarginRight.value && { marginRight: marginValue }),
      };
    });
    const orientationPrefix = computed(() =>
      mergedOrientation.value.length > 0 ? '-' + mergedOrientation.value : mergedOrientation.value,
    );

    return () => {
      const children = flattenChildren(slots.default?.());
      const mergedStyle = dividerConfig.value?.style
        ? [dividerConfig.value.style, attrs.style]
        : attrs.style;
      return wrapSSR(
        <div
          {...attrs}
          style={mergedStyle as any}
          class={[
            classString.value,
            children.length
              ? `${prefixClsRef.value}-with-text ${prefixClsRef.value}-with-text${orientationPrefix.value}`
              : '',
            attrs.class,
          ]}
          role="separator"
        >
          {children.length ? (
            <span class={`${prefixClsRef.value}-inner-text`} style={innerStyle.value}>
              {children}
            </span>
          ) : null}
        </div>,
      );
    };
  },
});

export default withInstall(Divider);
