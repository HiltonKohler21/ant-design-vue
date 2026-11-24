import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import { dropdownProps } from './props';
import type { DropdownSemanticClassNames, DropdownSemanticStyles } from './props';
import type { DropdownProps } from './dropdown';
import Menu from '../menu';
import { useProvideOverride } from '../menu/src/OverrideContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import { filterEmpty, initDefaultProps, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';
import useStyle from './style';
import { applyDropdownMenuSemantics, transformDropdownMenuItems } from './menuHelper';

export const purePanelProps = () => ({
  ...dropdownProps(),
});

export type PurePanelProps = Partial<ExtractPropTypes<ReturnType<typeof purePanelProps>>>;

const PurePanel = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADropdownPurePanel',
  inheritAttrs: false,
  props: initDefaultProps(purePanelProps(), {
    placement: 'bottomLeft',
  }),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('dropdown', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const panelElRef = ref<HTMLElement | null>(null);

    const resolvedSemantics = computed(() => {
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        DropdownSemanticClassNames,
        DropdownSemanticStyles,
        DropdownProps
      >(
        [props.classNames as any],
        [props.styles as any, props.overlayStyle ? { root: props.overlayStyle } : undefined],
        {
          props,
        },
      );
      return { mergedClassNames, mergedStyles };
    });

    const syncSemantics = (el?: HTMLElement | null) => {
      const target = el || panelElRef.value;
      if (!target) return;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      applyDropdownMenuSemantics(target, prefixCls.value, mergedClassNames, mergedStyles);
    };

    watch(
      [
        () => resolvedSemantics.value.mergedClassNames,
        () => resolvedSemantics.value.mergedStyles,
        () => props.menu,
      ],
      () => syncSemantics(),
      { flush: 'post', deep: true },
    );

    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      expandIcon: computed(() => (
        <span class={`${prefixCls.value}-menu-submenu-arrow`}>
          {direction.value === 'rtl' ? (
            <LeftOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
          ) : (
            <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
          )}
        </span>
      )),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
    });

    return () => {
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      const placement = props.placement || 'bottomLeft';
      const slotOverlay = filterEmpty(slots.overlay?.());
      const rawOverlay = props.overlay || (slotOverlay.length ? slotOverlay : undefined);
      let overlayNode = Array.isArray(rawOverlay) ? rawOverlay[0] : rawOverlay;

      if (!overlayNode && props.menu) {
        const {
          items,
          defaultSelectedKeys,
          defaultOpenKeys,
          selectedKeys,
          openKeys,
          selectable = false,
          class: menuClass,
          style: menuStyle,
          ...restMenuProps
        } = props.menu;
        const processedItems = transformDropdownMenuItems(items, prefixCls.value);
        overlayNode = (
          <Menu
            {...restMenuProps}
            items={processedItems}
            mode="vertical"
            selectable={selectable}
            selectedKeys={selectedKeys ?? defaultSelectedKeys}
            openKeys={openKeys ?? defaultOpenKeys}
            class={classNames(menuClass, mergedClassNames.menu)}
            style={[menuStyle, mergedStyles.menu]}
          />
        );
      } else if (overlayNode && isValidElement(overlayNode)) {
        overlayNode = cloneElement(overlayNode, {
          mode: 'vertical',
          class: classNames(overlayNode.props?.class, mergedClassNames.menu),
          style: [overlayNode.props?.style, mergedStyles.menu],
        });
      }

      const mergedPopupRender = props.popupRender || props.dropdownRender;
      const content = mergedPopupRender ? mergedPopupRender(overlayNode) : overlayNode;

      return wrapSSR(
        <div
          {...attrs}
          ref={el => {
            panelElRef.value = el as HTMLElement | null;
            syncSemantics(el as HTMLElement | null);
          }}
          class={classNames(
            prefixCls.value,
            `${prefixCls.value}-pure`,
            `${prefixCls.value}-placement-${placement}`,
            {
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              [`${prefixCls.value}-show-arrow`]: !!props.arrow,
            },
            props.overlayClassName,
            props.rootClassName,
            mergedClassNames.root,
            hashId.value,
            attrs.class,
          )}
          style={[mergedStyles.root, attrs.style as CSSProperties]}
        >
          {props.arrow && <div class={`${prefixCls.value}-arrow`} />}
          {content}
        </div>,
      );
    };
  },
});

export default PurePanel;
