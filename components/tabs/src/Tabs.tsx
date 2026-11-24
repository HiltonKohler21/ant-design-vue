// Accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
import TabNavList from './TabNavList';
import TabPanelList from './TabPanelList';
import TabPane from './TabPanelList/TabPane';
import type {
  TabPosition,
  TabPlacement,
  MoreProps,
  RenderTabBar,
  TabsLocale,
  EditableConfig,
  AnimatedConfig,
  OnTabScroll,
  Tab,
  GetIndicatorSize,
  IndicatorConfig,
  TabsSemanticName,
  TabsSemanticClassNames,
  TabsSemanticStyles,
  NormalizedTabsSemanticClassNames,
  NormalizedTabsSemanticStyles,
  TabsClassNamesType,
  TabsStylesType,
} from './interface';
import { defineComponent, computed, onMounted, watchEffect } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import {
  camelize,
  flattenChildren,
  initDefaultProps,
  isValidElement,
} from '../../_util/props-util';
import useConfigInject, { useComponentConfig } from '../../config-provider/hooks/useConfigInject';
import useMergeSemantic from '../../_util/hooks/useMergeSemantic';
import useState from '../../_util/hooks/useState';
import isMobile from '../../vc-util/isMobile';
import useMergedState from '../../_util/hooks/useMergedState';
import classNames from '../../_util/classNames';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import devWarning from '../../vc-util/devWarning';
import type { SizeType } from '../../config-provider';
import { useProvideTabs } from './TabContext';
import {
  arrayType,
  stringType,
  someType,
  functionType,
  objectType,
  booleanType,
} from '../../_util/type';
import type { CustomSlotsType, Key } from '../../_util/type';
import pick from 'lodash-es/pick';
import PropTypes from '../../_util/vue-types';
import type { MouseEventHandler } from '../../_util/EventInterface';
import omit from '../../_util/omit';
import useStyle from '../style';
export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export type {
  TabPlacement,
  MoreProps,
  TabsSemanticName,
  TabsSemanticClassNames,
  TabsSemanticStyles,
  TabsClassNamesType,
  TabsStylesType,
};

function normalizePopupClassNames(
  val: TabsClassNamesType | undefined,
):
  | ((info: { props: TabsProps }) => NormalizedTabsSemanticClassNames)
  | NormalizedTabsSemanticClassNames
  | undefined {
  if (!val) return undefined;
  const normalize = (
    obj: TabsSemanticClassNames | undefined,
  ): NormalizedTabsSemanticClassNames | undefined => {
    if (!obj) return undefined;
    if (typeof obj.popup === 'string') {
      return { ...obj, popup: { root: obj.popup } };
    }
    return obj as NormalizedTabsSemanticClassNames;
  };
  if (typeof val === 'function') {
    return info => normalize(val(info)) || {};
  }
  return normalize(val);
}

function normalizePopupStyles(
  val: TabsStylesType | undefined,
):
  | ((info: { props: TabsProps }) => NormalizedTabsSemanticStyles)
  | NormalizedTabsSemanticStyles
  | undefined {
  if (!val) return undefined;
  const normalize = (
    obj: TabsSemanticStyles | undefined,
  ): NormalizedTabsSemanticStyles | undefined => {
    if (!obj) return undefined;
    if (obj.popup && typeof obj.popup === 'object' && !('root' in obj.popup)) {
      return { ...obj, popup: { root: obj.popup as CSSProperties } };
    }
    return obj as NormalizedTabsSemanticStyles;
  };
  if (typeof val === 'function') {
    return info => normalize(val(info)) || {};
  }
  return normalize(val);
}

// Used for accessibility
let uuid = 0;

export const tabsProps = () => {
  return {
    prefixCls: { type: String },
    id: { type: String },
    popupClassName: String,
    getPopupContainer: functionType<
      ((triggerNode?: HTMLElement | undefined) => HTMLElement) | undefined
    >(),
    activeKey: { type: [String, Number] },
    defaultActiveKey: { type: [String, Number] },
    direction: stringType<'ltr' | 'rtl'>(),
    animated: someType<boolean | AnimatedConfig>([Boolean, Object]),
    renderTabBar: functionType<RenderTabBar>(),
    tabBarGutter: { type: Number },
    tabBarStyle: objectType<CSSProperties>(),
    tabPosition: stringType<TabPosition>(),
    tabPlacement: stringType<TabPlacement>(),
    more: objectType<MoreProps>(),
    moreIcon: PropTypes.any,
    addIcon: PropTypes.any,
    removeIcon: PropTypes.any,
    destroyInactiveTabPane: booleanType(),
    destroyOnHidden: booleanType(),
    rootClassName: String,
    classNames: someType<TabsClassNamesType>([Object, Function]),
    styles: someType<TabsStylesType>([Object, Function]),
    /** 5.23+ 配置式标签页 */
    items: arrayType<any[]>(),
    /** 5.21+ 指示条尺寸（deprecated，映射到 indicator.size） */
    indicatorSize: someType<GetIndicatorSize | 'small' | 'large'>([Number, String, Function]),
    /** 5.13+ 自定义指示条尺寸与对齐方式 */
    indicator: objectType<IndicatorConfig>(),

    hideAdd: Boolean,
    type: stringType<TabsType>(),
    size: stringType<SizeType>(),
    centered: Boolean,
    onEdit: functionType<(e: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => void>(),
    onChange: functionType<(activeKey: Key) => void>(),
    onTabClick: functionType<(activeKey: Key, e: KeyboardEvent | MouseEvent) => void>(),
    onTabScroll: functionType<OnTabScroll>(),
    'onUpdate:activeKey': functionType<(activeKey: Key) => void>(),
    // Accessibility
    locale: objectType<TabsLocale>(),
    onPrevClick: functionType<MouseEventHandler>(),
    onNextClick: functionType<MouseEventHandler>(),
    tabBarExtraContent: PropTypes.any,
  };
};

export type TabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;

/** 将配置式 items 转为等价 Tab 数组 */
function convertItemsToTabs(items: any[]): Tab[] {
  return items
    .filter(item => item)
    .map(item => {
      const { key, label, icon, children, closeIcon, destroyOnHidden, ...rest } = item;
      const node = (
        <TabPane
          key={key}
          {...rest}
          destroyInactiveTabPane={destroyOnHidden ?? rest.destroyInactiveTabPane}
          tab={label}
        >
          {children}
        </TabPane>
      );
      return {
        key,
        tab: label,
        label,
        icon,
        node,
        closeIcon,
        destroyOnHidden,
        destroyInactiveTabPane: destroyOnHidden ?? rest.destroyInactiveTabPane,
        disabled: rest.disabled,
        forceRender: rest.forceRender,
        closable: rest.closable,
        ...rest,
      };
    });
}

function parseTabList(children: any[]): Tab[] {
  return children
    .map(node => {
      if (isValidElement(node)) {
        const props = { ...(node.props || {}) };
        for (const [k, v] of Object.entries(props)) {
          delete props[k];
          props[camelize(k)] = v;
        }
        const slots = node.children || {};
        const key = node.key !== undefined ? node.key : undefined;
        const {
          tab = slots.tab,
          disabled,
          forceRender,
          closable,
          animated,
          active,
          destroyInactiveTabPane,
        } = props;
        return {
          key,
          ...props,
          node,
          closeIcon: slots.closeIcon,
          tab,
          disabled: disabled === '' || disabled,
          forceRender: forceRender === '' || forceRender,
          closable: closable === '' || closable,
          animated: animated === '' || animated,
          active: active === '' || active,
          destroyInactiveTabPane: destroyInactiveTabPane === '' || destroyInactiveTabPane,
        };
      }

      return null;
    })
    .filter(tab => tab);
}
const InternalTabs = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'InternalTabs',
  inheritAttrs: false,
  props: {
    ...initDefaultProps(tabsProps(), {
      tabPosition: 'top',
      animated: {
        inkBar: true,
        tabPane: false,
      },
    }),
    tabs: arrayType<Tab[]>(),
  },
  slots: Object as CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default: any;
  }>,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, { attrs, slots }) {
    devWarning(
      !(props.onPrevClick !== undefined) && !(props.onNextClick !== undefined),
      'Tabs',
      '`onPrevClick / @prevClick` and `onNextClick / @nextClick` has been removed. Please use `onTabScroll / @tabScroll` instead.',
    );
    devWarning(
      !(props.tabBarExtraContent !== undefined),
      'Tabs',
      '`tabBarExtraContent` prop has been removed. Please use `rightExtra` slot instead.',
    );
    devWarning(
      !(slots.tabBarExtraContent !== undefined),
      'Tabs',
      '`tabBarExtraContent` slot is deprecated. Please use `rightExtra` slot instead.',
    );
    const { prefixCls, direction, size, rootPrefixCls, getPopupContainer, configProvider } =
      useConfigInject('tabs', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('tabs');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const contextTabs = computed(() => configProvider.tabs?.value as any);
    const rtl = computed(() => direction.value === 'rtl');
    const resolvedTabPosition = computed<TabPosition>(() => {
      const placement = props.tabPlacement ?? props.tabPosition ?? 'top';
      switch (placement) {
        case 'start':
          return rtl.value ? 'right' : 'left';
        case 'end':
          return rtl.value ? 'left' : 'right';
        default:
          return placement;
      }
    });
    const mergedAnimated = computed<AnimatedConfig>(() => {
      const { animated } = props;
      if (animated === false || ['left', 'right'].includes(resolvedTabPosition.value)) {
        return {
          inkBar: false,
          tabPane: false,
        };
      } else if (animated === true) {
        return {
          inkBar: true,
          tabPane: true,
        };
      } else {
        return {
          inkBar: true,
          tabPane: false,
          ...(typeof animated === 'object' ? animated : {}),
        };
      }
    });

    // ======================== Mobile ========================
    const [mobile, setMobile] = useState(false);
    onMounted(() => {
      // Only update on the client side
      setMobile(isMobile());
    });

    // ====================== Active Key ======================
    const [mergedActiveKey, setMergedActiveKey] = useMergedState<Key>(() => props.tabs[0]?.key, {
      value: computed(() => props.activeKey),
      defaultValue: props.defaultActiveKey,
    });
    const [activeIndex, setActiveIndex] = useState(() =>
      props.tabs.findIndex(tab => tab.key === mergedActiveKey.value),
    );

    watchEffect(() => {
      let newActiveIndex = props.tabs.findIndex(tab => tab.key === mergedActiveKey.value);
      if (newActiveIndex === -1) {
        newActiveIndex = Math.max(0, Math.min(activeIndex.value, props.tabs.length - 1));
        setMergedActiveKey(props.tabs[newActiveIndex]?.key);
      }
      setActiveIndex(newActiveIndex);
    });

    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = useMergedState(null, {
      value: computed(() => props.id),
    });

    const mergedTabPosition = computed<TabPosition>(() => {
      if (mobile.value && !['left', 'right'].includes(resolvedTabPosition.value)) {
        return 'top';
      } else {
        return resolvedTabPosition.value;
      }
    });

    onMounted(() => {
      if (!props.id) {
        setMergedId(`rc-tabs-${process.env.NODE_ENV === 'test' ? 'test' : uuid}`);
        uuid += 1;
      }
    });

    // ======================== Events ========================
    const onInternalTabClick = (key: Key, e: MouseEvent | KeyboardEvent) => {
      props.onTabClick?.(key, e);
      const isActiveChanged = key !== mergedActiveKey.value;
      setMergedActiveKey(key);
      if (isActiveChanged) {
        props.onChange?.(key);
      }
    };

    const mergedProps = computed<TabsProps>(() => ({
      ...props,
      size: size.value,
      tabPlacement: (props.tabPlacement ?? resolvedTabPosition.value) as TabPlacement,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      NormalizedTabsSemanticClassNames,
      NormalizedTabsSemanticStyles,
      TabsProps
    >(
      () => [
        normalizePopupClassNames(contextClassNames.value as TabsClassNamesType),
        normalizePopupClassNames(props.classNames),
      ],
      () => [
        normalizePopupStyles(contextStyles.value as TabsStylesType),
        contextStyle.value ? { root: contextStyle.value } : undefined,
        normalizePopupStyles(props.styles),
      ],
      () => ({ props: mergedProps.value }),
    );

    useProvideTabs({
      tabs: computed(() => props.tabs),
      prefixCls,
      classNames: mergedClassNames,
      styles: mergedStyles,
    });

    const mergedDestroyOnHidden = computed(
      () => props.destroyOnHidden ?? props.destroyInactiveTabPane,
    );

    return () => {
      const {
        id,
        type,
        tabBarGutter,
        tabBarStyle,
        locale,
        renderTabBar = slots.renderTabBar,
        onTabScroll,
        hideAdd,
        centered,
        indicatorSize,
        indicator,
      } = props;
      const ctxTabs = contextTabs.value;
      const mergedIndicator: IndicatorConfig = {
        align: indicator?.align ?? ctxTabs?.indicator?.align,
        size:
          indicator?.size ?? indicatorSize ?? ctxTabs?.indicator?.size ?? ctxTabs?.indicatorSize,
      };
      const legacyIndicatorSize =
        mergedIndicator.size === 'small' || mergedIndicator.size === 'large'
          ? mergedIndicator.size
          : indicatorSize === 'small' || indicatorSize === 'large'
          ? indicatorSize
          : undefined;
      // ======================== Render ========================
      const sharedProps = {
        id: mergedId.value,
        activeKey: mergedActiveKey.value,
        animated: mergedAnimated.value,
        tabPosition: mergedTabPosition.value,
        rtl: rtl.value,
        mobile: mobile.value,
      };

      let editable: EditableConfig | undefined;
      if (type === 'editable-card') {
        editable = {
          onEdit: (editType, { key, event }) => {
            props.onEdit?.(editType === 'add' ? event : key!, editType);
          },
          removeIcon: () =>
            props.removeIcon !== undefined ? (
              props.removeIcon
            ) : slots.removeIcon ? (
              slots.removeIcon()
            ) : ctxTabs?.removeIcon !== undefined ? (
              ctxTabs.removeIcon
            ) : (
              <CloseOutlined />
            ),
          addIcon: () =>
            props.addIcon !== undefined ? (
              props.addIcon
            ) : slots.addIcon ? (
              slots.addIcon()
            ) : ctxTabs?.addIcon !== undefined ? (
              ctxTabs.addIcon
            ) : (
              <PlusOutlined />
            ),
          showAdd: hideAdd !== true,
        };
      }

      let tabNavBar;

      const mergedMore: MoreProps | undefined =
        props.more ||
        ctxTabs?.more ||
        props.moreIcon !== undefined ||
        ctxTabs?.moreIcon !== undefined
          ? {
              ...ctxTabs?.more,
              ...props.more,
              icon:
                props.more?.icon ??
                props.moreIcon ??
                (slots.moreIcon ? undefined : ctxTabs?.more?.icon ?? ctxTabs?.moreIcon),
            }
          : undefined;

      const tabNavBarProps = {
        ...sharedProps,
        more: mergedMore,
        moreIcon: props.moreIcon,
        moreTransitionName: `${rootPrefixCls.value}-slide-up`,
        editable,
        locale,
        tabBarGutter,
        indicatorSize,
        indicator: mergedIndicator,
        onTabClick: onInternalTabClick,
        onTabScroll,
        style: tabBarStyle,
        getPopupContainer: getPopupContainer.value,
        popupClassName: classNames(props.popupClassName, hashId.value),
      };

      if (renderTabBar) {
        tabNavBar = renderTabBar({ ...tabNavBarProps, DefaultTabBar: TabNavList });
      } else {
        tabNavBar = (
          <TabNavList
            {...tabNavBarProps}
            v-slots={pick(slots, ['moreIcon', 'leftExtra', 'rightExtra', 'tabBarExtraContent'])}
          />
        );
      }
      const pre = prefixCls.value;
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
      const semanticRootStyle = mergedStyles.value.root;
      const hasSemanticRootStyle = semanticRootStyle && Object.keys(semanticRootStyle).length > 0;
      const combinedRootStyle = hasSemanticRootStyle
        ? attrStyle
          ? [semanticRootStyle, attrStyle]
          : semanticRootStyle
        : (attrStyle as any);

      return wrapSSR(
        <div
          {...restAttrs}
          id={id}
          style={combinedRootStyle}
          class={classNames(
            pre,
            `${pre}-${mergedTabPosition.value}`,
            {
              [hashId.value]: true,
              [`${pre}-${size.value}`]: size.value,
              [`${pre}-card`]: ['card', 'editable-card'].includes(type as string),
              [`${pre}-editable-card`]: type === 'editable-card',
              [`${pre}-centered`]: centered,
              [`${pre}-mobile`]: mobile.value,
              [`${pre}-editable`]: type === 'editable-card',
              [`${pre}-rtl`]: rtl.value,
              [`${pre}-indicator-size-${legacyIndicatorSize}`]: !!legacyIndicatorSize,
            },
            contextClassName.value,
            mergedClassNames.value.root,
            attrClass,
            props.rootClassName,
          )}
        >
          {tabNavBar}
          <TabPanelList
            destroyInactiveTabPane={mergedDestroyOnHidden.value}
            {...sharedProps}
            animated={mergedAnimated.value}
          />
        </div>,
      );
    };
  },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATabs',
  inheritAttrs: false,
  props: initDefaultProps(tabsProps(), {
    tabPosition: 'top',
    animated: {
      inkBar: true,
      tabPane: false,
    },
  }),
  slots: Object as CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default?: any;
  }>,
  // emits: ['tabClick', 'tabScroll', 'change', 'update:activeKey'],
  setup(props, { attrs, slots, emit }) {
    const handleChange = (key: string) => {
      emit('update:activeKey', key);
      emit('change', key);
    };
    return () => {
      const tabs = props.items
        ? convertItemsToTabs(props.items)
        : parseTabList(flattenChildren(slots.default?.()));
      return (
        <InternalTabs
          {...omit(props, ['onUpdate:activeKey'])}
          {...attrs}
          onChange={handleChange}
          tabs={tabs}
          v-slots={slots}
        />
      );
    };
  },
});
