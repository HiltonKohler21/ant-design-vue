import type { PropType, ExtractPropTypes, CSSProperties, Plugin, App } from 'vue';
import { defineComponent, computed, ref, watch, Fragment } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import type { SizeType } from '../config-provider';
import type { CustomSlotsType } from '../_util/type';
import { booleanType, objectType, tuple } from '../_util/type';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import classNames from '../_util/classNames';
import Compact from './Compact';

import useStyle from './style';

export type SpaceSize = SizeType | number;
const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};
export const spaceProps = () => ({
  prefixCls: String,
  rootClassName: String,
  size: {
    type: [String, Number, Array] as PropType<SpaceSize | [SpaceSize, SpaceSize]>,
  },
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline')),
  wrap: booleanType(),
  /** 语义化 classNames（antd 5.25+）：item */
  classNames: objectType<SemanticNames<'item'>>(),
  /** 语义化 styles（antd 5.25+）：item */
  styles: objectType<SemanticStylesMap<'item'>>(),
});

export type SpaceProps = Partial<ExtractPropTypes<ReturnType<typeof spaceProps>>>;

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASpace',
  inheritAttrs: false,
  props: spaceProps(),
  slots: Object as CustomSlotsType<{
    split?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, space, direction: directionConfig } = useConfigInject('space', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const supportFlexGap = useFlexGapSupport();
    const size = computed(() => props.size ?? space?.value?.size ?? 'small');
    const horizontalSize = ref<number>();
    const verticalSize = ref<number>();
    watch(
      size,
      () => {
        [horizontalSize.value, verticalSize.value] = (
          (Array.isArray(size.value) ? size.value : [size.value, size.value]) as [
            SpaceSize,
            SpaceSize,
          ]
        ).map(item => getNumberSize(item));
      },
      { immediate: true },
    );

    const mergedAlign = computed(() =>
      props.align === undefined && props.direction === 'horizontal' ? 'center' : props.align,
    );
    const cn = computed(() => {
      return classNames(prefixCls.value, hashId.value, `${prefixCls.value}-${props.direction}`, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value,
      });
    });

    const marginDirection = computed(() =>
      directionConfig.value === 'rtl' ? 'marginLeft' : 'marginRight',
    );
    const style = computed(() => {
      const gapStyle: CSSProperties = {};
      if (supportFlexGap.value) {
        gapStyle.columnGap = `${horizontalSize.value}px`;
        gapStyle.rowGap = `${verticalSize.value}px`;
      }
      return {
        ...gapStyle,
        ...(props.wrap && { flexWrap: 'wrap', marginBottom: `${-verticalSize.value}px` }),
      } as CSSProperties;
    });
    return () => {
      const { wrap, direction = 'horizontal' } = props;
      const children = slots.default?.();
      const items = filterEmpty(children);
      const len = items.length;

      if (len === 0) {
        return null;
      }
      const split = slots.split?.();
      const itemClassName = classNames(`${prefixCls.value}-item`, props.classNames?.item);
      const horizontalSizeVal = horizontalSize.value;
      const latestIndex = len - 1;
      return (
        <div
          {...attrs}
          class={[cn.value, props.rootClassName, attrs.class]}
          style={[style.value, attrs.style as CSSProperties]}
        >
          {items.map((child, index) => {
            let originIndex = children.indexOf(child);
            if (originIndex === -1) {
              originIndex = `$$space-${index}`;
            }
            let itemStyle: CSSProperties = {};
            if (!supportFlexGap.value) {
              if (direction === 'vertical') {
                if (index < latestIndex) {
                  itemStyle = { marginBottom: `${horizontalSizeVal / (split ? 2 : 1)}px` };
                }
              } else {
                itemStyle = {
                  ...(index < latestIndex && {
                    [marginDirection.value]: `${horizontalSizeVal / (split ? 2 : 1)}px`,
                  }),
                  ...(wrap && { paddingBottom: `${verticalSize.value}px` }),
                };
              }
            }

            return wrapSSR(
              <Fragment key={originIndex}>
                <div class={itemClassName} style={[itemStyle, props.styles?.item]}>
                  {child}
                </div>
                {index < latestIndex && split && (
                  <span class={`${itemClassName}-split`} style={itemStyle}>
                    {split}
                  </span>
                )}
              </Fragment>,
            );
          })}
        </div>
      );
    };
  },
});

Space.Compact = Compact;

Space.install = function (app: App) {
  app.component(Space.name, Space);
  app.component(Compact.name, Compact);
  return app;
};

export { Compact };

export default Space as typeof Space &
  Plugin & {
    readonly Compact: typeof Compact;
  };
