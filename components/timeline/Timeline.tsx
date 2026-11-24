import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { cloneVNode, computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TimelineItem from './TimelineItem';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';

import { tuple, booleanType, someType } from '../_util/type';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic from '../_util/hooks/useMergeSemantic';
import {
  useProvideTimeline,
  type TimelineSemanticName,
  type TimelineSemanticClassNames,
  type TimelineSemanticStyles,
  type TimelineClassNamesType,
  type TimelineStylesType,
  type TimelineItemSemanticName,
  type TimelineItemSemanticClassNames,
  type TimelineItemSemanticStyles,
} from './context';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType, Key, VueNode } from '../_util/type';

export type {
  TimelineSemanticName,
  TimelineSemanticClassNames,
  TimelineSemanticStyles,
  TimelineClassNamesType,
  TimelineStylesType,
  TimelineItemSemanticName,
  TimelineItemSemanticClassNames,
  TimelineItemSemanticStyles,
};

export type TimelinePosition = 'left' | 'right' | 'start' | 'end' | '';
export type TimelineMode = 'left' | 'alternate' | 'right' | 'start' | 'end' | '';
export type TimelineOrientation = 'horizontal' | 'vertical';
export type TimelineVariant = 'filled' | 'outlined';

export interface TimelineItemType {
  key?: Key;
  color?: string;
  dot?: VueNode;
  icon?: VueNode;
  children?: VueNode;
  content?: VueNode;
  label?: VueNode;
  title?: VueNode;
  position?: TimelinePosition;
  placement?: 'start' | 'end';
  loading?: boolean;
  class?: any;
  className?: string;
  style?: CSSProperties;
  classNames?: TimelineItemSemanticClassNames;
  styles?: TimelineItemSemanticStyles;
}

export const timelineProps = () => ({
  rootClassName: String,
  prefixCls: String,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.any,
  reverse: booleanType(),
  mode: PropTypes.oneOf(tuple('left', 'alternate', 'right', 'start', 'end', '')),
  items: { type: Array as PropType<TimelineItemType[]> },
  orientation: {
    type: String as PropType<TimelineOrientation>,
  },
  variant: {
    type: String as PropType<TimelineVariant>,
  },
  titleSpan: {
    type: [String, Number] as PropType<string | number>,
  },
  classNames: someType<TimelineClassNamesType>([Object, Function]),
  styles: someType<TimelineStylesType>([Object, Function]),
});

export type TimelineProps = Partial<ExtractPropTypes<ReturnType<typeof timelineProps>>>;

function normalizePosition(pos?: string): 'left' | 'right' | '' {
  if (pos === 'start' || pos === 'left') return 'left';
  if (pos === 'end' || pos === 'right') return 'right';
  return '';
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATimeline',
  inheritAttrs: false,
  props: initDefaultProps(timelineProps(), {
    reverse: false,
    mode: '',
    orientation: 'vertical',
  }),
  slots: Object as CustomSlotsType<{
    pending?: any;
    pendingDot?: any;
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('timeline', props);
    const {
      componentConfig: timelineConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('timeline');

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedVariant = computed<TimelineVariant>(
      () => props.variant ?? timelineConfig.value.variant ?? 'outlined',
    );
    const mergedMode = computed<TimelineMode>(() => {
      if (props.mode === 'left') return 'start';
      if (props.mode === 'right') return 'end';
      if (props.mode === 'alternate' || props.mode === 'start' || props.mode === 'end') {
        return props.mode;
      }
      return 'start';
    });

    const mergedProps = computed<TimelineProps>(() => ({
      ...props,
      variant: mergedVariant.value,
      mode: mergedMode.value,
      orientation: props.orientation ?? 'vertical',
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TimelineSemanticClassNames,
      TimelineSemanticStyles,
      TimelineProps
    >(
      () => [contextClassNames.value as TimelineClassNamesType, props.classNames],
      () => [
        contextStyles.value as TimelineStylesType,
        contextStyle.value ? { root: contextStyle.value } : undefined,
        props.styles,
      ],
      () => ({ props: mergedProps.value }),
    );

    useProvideTimeline({
      classNames: mergedClassNames,
      styles: mergedStyles,
    });

    const getItemPlacement = (
      ele: any,
      idx: number,
      currentMode: TimelineMode,
    ): 'start' | 'end' => {
      const eleProps = ele.props || {};
      const itemPos = normalizePosition(eleProps.placement ?? eleProps.position);
      if (itemPos === 'right') return 'end';
      if (itemPos === 'left') return 'start';
      if (currentMode === 'alternate') {
        return idx % 2 === 0 ? 'start' : 'end';
      }
      return currentMode === 'end' ? 'end' : 'start';
    };

    const getPositionCls = (
      ele: any,
      idx: number,
      normalizedMode: string,
      itemPlacement: 'start' | 'end',
    ) => {
      const eleProps = ele.props || {};
      const itemPos = normalizePosition(eleProps.placement ?? eleProps.position);
      const placementCls = `${prefixCls.value}-item-placement-${itemPlacement}`;
      let legacyCls = '';
      if (normalizedMode === 'alternate') {
        if (itemPos === 'right') legacyCls = `${prefixCls.value}-item-right`;
        else if (itemPos === 'left') legacyCls = `${prefixCls.value}-item-left`;
        else
          legacyCls =
            idx % 2 === 0 ? `${prefixCls.value}-item-left` : `${prefixCls.value}-item-right`;
      } else if (normalizedMode === 'left') {
        legacyCls = `${prefixCls.value}-item-left`;
      } else if (normalizedMode === 'right') {
        legacyCls = `${prefixCls.value}-item-right`;
      } else if (itemPos === 'right') {
        legacyCls = `${prefixCls.value}-item-right`;
      }
      return classNames(placementCls, legacyCls);
    };

    const isPendingItem = (ele: any) =>
      ele?.props?.pending === '' ||
      Boolean(ele?.props?.pending) ||
      ele?.props?.loading === '' ||
      Boolean(ele?.props?.loading);

    return () => {
      const {
        pending = slots.pending?.(),
        pendingDot = slots.pendingDot?.(),
        reverse,
        mode,
        orientation = 'vertical',
        titleSpan,
      } = props;
      const normalizedMode = mode === 'start' ? 'left' : mode === 'end' ? 'right' : mode;
      const pendingNode = typeof pending === 'boolean' ? null : pending;

      const children = Array.isArray(props.items)
        ? props.items.map((item, idx) => {
            const mergedLabel = item.title ?? item.label;
            const mergedContent = item.content ?? item.children;
            const mergedDot =
              item.icon ?? item.dot ?? (item.loading ? <LoadingOutlined /> : undefined);
            const mergedPosition = normalizePosition(item.placement ?? item.position);
            const mergedClass = classNames(item.class, item.className) || undefined;
            return (
              <TimelineItem
                key={item.key ?? idx}
                color={item.color}
                dot={mergedDot}
                label={mergedLabel}
                position={mergedPosition}
                pending={item.loading}
                classNames={item.classNames}
                styles={item.styles}
                class={mergedClass}
                style={item.style}
              >
                {mergedContent}
              </TimelineItem>
            );
          })
        : filterEmpty(slots.default?.());

      const pendingItem = pending ? (
        <TimelineItem pending={!!pending} dot={pendingDot || <LoadingOutlined />}>
          {pendingNode}
        </TimelineItem>
      ) : null;

      if (pendingItem) {
        children.push(pendingItem);
      }

      const timeLineItems = reverse ? [...children].reverse() : children;

      const itemsCount = timeLineItems.length;
      const lastCls = `${prefixCls.value}-item-last`;
      const railDottedCls = `${prefixCls.value}-item-rail-dotted`;
      const items = timeLineItems.map((ele, idx) => {
        const isLast = idx === itemsCount - 1;
        const isRailDotted =
          !isLast &&
          (reverse ? isPendingItem(timeLineItems[idx]) : isPendingItem(timeLineItems[idx + 1]));
        const itemPlacement = getItemPlacement(ele, idx, mergedMode.value);
        return cloneVNode(ele, {
          class: classNames([
            isLast ? lastCls : '',
            isRailDotted ? railDottedCls : '',
            getPositionCls(ele, idx, normalizedMode, itemPlacement),
          ]),
        });
      });
      const hasLabelItem = timeLineItems.some(
        item =>
          (item.props?.label !== undefined &&
            item.props?.label !== null &&
            item.props?.label !== '') ||
          (item.props?.title !== undefined &&
            item.props?.title !== null &&
            item.props?.title !== '') ||
          Boolean((item.children as any)?.label),
      );
      const layoutAlternate =
        mergedMode.value === 'alternate' || (orientation !== 'horizontal' && hasLabelItem);
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
      const classString = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-pending`]: !!pending,
          [`${prefixCls.value}-reverse`]: !!reverse,
          [`${prefixCls.value}-${normalizedMode}`]: !!normalizedMode && !hasLabelItem,
          [`${prefixCls.value}-label`]: hasLabelItem,
          [`${prefixCls.value}-layout-alternate`]: layoutAlternate,
          [`${prefixCls.value}-horizontal`]: orientation === 'horizontal',
          [`${prefixCls.value}-vertical`]: orientation !== 'horizontal',
          [`${prefixCls.value}-filled`]: mergedVariant.value === 'filled',
          [`${prefixCls.value}-outlined`]: mergedVariant.value === 'outlined',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        mergedClassNames.value.root,
        props.rootClassName,
        attrClass,
        hashId.value,
      );

      const titleSpanStyle: CSSProperties | undefined =
        titleSpan !== undefined && titleSpan !== null && normalizedMode !== 'alternate'
          ? typeof titleSpan === 'number'
            ? ({
                '--ant-timeline-head-span': titleSpan,
                '--ant-timeline-head-span-ptg': `calc(${titleSpan} / 24 * 100%)`,
              } as CSSProperties)
            : ({
                '--ant-timeline-head-span-ptg': titleSpan,
              } as CSSProperties)
          : undefined;

      const semanticRootStyle = mergedStyles.value.root;
      const hasSemanticRootStyle = semanticRootStyle && Object.keys(semanticRootStyle).length > 0;
      const styleParts = [
        hasSemanticRootStyle ? semanticRootStyle : undefined,
        titleSpanStyle,
        attrStyle,
      ].filter(Boolean);
      const combinedStyle =
        styleParts.length === 0 ? undefined : styleParts.length === 1 ? styleParts[0] : styleParts;

      return wrapSSR(
        <ol {...restAttrs} class={classString} style={combinedStyle as any}>
          {items}
        </ol>,
      );
    };
  },
});
