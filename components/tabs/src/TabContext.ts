import type {
  Tab,
  NormalizedTabsSemanticClassNames,
  NormalizedTabsSemanticStyles,
} from './interface';
import type { PropType, InjectionKey, Ref } from 'vue';
import { provide, inject, defineComponent, toRefs, ref } from 'vue';

export interface TabContextProps {
  tabs: Ref<Tab[]>;
  prefixCls: Ref<string>;
  classNames?: Ref<NormalizedTabsSemanticClassNames>;
  styles?: Ref<NormalizedTabsSemanticStyles>;
}

const TabsContextKey: InjectionKey<TabContextProps> = Symbol('tabsContextKey');

export const useProvideTabs = (props: TabContextProps) => {
  provide(TabsContextKey, props);
};

export const useInjectTabs = () => {
  return inject(TabsContextKey, {
    tabs: ref([]),
    prefixCls: ref(),
    classNames: ref<NormalizedTabsSemanticClassNames>({}),
    styles: ref<NormalizedTabsSemanticStyles>({}),
  });
};

const TabsContextProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TabsContextProvider',
  inheritAttrs: false,
  props: {
    tabs: { type: Object as PropType<TabContextProps['tabs']>, default: undefined },
    prefixCls: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    useProvideTabs(toRefs(props));
    return () => slots.default?.();
  },
});

export default TabsContextProvider;
