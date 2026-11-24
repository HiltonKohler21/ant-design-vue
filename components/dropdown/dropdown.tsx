import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import RcDropdown from '../vc-dropdown';
import DropdownButton from './dropdown-button';
import PurePanel from './PurePanel';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';
import { filterEmpty, isValidElement, initDefaultProps } from '../_util/props-util';
import type { DropdownSemanticClassNames, DropdownSemanticStyles, Trigger } from './props';
import { dropdownProps } from './props';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import devWarning from '../vc-util/devWarning';
import omit from '../_util/omit';
import getPlacements from '../_util/placements';
import warning from '../_util/warning';
import useStyle from './style';
import Menu from '../menu';
import { useProvideOverride } from '../menu/src/OverrideContext';
import type { CustomSlotsType, Key } from '../_util/type';
import { applyDropdownMenuSemantics, transformDropdownMenuItems } from './menuHelper';

export type DropdownProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownProps>>>;

const normalizeTriggerAction = (action: Trigger): 'click' | 'hover' | 'contextmenu' =>
  action === 'contextMenu' ? 'contextmenu' : action;

const Dropdown = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADropdown',
  inheritAttrs: false,
  props: initDefaultProps(dropdownProps(), {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
    trigger: 'hover',
    autoAdjustOverflow: true,
  }),
  // emits: ['visibleChange', 'update:visible'],
  slots: Object as CustomSlotsType<{
    default?: any;
    overlay?: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, rootPrefixCls, direction, getPopupContainer } = useConfigInject(
      'dropdown',
      props,
    );
    const {
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('dropdown');
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const rcDropdownRef = ref();
    const overlayRootElRef = ref<HTMLElement | null>(null);

    // Uncontrolled menu selection & open keys support for `props.menu.defaultSelectedKeys` / `defaultOpenKeys`
    const innerSelectedKeys = ref<Key[]>(props.menu?.defaultSelectedKeys?.slice() || []);
    const innerOpenKeys = ref<Key[]>(props.menu?.defaultOpenKeys?.slice() || []);

    watch(
      () => props.menu?.defaultSelectedKeys,
      val => {
        if (props.menu?.selectedKeys === undefined && Array.isArray(val)) {
          innerSelectedKeys.value = val.slice();
        }
      },
    );

    watch(
      () => props.menu?.defaultOpenKeys,
      val => {
        if (props.menu?.openKeys === undefined && Array.isArray(val)) {
          innerOpenKeys.value = val.slice();
        }
      },
    );

    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      [
        ['visible', 'open'],
        ['onVisibleChange', 'onOpenChange'],
        ['onUpdate:visible', 'onUpdate:open'],
      ].forEach(([deprecatedName, newName]) => {
        warning(
          props[deprecatedName] === undefined,
          'Dropdown',
          `\`${deprecatedName}\` is deprecated which will be removed in next major version, please use \`${newName}\` instead.`,
        );
      });
    }

    const transitionName = computed(() => {
      const { placement = '', transitionName } = props;
      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.startsWith('top')) {
        return `${rootPrefixCls.value}-slide-down`;
      }
      if (placement.startsWith('left')) {
        return `${rootPrefixCls.value}-slide-right`;
      }
      if (placement.startsWith('right')) {
        return `${rootPrefixCls.value}-slide-left`;
      }
      return `${rootPrefixCls.value}-slide-up`;
    });

    const resolvedSemantics = computed(() => {
      const mergedProps: DropdownProps = {
        ...props,
        mouseEnterDelay: props.mouseEnterDelay ?? 0.15,
        mouseLeaveDelay: props.mouseLeaveDelay ?? 0.1,
        autoAdjustOverflow: props.autoAdjustOverflow ?? true,
      };
      const [mergedClassNames, mergedStyles] = mergeSemantic<
        DropdownSemanticClassNames,
        DropdownSemanticStyles,
        DropdownProps
      >(
        [contextClassNames.value as any, props.classNames as any],
        [
          contextStyles.value as any,
          contextStyle.value ? { root: contextStyle.value } : undefined,
          props.styles as any,
          props.overlayStyle ? { root: props.overlayStyle } : undefined,
        ],
        {
          props: mergedProps,
        },
      );
      return { mergedClassNames, mergedStyles };
    });

    const syncMenuSemantics = (el?: HTMLElement | null) => {
      const targetEl = el || overlayRootElRef.value;
      if (!targetEl) return;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      applyDropdownMenuSemantics(targetEl, prefixCls.value, mergedClassNames, mergedStyles);
    };

    watch(
      [
        () => resolvedSemantics.value.mergedClassNames,
        () => resolvedSemantics.value.mergedStyles,
        () => props.open,
        () => props.visible,
        () => props.menu,
      ],
      () => {
        syncMenuSemantics();
      },
      { flush: 'post', deep: true },
    );

    const onMenuClick = () => {
      if (props.menu?.selectable && props.menu?.multiple) {
        return;
      }
      emit('visibleChange', false, { source: 'menu' });
      emit('openChange', false, { source: 'menu' });
    };

    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      expandIcon: computed(() => {
        return (
          <span class={`${prefixCls.value}-menu-submenu-arrow`}>
            {direction.value === 'rtl' ? (
              <LeftOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
            ) : (
              <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
            )}
          </span>
        );
      }),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: onMenuClick,
      validator: ({ mode }) => {
        // Warning if use other mode
        warning(
          !mode || mode === 'vertical',
          'Dropdown',
          `mode="${mode}" is not supported for Dropdown's Menu.`,
        );
      },
    });

    const renderOverlay = () => {
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      const slotOverlay = filterEmpty(slots.overlay?.());
      const rawOverlay = props.overlay || (slotOverlay.length ? slotOverlay : undefined);
      let overlayNode = Array.isArray(rawOverlay) ? rawOverlay[0] : rawOverlay;

      if (!overlayNode && props.menu) {
        const {
          items,
          defaultSelectedKeys: _defaultSelectedKeys,
          defaultOpenKeys: _defaultOpenKeys,
          selectedKeys,
          openKeys,
          onSelect,
          onDeselect,
          onOpenChange: onMenuOpenChange,
          selectable = false,
          class: menuClass,
          style: menuStyle,
          ...restMenuProps
        } = props.menu;

        const effectiveSelectedKeys =
          selectedKeys !== undefined ? selectedKeys : innerSelectedKeys.value;
        const effectiveOpenKeys = openKeys !== undefined ? openKeys : innerOpenKeys.value;
        const processedItems = transformDropdownMenuItems(items, prefixCls.value);

        overlayNode = (
          <Menu
            {...restMenuProps}
            items={processedItems}
            mode="vertical"
            selectable={selectable}
            selectedKeys={effectiveSelectedKeys}
            openKeys={effectiveOpenKeys}
            class={classNames(menuClass, mergedClassNames.menu)}
            style={[menuStyle, mergedStyles.menu]}
            onSelect={(info: any) => {
              if (selectedKeys === undefined) {
                innerSelectedKeys.value = info.selectedKeys;
              }
              onSelect?.(info);
            }}
            onDeselect={(info: any) => {
              if (selectedKeys === undefined) {
                innerSelectedKeys.value = info.selectedKeys;
              }
              onDeselect?.(info);
            }}
            onOpenChange={(keys: Key[]) => {
              if (openKeys === undefined) {
                innerOpenKeys.value = keys;
              }
              onMenuOpenChange?.(keys);
            }}
          />
        );
      }

      if (!overlayNode && !props.popupRender && !props.dropdownRender) return null;

      let fixedModeOverlay = overlayNode;
      if (rawOverlay && overlayNode && isValidElement(overlayNode)) {
        const overlayProps = overlayNode.props || {};

        // Warning if use other mode
        devWarning(
          !overlayProps.mode || overlayProps.mode === 'vertical',
          'Dropdown',
          `mode="${overlayProps.mode}" is not supported for Dropdown's Menu.`,
        );

        // menu cannot be selectable in dropdown defaultly
        const { selectable = false, expandIcon = (overlayNode.children as any)?.expandIcon?.() } =
          overlayProps;

        const overlayNodeExpandIcon =
          typeof expandIcon !== 'undefined' && isValidElement(expandIcon) ? (
            expandIcon
          ) : (
            <span class={`${prefixCls.value}-menu-submenu-arrow`}>
              {direction.value === 'rtl' ? (
                <LeftOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
              ) : (
                <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
              )}
            </span>
          );

        fixedModeOverlay = cloneElement(overlayNode, {
          mode: 'vertical',
          selectable,
          expandIcon: () => overlayNodeExpandIcon,
          class: classNames(overlayProps.class, mergedClassNames.menu),
          style: [overlayProps.style, mergedStyles.menu],
        });
      }

      const mergedPopupRender = props.popupRender || props.dropdownRender;
      const finalNode = mergedPopupRender ? mergedPopupRender(fixedModeOverlay) : fixedModeOverlay;

      if (isValidElement(finalNode)) {
        const prevOnMounted = (finalNode.props as any)?.onVnodeMounted;
        const prevOnUpdated = (finalNode.props as any)?.onVnodeUpdated;
        return cloneElement(finalNode, {
          onVnodeMounted: (vnode: any) => {
            prevOnMounted?.(vnode);
            const el = vnode?.el as HTMLElement | null;
            if (el && el.nodeType === 1) {
              overlayRootElRef.value = el;
              syncMenuSemantics(el);
            }
          },
          onVnodeUpdated: (vnode: any) => {
            prevOnUpdated?.(vnode);
            const el = vnode?.el as HTMLElement | null;
            if (el && el.nodeType === 1) {
              overlayRootElRef.value = el;
              syncMenuSemantics(el);
            }
          },
        });
      }

      return finalNode;
    };

    const placement = computed(() => {
      const placement = props.placement;
      if (!placement) {
        return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
      }

      if (placement.includes('Center')) {
        const newPlacement = placement.slice(0, placement.indexOf('Center'));
        devWarning(
          !placement.includes('Center'),
          'Dropdown',
          `You are using '${placement}' placement in Dropdown, which is deprecated. Try to use '${newPlacement}' instead.`,
        );
        return newPlacement;
      }
      return placement;
    });

    const mergedVisible = computed(() => {
      return typeof props.visible === 'boolean' ? props.visible : props.open;
    });

    const handleVisibleChange = (val: boolean) => {
      emit('update:visible', val);
      emit('visibleChange', val, { source: 'trigger' });
      emit('update:open', val);
      emit('openChange', val, { source: 'trigger' });
    };

    return () => {
      const { arrow, trigger, disabled, overlayClassName } = props;
      const { mergedClassNames, mergedStyles } = resolvedSemantics.value;
      const child = slots.default?.()[0];
      const dropdownTrigger = child
        ? cloneElement(
            child,
            Object.assign(
              {
                class: classNames(
                  child?.props?.class,
                  {
                    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
                  },
                  `${prefixCls.value}-trigger`,
                  props.rootClassName,
                ),
              },
              disabled ? { disabled } : {},
            ),
          )
        : null;

      const overlayClassNameCustomized = classNames(
        overlayClassName,
        props.rootClassName,
        contextClassName.value,
        mergedClassNames.root,
        hashId.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      );

      const overlayStyleCustomized: CSSProperties | undefined =
        mergedStyles.root && Object.keys(mergedStyles.root).length > 0
          ? { ...mergedStyles.root }
          : undefined;

      const normalizedTriggers = disabled
        ? []
        : Array.isArray(trigger)
        ? trigger.map(normalizeTriggerAction)
        : trigger
        ? normalizeTriggerAction(trigger)
        : trigger;

      let alignPoint: boolean;
      if (
        normalizedTriggers &&
        (Array.isArray(normalizedTriggers)
          ? normalizedTriggers.includes('contextmenu')
          : normalizedTriggers === 'contextmenu')
      ) {
        alignPoint = true;
      }

      const builtinPlacements = getPlacements({
        arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
        autoAdjustOverflow: props.autoAdjustOverflow ?? true,
      });

      const rcDropdownProps = omit(
        {
          ...props,
          ...attrs,
          visible: mergedVisible.value,
          builtinPlacements,
          overlayClassName: overlayClassNameCustomized,
          overlayStyle: overlayStyleCustomized,
          arrow: !!arrow,
          alignPoint,
          prefixCls: prefixCls.value,
          getPopupContainer: getPopupContainer?.value,
          transitionName: transitionName.value,
          trigger: normalizedTriggers,
          onVisibleChange: handleVisibleChange,
          placement: placement.value,
          destroyPopupOnHide: props.destroyOnHidden ?? props.destroyPopupOnHide,
          destroyOnHidden: undefined,
          rootClassName: props.rootClassName,
        },
        ['overlay', 'menu', 'classNames', 'styles', 'onUpdate:visible', 'autoAdjustOverflow'],
      );

      return wrapSSR(
        <RcDropdown ref={rcDropdownRef} {...rcDropdownProps} v-slots={{ overlay: renderOverlay }}>
          {dropdownTrigger}
        </RcDropdown>,
      );
    };
  },
});

Dropdown.Button = DropdownButton;
(Dropdown as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export default Dropdown;
