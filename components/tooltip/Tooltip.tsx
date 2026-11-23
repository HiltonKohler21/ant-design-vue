import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, watch, defineComponent, ref, onBeforeUnmount } from 'vue';
import VcTooltip from '../vc-tooltip';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import {
  getStyle,
  filterEmpty,
  isValidElement,
  initDefaultProps,
  isFragment,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
export type {
  TriggerType,
  TooltipPlacement,
  TooltipSemanticName,
  TooltipSemanticClassNames,
  TooltipSemanticStyles,
  TooltipClassNamesType,
  TooltipStylesType,
} from './abstractTooltipProps';
import type { TooltipSemanticClassNames, TooltipSemanticStyles } from './abstractTooltipProps';
import abstractTooltipProps from './abstractTooltipProps';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import getPlacements from '../_util/placements';
import firstNotUndefined from '../_util/firstNotUndefined';
import raf from '../_util/raf';

import { parseColor } from './util';
export type { AdjustOverflow, PlacementsConfig } from '../_util/placements';
import useStyle from './style';
import { getTransitionName } from '../_util/transition';
import type { CustomSlotsType } from '../_util/type';
import { useInjectTooltipUnique } from './UniqueProvider';
import type { UniqueTooltipState } from './UniqueProvider';

// https://github.com/react-component/tooltip
// https://github.com/yiminghe/dom-align
export interface TooltipAlignConfig {
  points?: [string, string];
  offset?: [number | string, number | string];
  targetOffset?: [number | string, number | string];
  overflow?: { adjustX: boolean; adjustY: boolean };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
}
const splitObject = <T extends CSSProperties>(
  obj: T,
  keys: (keyof T)[],
): Record<'picked' | 'omitted', T> => {
  const picked: T = {} as T;
  const omitted: T = { ...obj };
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked, omitted };
};

let tooltipUniqueUid = 0;

export const tooltipProps = () => ({
  ...abstractTooltipProps(),
  title: PropTypes.any,
});

export const tooltipDefaultProps = () => ({
  trigger: 'hover',
  align: {},
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true,
});

export type TooltipProps = Partial<ExtractPropTypes<ReturnType<typeof tooltipProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATooltip',
  inheritAttrs: false,
  props: initDefaultProps(tooltipProps(), {
    align: {},
    placement: 'top',
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    default?: any;
  }>,
  // emits: ['update:visible', 'visibleChange'],
  setup(props, { slots, emit, attrs, expose }) {
    if (process.env.NODE_ENV !== 'production') {
      [
        ['visible', 'open'],
        ['onVisibleChange', 'onOpenChange'],
      ].forEach(([deprecatedName, newName]) => {
        warning(
          props[deprecatedName] === undefined,
          'Tooltip',
          `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`,
        );
      });
    }

    const { prefixCls, getPopupContainer, direction, rootPrefixCls, popupOverflow } =
      useConfigInject('tooltip', props);
    const {
      componentConfig: tooltipConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('tooltip');
    const injectFromPopover = computed(() => !!(attrs as any)['data-popover-inject']);
    const uniqueContext = useInjectTooltipUnique();
    const useUnique = computed(() => !!uniqueContext && !injectFromPopover.value);
    const uniqueId = `ant-tooltip-unique-${++tooltipUniqueUid}`;
    const triggerElRef = ref<HTMLElement | null>(null);
    let enterTimer: ReturnType<typeof setTimeout> | null = null;

    const clearEnterTimer = () => {
      if (enterTimer !== null) {
        clearTimeout(enterTimer);
        enterTimer = null;
      }
    };

    const mergedArrow = computed(() => {
      const ctxArrow = injectFromPopover.value ? undefined : tooltipConfig.value.arrow;
      return props.arrow ?? ctxArrow ?? true;
    });
    const mergedOpen = computed(() => props.open ?? props.visible);
    const innerOpen = ref(
      firstNotUndefined([props.open, props.visible, props.defaultOpen, props.defaultVisible]),
    );

    const tooltip = ref();

    let rafId: any;
    watch(mergedOpen, val => {
      raf.cancel(rafId);
      rafId = raf(() => {
        innerOpen.value = !!val;
      });
    });
    const isNoTitle = () => {
      const title = props.title ?? slots.title;
      return !title && title !== 0;
    };

    const handleVisibleChange = (val: boolean) => {
      const noTitle = isNoTitle();
      if (mergedOpen.value === undefined) {
        innerOpen.value = noTitle ? false : val;
      }
      if (!noTitle) {
        props.afterOpenChange?.(val);
        props.afterVisibleChange?.(val);
        emit('afterOpenChange', val);
        emit('afterVisibleChange', val);
        emit('update:visible', val);
        emit('visibleChange', val);
        emit('update:open', val);
        emit('openChange', val);
      }
    };

    const getPopupDomNode = () => {
      if (useUnique.value && uniqueContext) {
        return uniqueContext.getPopupDomNode();
      }
      return tooltip.value?.getPopupDomNode();
    };

    const forcePopupAlign = () => {
      if (useUnique.value && uniqueContext) {
        uniqueContext.forceAlign();
        return;
      }
      tooltip.value?.forcePopupAlign();
    };

    expose({
      getPopupDomNode,
      open: innerOpen,
      forcePopupAlign,
      forceAlign: forcePopupAlign,
    });

    const tooltipPlacements = computed(() => {
      const { builtinPlacements, autoAdjustOverflow, arrowPointAtCenter } = props;
      const arrow = mergedArrow.value;
      let mergedArrowPointAtCenter = arrowPointAtCenter;

      if (typeof arrow === 'object') {
        mergedArrowPointAtCenter = arrow.pointAtCenter ?? arrowPointAtCenter;
      }
      if (builtinPlacements) {
        return builtinPlacements;
      }
      const placements = getPlacements({
        arrowPointAtCenter: mergedArrowPointAtCenter,
        autoAdjustOverflow,
      });
      if (popupOverflow.value) {
        const alwaysByViewport = popupOverflow.value === 'viewport';
        Object.keys(placements).forEach(key => {
          if (placements[key]?.overflow) {
            placements[key] = {
              ...placements[key],
              overflow: {
                ...placements[key].overflow,
                alwaysByViewport,
              },
            };
          }
        });
      }
      return placements;
    });
    const isTrueProps = (val: boolean | '') => {
      return val || val === '';
    };
    const getDisabledCompatibleChildren = (ele: any) => {
      const elementType = ele.type as any;
      if (typeof elementType === 'object' && ele.props) {
        if (
          ((elementType.__ANT_BUTTON === true || elementType === 'button') &&
            isTrueProps(ele.props.disabled)) ||
          (elementType.__ANT_SWITCH === true &&
            (isTrueProps(ele.props.disabled) || isTrueProps(ele.props.loading))) ||
          (elementType.__ANT_RADIO === true && isTrueProps(ele.props.disabled))
        ) {
          // Pick some layout related style properties up to span
          // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
          const { picked, omitted } = splitObject(getStyle(ele), [
            'position',
            'left',
            'right',
            'top',
            'bottom',
            'float',
            'display',
            'zIndex',
          ]);
          const spanStyle: CSSProperties = {
            display: 'inline-block', // default inline-block is important
            ...picked,
            cursor: 'not-allowed',
            lineHeight: 1, // use the true height of child nodes
            width: ele.props && ele.props.block ? '100%' : undefined,
          };
          const buttonStyle: CSSProperties = {
            ...omitted,
            pointerEvents: 'none',
          };
          const child = cloneElement(
            ele,
            {
              style: buttonStyle,
            },
            true,
          );
          return (
            <span style={spanStyle} class={`${prefixCls.value}-disabled-compatible-wrapper`}>
              {child}
            </span>
          );
        }
      }
      return ele;
    };

    const getOverlay = () => {
      return props.title ?? slots.title?.();
    };

    const onPopupAlign = (domNode: HTMLElement, align: any) => {
      const placements = tooltipPlacements.value;
      // 当前返回的位置
      const placement = Object.keys(placements).find(
        key =>
          placements[key].points[0] === align.points?.[0] &&
          placements[key].points[1] === align.points?.[1],
      );
      if (placement) {
        // 根据当前坐标设置动画点
        const rect = domNode.getBoundingClientRect();
        const transformOrigin = {
          top: '50%',
          left: '50%',
        };
        if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
          transformOrigin.top = `${rect.height - align.offset[1]}px`;
        } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
          transformOrigin.top = `${-align.offset[1]}px`;
        }
        if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
          transformOrigin.left = `${rect.width - align.offset[0]}px`;
        } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
          transformOrigin.left = `${-align.offset[0]}px`;
        }
        domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
      }
    };
    const colorInfo = computed(() => parseColor(prefixCls.value, props.color));
    const [wrapSSR, hashId] = useStyle(
      prefixCls,
      computed(() => !injectFromPopover.value),
    );

    const setTriggerRef = (node: any) => {
      if (!node) {
        triggerElRef.value = null;
        return;
      }
      const el =
        typeof HTMLElement !== 'undefined' && node instanceof HTMLElement ? node : node.$el;
      triggerElRef.value =
        typeof HTMLElement !== 'undefined' && el instanceof HTMLElement ? el : null;
    };

    let latestUniqueState: UniqueTooltipState | null = null;

    const triggerUniqueShow = (delaySec: number) => {
      if (!uniqueContext || isNoTitle() || !latestUniqueState) return;
      clearEnterTimer();
      const openNow = () => {
        if (!latestUniqueState) return;
        const wasOpen = innerOpen.value;
        if (mergedOpen.value === undefined) {
          innerOpen.value = true;
        }
        uniqueContext.show(latestUniqueState);
        if (!wasOpen) {
          handleVisibleChange(true);
        }
      };
      // When another sibling tooltip is already visible, switch immediately for smooth gliding!
      if (uniqueContext.visible.value || delaySec <= 0) {
        openNow();
      } else {
        enterTimer = setTimeout(openNow, delaySec * 1000);
      }
    };

    const triggerUniqueHide = (delaySec: number) => {
      clearEnterTimer();
      if (!uniqueContext) return;
      if (mergedOpen.value !== undefined) {
        handleVisibleChange(false);
        return;
      }
      uniqueContext.hide(uniqueId, delaySec * 1000);
    };

    watch(
      [mergedOpen, useUnique],
      ([nextOpen, isUnique]) => {
        if (!isUnique || !uniqueContext) return;
        if (nextOpen === true && latestUniqueState && !isNoTitle()) {
          uniqueContext.show(latestUniqueState);
        } else if (nextOpen === false) {
          uniqueContext.hide(uniqueId, 0);
        }
      },
      { flush: 'post' },
    );

    watch(
      () => [
        props.title,
        props.placement,
        props.color,
        props.rootClassName,
        props.overlayClassName,
        props.classNames,
        props.styles,
      ],
      () => {
        if (
          useUnique.value &&
          uniqueContext &&
          uniqueContext.activeId.value === uniqueId &&
          uniqueContext.visible.value &&
          latestUniqueState
        ) {
          uniqueContext.update(latestUniqueState);
        }
      },
      { flush: 'post' },
    );

    onBeforeUnmount(() => {
      clearEnterTimer();
      raf.cancel(rafId);
      if (uniqueContext) {
        uniqueContext.unregister(uniqueId);
      }
    });

    return () => {
      const { openClassName, overlayClassName, overlayStyle, overlayInnerStyle } = props;
      const ctxConfig = injectFromPopover.value ? {} : tooltipConfig.value;
      const ctxCls = injectFromPopover.value ? undefined : contextClassName.value;
      const ctxStyle = injectFromPopover.value ? undefined : contextStyle.value;
      const ctxClassNames = injectFromPopover.value ? undefined : contextClassNames.value;
      const ctxStyles = injectFromPopover.value ? undefined : contextStyles.value;
      const mergedTrigger = props.trigger ?? (ctxConfig as any).trigger ?? 'hover';
      const mergedMouseEnterDelay =
        props.mouseEnterDelay ?? (ctxConfig as any).mouseEnterDelay ?? 0.1;
      const mergedMouseLeaveDelay =
        props.mouseLeaveDelay ?? (ctxConfig as any).mouseLeaveDelay ?? 0.1;

      const mergedPropsForSemantic: TooltipProps = {
        ...props,
        trigger: mergedTrigger,
        mouseEnterDelay: mergedMouseEnterDelay,
        mouseLeaveDelay: mergedMouseLeaveDelay,
        arrow: mergedArrow.value,
        open: innerOpen.value,
      };

      const [semanticClassNames, semanticStyles] = mergeSemantic<
        TooltipSemanticClassNames,
        TooltipSemanticStyles,
        TooltipProps
      >([ctxClassNames, props.classNames], [ctxStyles, props.styles], {
        props: mergedPropsForSemantic,
      });

      let children = filterEmpty(slots.default?.()) ?? null;
      children = children.length === 1 ? children[0] : children;

      let tempVisible = innerOpen.value;
      // Hide tooltip when there is no title
      if (mergedOpen.value === undefined && isNoTitle()) {
        tempVisible = false;
      }
      if (!children) {
        return null;
      }
      const child = getDisabledCompatibleChildren(
        isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>,
      );
      const childCls = classNames({
        [openClassName || `${prefixCls.value}-open`]: true,
        [child.props && child.props.class]: child.props && child.props.class,
      });
      const customOverlayClassName = classNames(
        overlayClassName,
        ctxCls,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },

        colorInfo.value.className,
        hashId.value,
      );
      const formattedOverlayInnerStyle = {
        ...colorInfo.value.overlayStyle,
        ...overlayInnerStyle,
      };
      const arrowContentStyle = colorInfo.value.arrowStyle;
      const containerClassName = classNames(semanticClassNames.body, semanticClassNames.container);
      const containerStyle: CSSProperties = {
        ...formattedOverlayInnerStyle,
        ...semanticStyles.body,
        ...semanticStyles.container,
      };
      const finalOverlayClassName = classNames(
        customOverlayClassName,
        props.rootClassName,
        semanticClassNames.root,
      );
      const finalOverlayStyle: CSSProperties = {
        ...arrowContentStyle,
        ...ctxStyle,
        ...overlayStyle,
        ...semanticStyles.root,
      };

      if (useUnique.value && uniqueContext) {
        const triggerList = Array.isArray(mergedTrigger) ? mergedTrigger : [mergedTrigger];
        const uniqueState: UniqueTooltipState = {
          id: uniqueId,
          triggerEl: triggerElRef.value,
          placement: props.placement || 'top',
          prefixCls: prefixCls.value,
          hashId: hashId.value,
          overlayClassName: finalOverlayClassName,
          overlayStyle: finalOverlayStyle,
          overlayInnerClassName: containerClassName,
          overlayInnerStyle: containerStyle,
          arrowClassName: semanticClassNames.arrow,
          arrowStyle: semanticStyles.arrow,
          showArrow: !!mergedArrow.value,
          mouseLeaveDelay: mergedMouseLeaveDelay,
          renderOverlay: getOverlay,
          onForceClose: () => {
            if (innerOpen.value) {
              if (mergedOpen.value === undefined) {
                innerOpen.value = false;
              }
              handleVisibleChange(false);
            }
          },
        };
        latestUniqueState = uniqueState;

        const eventProps: Record<string, any> = {
          ref: setTriggerRef,
        };
        if (triggerList.includes('hover')) {
          eventProps.onMouseenter = () => triggerUniqueShow(mergedMouseEnterDelay);
          eventProps.onMouseleave = () => triggerUniqueHide(mergedMouseLeaveDelay);
        }
        if (triggerList.includes('focus')) {
          eventProps.onFocus = () => triggerUniqueShow(0);
          eventProps.onBlur = () => triggerUniqueHide(0);
        }
        if (triggerList.includes('click')) {
          eventProps.onClick = () => {
            if (uniqueContext.activeId.value === uniqueId && uniqueContext.visible.value) {
              triggerUniqueHide(0);
            } else {
              triggerUniqueShow(0);
            }
          };
        }
        if (triggerList.includes('contextmenu')) {
          eventProps.onContextmenu = (e: Event) => {
            e.preventDefault();
            triggerUniqueShow(0);
          };
        }

        const isActive =
          uniqueContext.activeId.value === uniqueId && uniqueContext.visible.value && tempVisible;
        if (isActive) {
          eventProps.class = openClassName || `${prefixCls.value}-open`;
        }

        return wrapSSR(cloneElement(child, eventProps, false, true));
      }

      const vcTooltipProps = {
        ...attrs,
        ...(props as TooltipProps),
        trigger: mergedTrigger,
        mouseEnterDelay: mergedMouseEnterDelay,
        mouseLeaveDelay: mergedMouseLeaveDelay,
        prefixCls: prefixCls.value,
        arrow: !!mergedArrow.value,
        getPopupContainer: getPopupContainer?.value,
        builtinPlacements: tooltipPlacements.value,
        visible: tempVisible,
        ref: tooltip,
        overlayClassName: finalOverlayClassName,
        overlayInnerClassName: containerClassName,
        overlayStyle: finalOverlayStyle,
        overlayInnerStyle: containerStyle,
        onVisibleChange: handleVisibleChange,
        onPopupAlign,
        destroyTooltipOnHide: props.destroyOnHidden ?? props.destroyTooltipOnHide,
        destroyOnHidden: undefined,
        transitionName: getTransitionName(
          rootPrefixCls.value,
          'zoom-big-fast',
          props.transitionName,
        ),
      };
      return wrapSSR(
        <VcTooltip
          {...vcTooltipProps}
          v-slots={{
            arrowContent: () => (
              <span
                class={classNames(`${prefixCls.value}-arrow-content`, semanticClassNames.arrow)}
                style={semanticStyles.arrow}
              ></span>
            ),
            overlay: getOverlay,
          }}
        >
          {innerOpen.value ? cloneElement(child, { class: childCls }) : child}
        </VcTooltip>,
      );
    };
  },
});
