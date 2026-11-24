import { defineComponent, ref, watch, computed } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import PropTypes from '../../../_util/vue-types';
import type { CustomSlotsType } from '../../../_util/type';
import { useInjectTabs } from '../TabContext';

const tabPaneProps = () => ({
  tab: PropTypes.any,
  disabled: { type: Boolean },
  forceRender: { type: Boolean },
  closable: { type: Boolean },
  animated: { type: Boolean },
  active: { type: Boolean },
  destroyInactiveTabPane: { type: Boolean },
  destroyOnHidden: { type: Boolean },

  // Pass by TabPaneList
  prefixCls: { type: String },
  tabKey: { type: [String, Number] },
  id: { type: String },
  // closeIcon: PropTypes.any,
});

export type TabPaneProps = Partial<ExtractPropTypes<ReturnType<typeof tabPaneProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATabPane',
  inheritAttrs: false,
  __ANT_TAB_PANE: true,
  props: tabPaneProps(),
  slots: Object as CustomSlotsType<{
    closeIcon: any;
    tab: any;
    default: any;
  }>,
  setup(props, { attrs, slots }) {
    const { classNames: semanticClassNames, styles: semanticStyles } = useInjectTabs();
    const visited = ref(props.forceRender);
    const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyInactiveTabPane);
    watch(
      [() => props.active, shouldDestroy],
      () => {
        if (props.active) {
          visited.value = true;
        } else if (shouldDestroy.value) {
          visited.value = false;
        }
      },
      { immediate: true },
    );
    const mergedStyle = computed<CSSProperties>(() => {
      if (!props.active) {
        if (props.animated) {
          return {
            visibility: 'hidden',
            height: 0,
            overflowY: 'hidden',
          };
        } else {
          return { display: 'none' };
        }
      }
      return {};
    });

    return () => {
      const { prefixCls, forceRender, id, active, tabKey } = props;
      const contentStyle = semanticStyles?.value?.content;
      const contentClass = semanticClassNames?.value?.content;
      return (
        <div
          id={id && `${id}-panel-${tabKey}`}
          role="tabpanel"
          tabindex={active ? 0 : -1}
          aria-labelledby={id && `${id}-tab-${tabKey}`}
          aria-hidden={!active}
          style={[mergedStyle.value, contentStyle, attrs.style as CSSProperties]}
          class={[
            `${prefixCls}-tabpane`,
            active && `${prefixCls}-tabpane-active`,
            contentClass,
            attrs.class,
          ]}
        >
          {(active || visited.value || forceRender) && slots.default?.()}
        </div>
      );
    };
  },
});
