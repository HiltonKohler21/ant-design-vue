import { useInjectTabs } from '../TabContext';
import type { TabPosition, AnimatedConfig } from '../interface';
import type { Key } from '../../../_util/type';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { cloneElement } from '../../../_util/vnode';

export interface TabPanelListProps {
  activeKey: Key;
  id: string;
  rtl: boolean;
  animated?: AnimatedConfig;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;
}
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TabPanelList',
  inheritAttrs: false,
  props: {
    activeKey: { type: [String, Number] as PropType<Key> },
    id: { type: String },
    rtl: { type: Boolean },
    animated: { type: Object as PropType<AnimatedConfig>, default: undefined as AnimatedConfig },
    tabPosition: { type: String as PropType<TabPosition> },
    destroyInactiveTabPane: { type: Boolean },
  },
  setup(props) {
    const {
      tabs,
      prefixCls,
      classNames: semanticClassNames,
      styles: semanticStyles,
    } = useInjectTabs();
    return () => {
      const { id, activeKey, animated, tabPosition, rtl, destroyInactiveTabPane } = props;
      const tabPaneAnimated = animated.tabPane;
      const pre = prefixCls.value;
      const activeIndex = tabs.value.findIndex(tab => tab.key === activeKey);
      const animatedStyle =
        activeIndex && tabPaneAnimated
          ? { [rtl ? 'marginRight' : 'marginLeft']: `-${activeIndex}00%` }
          : undefined;
      const bodyStyle = semanticStyles?.value?.body;
      const mergedBodyStyle =
        animatedStyle || bodyStyle ? { ...animatedStyle, ...bodyStyle } : null;
      return (
        <div
          class={[
            `${pre}-content-holder`,
            {
              [`${pre}-content-holder-animated`]: tabPaneAnimated,
            },
          ]}
        >
          <div
            class={[
              `${pre}-content`,
              `${pre}-content-${tabPosition}`,
              {
                [`${pre}-content-animated`]: tabPaneAnimated,
              },
              semanticClassNames?.value?.body,
            ]}
            style={mergedBodyStyle}
          >
            {tabs.value.map(tab => {
              return cloneElement(tab.node, {
                key: tab.key,
                prefixCls: pre,
                tabKey: tab.key,
                id,
                animated: tabPaneAnimated,
                active: tab.key === activeKey,
                destroyInactiveTabPane:
                  tab.destroyOnHidden ?? tab.destroyInactiveTabPane ?? destroyInactiveTabPane,
              });
            })}
          </div>
        </div>
      );
    };
  },
});
