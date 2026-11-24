import type { PropType, ExtractPropTypes, CSSProperties, Plugin, App } from 'vue';
import { defineComponent, computed, ref, watch, Fragment } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import type { SizeType } from '../config-provider';
import type { CustomSlotsType } from '../_util/type';
import { booleanType, tuple } from '../_util/type';
import {
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticStyles,
  type SemanticClassNamesType,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import classNames from '../_util/classNames';
import Compact from './Compact';
import Addon from './Addon';

import useStyle from './style';

export type SpaceSize = SizeType | number;

export type SpaceSemanticName = 'root' | 'item' | 'separator';
export type SpaceSemanticClassNames = SemanticClassNames<SpaceSemanticName>;
export type SpaceSemanticStyles = SemanticStyles<SpaceSemanticName>;
export type SpaceClassNamesType<P = Record<string, any>> = SemanticClassNamesType<
  P,
  SpaceSemanticName
>;
export type SpaceStylesType<P = Record<string, any>> = SemanticStylesType<P, SpaceSemanticName>;

export type { SpaceAddonProps } from './Addon';
export type { SpaceCompactProps } from './Compact';

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
  /** @deprecated Please use `orientation` instead */
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  /** v6 orientation (`horizontal` | `vertical`), takes precedence over `vertical` and `direction` */
  orientation: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  /** v6 shorthand for vertical layout */
  vertical: booleanType(),
  align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline', 'stretch')),
  wrap: booleanType(),
  /** @deprecated Please use `separator` instead */
  split: PropTypes.any,
  /** v6 separator (alias for `split`) */
  separator: PropTypes.any,
  /** 语义化 classNames（支持对象或函数）：root / item / separator */
  classNames: [Object, Function] as PropType<SpaceClassNamesType>,
  /** 语义化 styles（支持对象或函数）：root / item / separator */
  styles: [Object, Function] as PropType<SpaceStylesType>,
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
    separator?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, space, configProvider } = useConfigInject('space', props);
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

    const mergedOrientation = computed<'horizontal' | 'vertical'>(() => {
      if (props.orientation === 'horizontal' || props.orientation === 'vertical') {
        return props.orientation;
      }
      if (typeof props.vertical === 'boolean') {
        return props.vertical ? 'vertical' : 'horizontal';
      }
      if (props.direction === 'horizontal' || props.direction === 'vertical') {
        return props.direction;
      }
      return 'horizontal';
    });

    const directionConfig = computed(() => configProvider.direction?.value);

    const mergedAlign = computed(() =>
      props.align === undefined && mergedOrientation.value === 'horizontal'
        ? 'center'
        : props.align,
    );

    const mergedProps = computed<SpaceProps>(() => ({
      ...props,
      size: size.value,
      orientation: mergedOrientation.value,
      direction: mergedOrientation.value,
      vertical: mergedOrientation.value === 'vertical',
      align: mergedAlign.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SpaceSemanticClassNames,
      SpaceSemanticStyles,
      SpaceProps
    >(
      computed(() => [(space?.value as any)?.classNames, props.classNames]),
      computed(() => [(space?.value as any)?.styles, props.styles]),
      computed(() => ({ props: mergedProps.value })),
    );

    const cn = computed(() => {
      return classNames(
        prefixCls.value,
        hashId.value,
        `${prefixCls.value}-${mergedOrientation.value}`,
        {
          [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
          [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value,
        },
      );
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
        ...(props.wrap && {
          flexWrap: 'wrap',
          ...(!supportFlexGap.value && { marginBottom: `${-verticalSize.value}px` }),
        }),
      } as CSSProperties;
    });
    return () => {
      const { wrap } = props;
      const orientation = mergedOrientation.value;
      const children = slots.default?.();
      const items = filterEmpty(children);
      const len = items.length;

      if (len === 0) {
        return null;
      }
      const split =
        props.separator !== undefined
          ? props.separator
          : slots.separator
          ? slots.separator()
          : props.split !== undefined
          ? props.split
          : slots.split?.();
      const semanticClassNames = mergedClassNames.value;
      const semanticStyles = mergedStyles.value;
      const itemClassName = classNames(`${prefixCls.value}-item`, semanticClassNames.item);
      const separatorClassName = classNames(
        `${prefixCls.value}-item-split`,
        semanticClassNames.separator,
      );
      const horizontalSizeVal = horizontalSize.value;
      const latestIndex = len - 1;
      return (
        <div
          {...attrs}
          class={[
            cn.value,
            (space?.value as any)?.className,
            props.rootClassName,
            semanticClassNames.root,
            attrs.class,
          ]}
          style={[
            style.value,
            (space?.value as any)?.style,
            semanticStyles.root,
            attrs.style as CSSProperties,
          ]}
        >
          {items.map((child, index) => {
            let originIndex = children.indexOf(child);
            if (originIndex === -1) {
              originIndex = `$$space-${index}`;
            }
            let itemStyle: CSSProperties = {};
            if (!supportFlexGap.value) {
              if (orientation === 'vertical') {
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
                <div class={itemClassName} style={[itemStyle, semanticStyles.item]}>
                  {child}
                </div>
                {index < latestIndex && split && (
                  <span class={separatorClassName} style={[itemStyle, semanticStyles.separator]}>
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
Space.Addon = Addon;

Space.install = function (app: App) {
  app.component(Space.name, Space);
  app.component(Compact.name, Compact);
  app.component(Addon.name, Addon);
  return app;
};

export { Compact, Addon as SpaceAddon };

export default Space as typeof Space &
  Plugin & {
    readonly Compact: typeof Compact;
    readonly Addon: typeof Addon;
  };
