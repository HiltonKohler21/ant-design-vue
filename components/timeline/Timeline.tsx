import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { cloneVNode, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TimelineItem from './TimelineItem';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';

import { tuple, booleanType } from '../_util/type';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType, Key, VueNode } from '../_util/type';

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

    const getPositionCls = (ele, idx: number, normalizedMode: string) => {
      const eleProps = ele.props || {};
      const itemPos = normalizePosition(eleProps.placement ?? eleProps.position);
      if (normalizedMode === 'alternate') {
        if (itemPos === 'right') return `${prefixCls.value}-item-right`;
        if (itemPos === 'left') return `${prefixCls.value}-item-left`;
        return idx % 2 === 0 ? `${prefixCls.value}-item-left` : `${prefixCls.value}-item-right`;
      }
      if (normalizedMode === 'left') return `${prefixCls.value}-item-left`;
      if (normalizedMode === 'right') return `${prefixCls.value}-item-right`;
      if (itemPos === 'right') return `${prefixCls.value}-item-right`;
      return '';
    };

    return () => {
      const {
        pending = slots.pending?.(),
        pendingDot = slots.pendingDot?.(),
        reverse,
        mode,
        orientation = 'vertical',
        titleSpan,
      } = props;
      const mergedVariant: TimelineVariant =
        props.variant ?? timelineConfig.value.variant ?? 'outlined';
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
      const items = timeLineItems.map((ele, idx) => {
        const pendingClass = idx === itemsCount - 2 ? lastCls : '';
        const readyClass = idx === itemsCount - 1 ? lastCls : '';
        return cloneVNode(ele, {
          class: classNames([
            !reverse && !!pending ? pendingClass : readyClass,
            getPositionCls(ele, idx, normalizedMode),
          ]),
        });
      });
      const hasLabelItem = timeLineItems.some(
        item => !!(item.props?.label || item.props?.title || item.children?.label),
      );
      const classString = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-pending`]: !!pending,
          [`${prefixCls.value}-reverse`]: !!reverse,
          [`${prefixCls.value}-${normalizedMode}`]: !!normalizedMode && !hasLabelItem,
          [`${prefixCls.value}-label`]: hasLabelItem,
          [`${prefixCls.value}-horizontal`]: orientation === 'horizontal',
          [`${prefixCls.value}-filled`]: mergedVariant === 'filled',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        contextClassNames.value.root,
        props.rootClassName,
        attrs.class,
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

      return wrapSSR(
        <ul
          {...attrs}
          class={classString}
          style={[
            contextStyle.value,
            contextStyles.value.root,
            titleSpanStyle,
            attrs.style as CSSProperties,
          ]}
        >
          {items}
        </ul>,
      );
    };
  },
});
