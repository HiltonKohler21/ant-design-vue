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
  size: String as PropType<'small' | 'middle' | 'large'>,
  orientation: {
    type: String as PropType<'left' | 'right' | 'center'>,
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
    const { prefixCls: prefixClsRef, direction } = useConfigInject('divider', props);
    const [wrapSSR, hashId] = useStyle(prefixClsRef);
    const hasCustomMarginLeft = computed(
      () => props.orientation === 'left' && props.orientationMargin != null,
    );
    const hasCustomMarginRight = computed(
      () => props.orientation === 'right' && props.orientationMargin != null,
    );
    const classString = computed(() => {
      const { type, dashed, plain, variant, size } = props;
      const mergedVariant = variant ?? (dashed ? 'dashed' : 'solid');
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: !!hashId.value,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-dashed`]: mergedVariant === 'dashed',
        [`${prefixCls}-dotted`]: mergedVariant === 'dotted',
        [`${prefixCls}-${size}`]: !!size && size !== 'middle',
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
      return {
        ...(hasCustomMarginLeft.value && { marginLeft: marginValue }),
        ...(hasCustomMarginRight.value && { marginRight: marginValue }),
      };
    });
    const orientationPrefix = computed(() =>
      props.orientation.length > 0 ? '-' + props.orientation : props.orientation,
    );

    return () => {
      const children = flattenChildren(slots.default?.());
      return wrapSSR(
        <div
          {...attrs}
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
