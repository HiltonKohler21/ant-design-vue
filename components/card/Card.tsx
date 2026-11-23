import type { VNodeTypes, PropType, VNode, ExtractPropTypes, CSSProperties } from 'vue';
import { isVNode, defineComponent, computed } from 'vue';
import Tabs from '../tabs';
import PropTypes from '../_util/vue-types';
import { flattenChildren, isEmptyElement, filterEmptyWithUndefined } from '../_util/props-util';
import type { SizeType } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';
import useConfigInject, {
  useComponentConfig,
  mergeSemanticClassNames,
  mergeSemanticStyles,
} from '../config-provider/hooks/useConfigInject';
import useVariant from '../form/hooks/useVariant';
import devWarning from '../vc-util/devWarning';
import useStyle from './style';
import Skeleton from '../skeleton';
import type { CustomSlotsType } from '../_util/type';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
import { customRenderSlot } from '../_util/vnode';

const resolveSemanticValue = <T,>(
  val: T | ((info: { props: any }) => T) | undefined,
  info: { props: any },
): T | undefined => (typeof val === 'function' ? (val as any)(info) : val);

export interface CardTabListType {
  key: string;
  tab: any;
  /** @deprecated Please use `customTab` instead. */
  slots?: { tab: string };
  disabled?: boolean;
}

export type CardType = 'inner';
export type CardSize = 'default' | 'small';

export type CardSemanticName = 'root' | 'header' | 'body' | 'extra' | 'actions' | 'title' | 'cover';

export type CardSemanticClassNames = SemanticNames<CardSemanticName>;
export type CardSemanticStyles = SemanticStylesMap<CardSemanticName>;

const { TabPane } = Tabs;

const cardBaseProps = () => ({
  prefixCls: String,
  rootClassName: String,
  title: PropTypes.any,
  extra: PropTypes.any,
  bordered: { type: Boolean, default: true },
  /** 5.24+ 替代 bordered，可选 borderless / outlined */
  variant: { type: String as PropType<'borderless' | 'outlined'> },
  bodyStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  headStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  loading: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  type: { type: String as PropType<CardType> },
  size: { type: String as PropType<CardSize> },
  actions: PropTypes.any,
  tabList: {
    type: Array as PropType<CardTabListType[]>,
  },
  tabBarExtraContent: PropTypes.any,
  /** 透传给内部 Tabs 的额外属性 */
  tabProps: { type: Object as PropType<Record<string, any>>, default: undefined },
  activeTabKey: String,
  defaultActiveTabKey: String,
  cover: PropTypes.any,
  onTabChange: {
    type: Function as PropType<(key: string) => void>,
  },
});

type CardSemanticProps = Partial<ExtractPropTypes<ReturnType<typeof cardBaseProps>>> & {
  classNames?: any;
  styles?: any;
};

export type CardClassNamesType =
  | CardSemanticClassNames
  | ((info: { props: CardSemanticProps }) => CardSemanticClassNames);

export type CardStylesType =
  | CardSemanticStyles
  | ((info: { props: CardSemanticProps }) => CardSemanticStyles);

export const cardProps = () => ({
  ...cardBaseProps(),
  /** 语义化 classNames（antd 5.25+/6.x）：root / header / body / extra / actions / title / cover */
  classNames: {
    type: [Object, Function] as PropType<CardClassNamesType>,
    default: undefined,
  },
  /** 语义化 styles（antd 5.25+/6.x）：root / header / body / extra / actions / title / cover */
  styles: {
    type: [Object, Function] as PropType<CardStylesType>,
    default: undefined,
  },
});

export type CardProps = Partial<ExtractPropTypes<ReturnType<typeof cardProps>>>;

const Card = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ACard',
  inheritAttrs: false,
  props: cardProps(),
  slots: Object as CustomSlotsType<{
    title: any;
    extra: any;
    tabBarExtraContent: any;
    actions: any;
    cover: any;
    customTab: CardTabListType;
    default: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction, size } = useConfigInject('card', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('card');

    // ====================== Variant =======================
    const [mergedVariant] = useVariant(
      'card',
      computed(() => props.variant),
      computed(() => props.bordered),
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getAction = (actions: VNodeTypes[]) => {
      const actionList = actions.map((action, index) =>
        (isVNode(action) && !isEmptyElement(action)) || !isVNode(action) ? (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ) : null,
      );
      return actionList;
    };
    const triggerTabChange = (key: string) => {
      props.onTabChange?.(key);
    };
    const isContainGrid = (obj: VNode[] = []) => {
      let containGrid: boolean;
      obj.forEach(element => {
        if (element && isPlainObject(element.type) && (element.type as any).__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    };

    return () => {
      const {
        headStyle = {},
        bodyStyle = {},
        loading,
        type,
        tabList,
        hoverable,
        activeTabKey,
        defaultActiveTabKey,
        tabBarExtraContent = filterEmptyWithUndefined(slots.tabBarExtraContent?.()),
        tabProps,
        title = filterEmptyWithUndefined(slots.title?.()),
        extra = filterEmptyWithUndefined(slots.extra?.()),
        actions = filterEmptyWithUndefined(slots.actions?.()),
        cover = filterEmptyWithUndefined(slots.cover?.()),
      } = props;
      const children = flattenChildren(slots.default?.());
      const pre = prefixCls.value;
      const classString = {
        [`${pre}`]: true,
        [props.rootClassName as string]: !!props.rootClassName,
        [hashId.value]: true,
        [`${pre}-loading`]: loading,
        [`${pre}-bordered`]: mergedVariant.value !== 'borderless',
        [`${pre}-hoverable`]: !!hoverable,
        [`${pre}-contain-grid`]: isContainGrid(children),
        [`${pre}-contain-tabs`]: tabList && tabList.length,
        [`${pre}-${size.value}`]: size.value,
        [`${pre}-type-${type}`]: !!type,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
      const loadingBlock = (
        <Skeleton loading active paragraph={{ rows: 4 }} title={false}>
          {children}
        </Skeleton>
      );

      const hasActiveTabKey = activeTabKey !== undefined;
      const tabsProps = {
        ...tabProps,
        size: 'large' as SizeType,
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
          ? activeTabKey
          : defaultActiveTabKey,
        onChange: triggerTabChange,
        class: `${pre}-head-tabs`,
      };

      let head;
      const tabs =
        tabList && tabList.length ? (
          <Tabs
            {...tabsProps}
            v-slots={{ rightExtra: tabBarExtraContent ? () => tabBarExtraContent : null }}
          >
            {tabList.map(item => {
              const { tab: temp, slots: itemSlots } = item as CardTabListType;
              const name = itemSlots?.tab;
              devWarning(
                !itemSlots,
                'Card',
                `tabList slots is deprecated, Please use \`customTab\` instead.`,
              );
              let tab = temp !== undefined ? temp : slots[name] ? slots[name](item) : null;
              tab = customRenderSlot(slots, 'customTab', item as any, () => [tab]);
              return <TabPane tab={tab} key={item.key} disabled={item.disabled} />;
            })}
          </Tabs>
        ) : null;
      const semanticInfo = {
        props: {
          ...props,
          size: size.value,
          variant: mergedVariant.value,
        },
      };
      const mergedClassNames = mergeSemanticClassNames<CardSemanticClassNames>(
        resolveSemanticValue(contextClassNames.value, semanticInfo),
        resolveSemanticValue(props.classNames, semanticInfo),
      );
      const mergedStyles = mergeSemanticStyles<CardSemanticStyles>(
        resolveSemanticValue(contextStyles.value, semanticInfo),
        resolveSemanticValue(props.styles, semanticInfo),
      );
      if (title || extra || tabs) {
        head = (
          <div
            class={[`${pre}-head`, mergedClassNames.header]}
            style={[headStyle, mergedStyles.header]}
          >
            <div class={`${pre}-head-wrapper`}>
              {title && (
                <div
                  class={[`${pre}-head-title`, mergedClassNames.title]}
                  style={mergedStyles.title}
                >
                  {title}
                </div>
              )}
              {extra && (
                <div class={[`${pre}-extra`, mergedClassNames.extra]} style={mergedStyles.extra}>
                  {extra}
                </div>
              )}
            </div>
            {tabs}
          </div>
        );
      }

      const coverDom = cover ? (
        <div class={[`${pre}-cover`, mergedClassNames.cover]} style={mergedStyles.cover}>
          {cover}
        </div>
      ) : null;
      const body = (
        <div class={[`${pre}-body`, mergedClassNames.body]} style={[bodyStyle, mergedStyles.body]}>
          {loading ? loadingBlock : children}
        </div>
      );
      const actionDom =
        actions && actions.length ? (
          <ul class={[`${pre}-actions`, mergedClassNames.actions]} style={mergedStyles.actions}>
            {getAction(actions)}
          </ul>
        ) : null;

      return wrapSSR(
        <div
          ref="cardContainerRef"
          {...attrs}
          class={[classString, contextClassName.value, mergedClassNames.root, attrs.class]}
          style={[contextStyle.value, mergedStyles.root, attrs.style as CSSProperties]}
        >
          {head}
          {coverDom}
          {children && children.length ? body : null}
          {actionDom}
        </div>,
      );
    };
  },
});

export default Card;
