import type { CSSProperties, ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import { computed, createVNode, defineComponent, provide, ref } from 'vue';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import {
  useMergeSemantic,
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import { SiderHookProviderKey } from './injectionKey';
import useStyle from './style';

export type LayoutSemanticName = 'root';
export type LayoutSemanticClassNames = SemanticClassNames<LayoutSemanticName>;
export type LayoutSemanticStyles = SemanticStyles<LayoutSemanticName>;
export type LayoutClassNamesType<P = Record<string, any>> = SemanticClassNamesType<
  P,
  LayoutSemanticName
>;
export type LayoutStylesType<P = Record<string, any>> = SemanticStylesType<P, LayoutSemanticName>;

export const basicProps = () => ({
  prefixCls: String,
  rootClassName: String,
  hasSider: { type: Boolean, default: undefined },
  tagName: String,
  classNames: {
    type: [Object, Function] as PropType<LayoutClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<LayoutStylesType>,
    default: undefined,
  },
});

export type BasicProps = Partial<ExtractPropTypes<ReturnType<typeof basicProps>>> & HTMLAttributes;

type GeneratorArgument = {
  suffixCls: string;
  tagName: 'header' | 'footer' | 'main' | 'section';
  name: string;
};

function generator({ suffixCls, tagName, name }: GeneratorArgument) {
  return (BasicComponent: typeof BasicLayout) => {
    const Adapter = defineComponent({
      compatConfig: { MODE: 3 },
      name,
      props: basicProps(),
      setup(props, { slots }) {
        const { prefixCls } = useConfigInject(suffixCls, props);
        return () => {
          const basicComponentProps = {
            ...props,
            prefixCls: prefixCls.value,
            tagName,
          };
          return <BasicComponent {...basicComponentProps} v-slots={slots}></BasicComponent>;
        };
      },
    });
    return Adapter;
  };
}

const Basic = defineComponent({
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: basicProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls: layoutPrefixCls } = useConfigInject('layout', {});
    const [wrapSSR, hashId] = useStyle(layoutPrefixCls);
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      LayoutSemanticClassNames,
      LayoutSemanticStyles,
      BasicProps
    >(
      () => [props.classNames],
      () => [props.styles],
      () => ({ props }),
    );
    return () =>
      wrapSSR(
        createVNode(
          props.tagName,
          {
            ...attrs,
            class: [
              props.prefixCls,
              props.rootClassName,
              mergedClassNames.value.root,
              hashId.value,
              attrs.class,
            ],
            style: mergedStyles.value.root
              ? [mergedStyles.value.root, attrs.style as CSSProperties]
              : attrs.style,
          },
          slots,
        ),
      );
  },
});

const BasicLayout = defineComponent({
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: basicProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('', props);
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('layout');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const siders = ref<string[]>([]);
    const siderHookProvider = {
      addSider: (id: string) => {
        siders.value = [...siders.value, id];
      },
      removeSider: (id: string) => {
        siders.value = siders.value.filter(currentId => currentId !== id);
      },
    };

    provide(SiderHookProviderKey, siderHookProvider);
    const mergedHasSider = computed(() =>
      typeof props.hasSider === 'boolean' ? props.hasSider : siders.value.length > 0,
    );
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      LayoutSemanticClassNames,
      LayoutSemanticStyles,
      BasicProps
    >(
      () => [contextClassNames.value as LayoutClassNamesType<BasicProps>, props.classNames],
      () => [contextStyles.value as LayoutStylesType<BasicProps>, props.styles],
      () => ({
        props: {
          ...props,
          hasSider: mergedHasSider.value,
        },
      }),
    );
    const divCls = computed(() => {
      const { prefixCls } = props;
      return {
        [hashId.value]: true,
        [`${prefixCls}`]: true,
        [`${prefixCls}-has-sider`]: mergedHasSider.value,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
      };
    });
    return () => {
      const { tagName } = props;
      return wrapSSR(
        createVNode(
          tagName,
          {
            ...attrs,
            class: [
              divCls.value,
              contextClassName.value,
              props.rootClassName,
              mergedClassNames.value.root,
              attrs.class,
            ],
            style: [contextStyle.value, mergedStyles.value.root, attrs.style as CSSProperties],
          },
          slots,
        ),
      );
    };
  },
});

const Layout = generator({
  suffixCls: 'layout',
  tagName: 'section',
  name: 'ALayout',
})(BasicLayout);

const Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  name: 'ALayoutHeader',
})(Basic);

const Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  name: 'ALayoutFooter',
})(Basic);

const Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  name: 'ALayoutContent',
})(Basic);

export { Header, Footer, Content };

export default Layout;
