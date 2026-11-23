import { flattenChildren } from '../_util/props-util';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemanticClassNames, mergeSemanticStyles } from '../config-provider/context';
import useStyle from './style';

export type DividerTitlePlacement = 'left' | 'right' | 'center' | 'start' | 'end';
export type DividerOrientation = 'horizontal' | 'vertical' | DividerTitlePlacement;

export type DividerSemanticName = 'root' | 'rail' | 'content';
export type DividerSemanticClassNames = Partial<Record<DividerSemanticName, string>>;
export type DividerSemanticStyles = Partial<Record<DividerSemanticName, CSSProperties>>;

export type DividerClassNamesType =
  | DividerSemanticClassNames
  | ((info: { props: DividerProps }) => DividerSemanticClassNames);

export type DividerStylesType =
  | DividerSemanticStyles
  | ((info: { props: DividerProps }) => DividerSemanticStyles);

const TITLE_PLACEMENT_LIST = ['left', 'right', 'center', 'start', 'end'];

const resolveSemantic = <T, P>(
  semantic: T | ((info: { props: P }) => T) | undefined,
  props: P,
): T | undefined => {
  if (typeof semantic === 'function') {
    return (semantic as (info: { props: P }) => T)({ props });
  }
  return semantic;
};

export const dividerProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** @deprecated please use `orientation` or `vertical` */
  type: {
    type: String as PropType<'horizontal' | 'vertical' | ''>,
    default: undefined,
  },
  dashed: {
    type: Boolean,
    default: false,
  },
  /** 5.13+ 替代 dashed，可选 solid / dashed / dotted */
  variant: String as PropType<'solid' | 'dashed' | 'dotted'>,
  size: String as PropType<'small' | 'middle' | 'medium' | 'large'>,
  /**
   * v6 方向 (`horizontal` | `vertical`)，同时兼容 v5 标题位置 (`left` | `right` | `center` | `start` | `end`)
   */
  orientation: {
    type: String as PropType<DividerOrientation>,
    default: undefined,
  },
  /** v6 纵向分割线简写 */
  vertical: {
    type: Boolean,
    default: undefined,
  },
  /** v6 标题位置主属性 */
  titlePlacement: {
    type: String as PropType<DividerTitlePlacement>,
    default: undefined,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  orientationMargin: [String, Number],
  classNames: [Object, Function] as PropType<DividerClassNamesType>,
  styles: [Object, Function] as PropType<DividerStylesType>,
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

    const mergedDirection = computed<'horizontal' | 'vertical'>(() => {
      if (props.orientation === 'horizontal' || props.orientation === 'vertical') {
        return props.orientation;
      }
      if (typeof props.vertical === 'boolean') {
        return props.vertical ? 'vertical' : 'horizontal';
      }
      if (props.type === 'vertical' || props.type === 'horizontal') {
        return props.type;
      }
      return 'horizontal';
    });

    const isVertical = computed(() => mergedDirection.value === 'vertical');

    const mergedTitlePlacement = computed(() => {
      const placement =
        props.titlePlacement ??
        (props.orientation && TITLE_PLACEMENT_LIST.includes(props.orientation)
          ? (props.orientation as DividerTitlePlacement)
          : 'center');
      if (placement === 'left') {
        return direction.value === 'rtl' ? 'right' : 'left';
      }
      if (placement === 'right') {
        return direction.value === 'rtl' ? 'left' : 'right';
      }
      if (placement === 'start') {
        return 'left';
      }
      if (placement === 'end') {
        return 'right';
      }
      return placement;
    });

    const hasCustomMarginLeft = computed(
      () => mergedTitlePlacement.value === 'left' && props.orientationMargin != null,
    );
    const hasCustomMarginRight = computed(
      () => mergedTitlePlacement.value === 'right' && props.orientationMargin != null,
    );

    const mergedVariant = computed(
      () =>
        props.variant ??
        (props.dashed ? 'dashed' : undefined) ??
        dividerConfig.value?.variant ??
        'solid',
    );

    const mergedSize = computed(() => props.size ?? contextSize.value);

    const classString = computed(() => {
      const { plain } = props;
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [dividerConfig.value?.className as string]: !!dividerConfig.value?.className,
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: !!hashId.value,
        [`${prefixCls}-${mergedDirection.value}`]: true,
        [`${prefixCls}-dashed`]: mergedVariant.value === 'dashed',
        [`${prefixCls}-dotted`]: mergedVariant.value === 'dotted',
        [`${prefixCls}-sm`]: mergedSize.value === 'small',
        [`${prefixCls}-md`]: mergedSize.value === 'middle' || mergedSize.value === 'medium',
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
      mergedTitlePlacement.value.length > 0
        ? '-' + mergedTitlePlacement.value
        : mergedTitlePlacement.value,
    );

    return () => {
      const children = flattenChildren(slots.default?.());
      const hasChildren = children.length > 0;
      const prefixCls = prefixClsRef.value;
      const railCls = `${prefixCls}-rail`;
      const ctxDivider = dividerConfig.value;

      const mergedPropsForSemantic: DividerProps = {
        ...props,
        variant: mergedVariant.value,
        orientation: mergedDirection.value,
        vertical: isVertical.value,
        titlePlacement: mergedTitlePlacement.value as DividerTitlePlacement,
        size: mergedSize.value as DividerProps['size'],
      };

      const mergedClassNames = mergeSemanticClassNames<DividerSemanticClassNames>(
        resolveSemantic(ctxDivider?.classNames, mergedPropsForSemantic),
        resolveSemantic(props.classNames, mergedPropsForSemantic),
      );
      const mergedStyles = mergeSemanticStyles<DividerSemanticStyles>(
        resolveSemantic(ctxDivider?.styles, mergedPropsForSemantic),
        resolveSemantic(props.styles, mergedPropsForSemantic),
      );

      const hasRailSemantic = !!(mergedClassNames.rail || mergedStyles.rail);
      const showInnerText = hasChildren && !isVertical.value;
      const useSemanticRailNodes = showInnerText && hasRailSemantic;

      const rootStyleList = [
        ctxDivider?.style,
        mergedStyles.root,
        !hasChildren ? mergedStyles.rail : undefined,
        attrs.style,
      ].filter(Boolean);
      const mergedStyle =
        rootStyleList.length > 1 ? rootStyleList : rootStyleList[0] ?? attrs.style;

      const contentStyle = mergedStyles.content
        ? { ...innerStyle.value, ...mergedStyles.content }
        : innerStyle.value;

      return wrapSSR(
        <div
          {...attrs}
          style={mergedStyle as any}
          class={[
            classString.value,
            showInnerText
              ? `${prefixCls}-with-text ${prefixCls}-with-text${orientationPrefix.value}`
              : '',
            useSemanticRailNodes ? `${prefixCls}-has-rail` : '',
            !hasChildren && hasRailSemantic ? railCls : '',
            !hasChildren ? mergedClassNames.rail : '',
            mergedClassNames.root,
            attrs.class,
          ]}
          role="separator"
        >
          {useSemanticRailNodes ? (
            <>
              <div
                class={classNames(railCls, `${railCls}-start`, mergedClassNames.rail)}
                style={mergedStyles.rail}
              />
              <span
                class={classNames(`${prefixCls}-inner-text`, mergedClassNames.content)}
                style={contentStyle}
              >
                {children}
              </span>
              <div
                class={classNames(railCls, `${railCls}-end`, mergedClassNames.rail)}
                style={mergedStyles.rail}
              />
            </>
          ) : showInnerText ? (
            <span
              class={classNames(`${prefixCls}-inner-text`, mergedClassNames.content)}
              style={contentStyle}
            >
              {children}
            </span>
          ) : null}
        </div>,
      );
    };
  },
});

export default withInstall(Divider);
