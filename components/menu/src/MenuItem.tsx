import { flattenChildren, isValidElement } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';
import cx from '../../_util/classNames';
import type { ExtractPropTypes, PropType } from 'vue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  shallowRef,
  watch,
} from 'vue';
import { useInjectKeyPath, useMeasure } from './hooks/useKeyPath';
import { useInjectFirstLevel, useInjectMenu } from './hooks/useMenuContext';
import { cloneElement } from '../../_util/vnode';
import Tooltip from '../../tooltip';
import type { ItemType, MenuInfo } from './interface';
import KeyCode from '../../_util/KeyCode';
import useDirectionStyle from './hooks/useDirectionStyle';
import Overflow from '../../vc-overflow';
import devWarning from '../../vc-util/devWarning';
import type { MouseEventHandler } from '../../_util/EventInterface';
import { objectType } from '../../_util/type';
import type { CustomSlotsType } from '../../_util/type';

let indexGuid = 0;
export const menuItemProps = () => ({
  id: String,
  role: String,
  disabled: Boolean,
  danger: Boolean,
  title: { type: [String, Boolean], default: undefined },
  icon: PropTypes.any,
  extra: PropTypes.any,
  onMouseenter: Function as PropType<MouseEventHandler>,
  onMouseleave: Function as PropType<MouseEventHandler>,
  onClick: Function as PropType<MouseEventHandler>,
  onKeydown: Function as PropType<MouseEventHandler>,
  onFocus: Function as PropType<MouseEventHandler>,
  // Internal user prop
  originItemValue: objectType<ItemType>(),
});

export type MenuItemProps = Partial<ExtractPropTypes<ReturnType<typeof menuItemProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMenuItem',
  inheritAttrs: false,
  props: menuItemProps(),
  slots: Object as CustomSlotsType<{
    icon?: any;
    title?: any;
    extra?: any;
    default?: any;
  }>,

  setup(props, { slots, emit, attrs }) {
    const instance = getCurrentInstance();
    const isMeasure = useMeasure();
    const key =
      typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    devWarning(
      typeof instance.vnode.key !== 'symbol',
      'MenuItem',
      `MenuItem \`:key="${String(key)}"\` not support Symbol type`,
    );

    const eventKey = `menu_item_${++indexGuid}_$$_${key}`;
    const { parentEventKeys, parentKeys } = useInjectKeyPath();
    const {
      prefixCls,
      activeKeys,
      disabled,
      changeActiveKeys,
      rtl,
      inlineCollapsed,
      siderCollapsed,
      onItemClick,
      selectedKeys,
      registerMenuInfo,
      unRegisterMenuInfo,
      classNames: semanticClassNames,
      styles: semanticStyles,
      tooltip,
      disableMenuItemTitleTooltip,
      _internalRenderMenuItem,
    } = useInjectMenu();
    const firstLevel = useInjectFirstLevel();
    const isActive = shallowRef(false);
    const keysPath = computed(() => {
      return [...parentKeys.value, key];
    });

    // const keysPath = computed(() => [...parentEventKeys.value, eventKey]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
      parentKeys,
      isLeaf: true,
    };
    registerMenuInfo(eventKey, menuInfo);

    onBeforeUnmount(() => {
      unRegisterMenuInfo(eventKey);
    });

    watch(
      activeKeys,
      () => {
        isActive.value = !!activeKeys.value.find(val => val === key);
      },
      { immediate: true },
    );
    const mergedDisabled = computed(() => disabled.value || props.disabled);
    const selected = computed(() => selectedKeys.value.includes(key));
    const classNames = computed(() => {
      const itemCls = `${prefixCls.value}-item`;
      return {
        [`${itemCls}`]: true,
        [`${itemCls}-danger`]: props.danger,
        [`${itemCls}-active`]: isActive.value,
        [`${itemCls}-selected`]: selected.value,
        [`${itemCls}-disabled`]: mergedDisabled.value,
      };
    });

    const getEventInfo = (e: MouseEvent | KeyboardEvent): MenuInfo => {
      return {
        key,
        eventKey,
        keyPath: keysPath.value,
        eventKeyPath: [...parentEventKeys.value, eventKey],
        domEvent: e,
        item: {
          ...props,
          ...attrs,
        },
      };
    };

    // ============================ Events ============================
    const onInternalClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        return;
      }

      const info = getEventInfo(e);
      emit('click', e);
      onItemClick(info);
    };

    const onMouseEnter = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys(keysPath.value);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };

    const onInternalKeyDown = (e: KeyboardEvent) => {
      emit('keydown', e);

      if (e.which === KeyCode.ENTER) {
        const info = getEventInfo(e);

        // Legacy. Key will also trigger click event
        emit('click', e);
        onItemClick(info);
      }
    };

    /**
     * Used for accessibility. Helper will focus element without key board.
     * We should manually trigger an active
     */
    const onInternalFocus = (e: FocusEvent) => {
      changeActiveKeys(keysPath.value);
      emit('focus', e);
    };

    const renderItemChildren = (icon: any, children: any, extra: any) => {
      const itemContentClass = firstLevel
        ? semanticClassNames?.value?.itemContent
        : semanticClassNames?.value?.subMenu?.itemContent;
      const itemContentStyle = firstLevel
        ? semanticStyles?.value?.itemContent
        : semanticStyles?.value?.subMenu?.itemContent;
      const hasExtra = extra !== undefined && extra !== null && extra !== false;
      const wrapNode = (
        <span
          class={cx(`${prefixCls.value}-title-content`, itemContentClass, {
            [`${prefixCls.value}-title-content-with-extra`]: hasExtra,
          })}
          style={itemContentStyle}
        >
          {hasExtra ? (
            <>
              <span class={`${prefixCls.value}-item-label`}>{children}</span>
              <span class={`${prefixCls.value}-item-extra`}>{extra}</span>
            </>
          ) : (
            children
          )}
        </span>
      );
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      if (!icon || (isValidElement(children) && children.type === 'span')) {
        if (children && inlineCollapsed.value && firstLevel && typeof children === 'string') {
          return (
            <div class={`${prefixCls.value}-inline-collapsed-noicon`}>{children.charAt(0)}</div>
          );
        }
      }
      return wrapNode;
    };

    // ========================== DirectionStyle ==========================
    const directionStyle = useDirectionStyle(computed(() => keysPath.value.length));

    return () => {
      if (isMeasure) return null;
      const title = props.title ?? slots.title?.();
      const extra = props.extra ?? slots.extra?.();
      const children = flattenChildren(slots.default?.());
      const childrenLength = children.length;
      let tooltipTitle: any = title;
      if (typeof title === 'undefined') {
        tooltipTitle = firstLevel && childrenLength ? children : '';
      } else if (title === false) {
        tooltipTitle = '';
      }
      const tooltipVal = tooltip?.value;
      const tooltipConfig = tooltipVal && typeof tooltipVal === 'object' ? tooltipVal : undefined;
      const mergedTooltipTitle =
        tooltipConfig && tooltipConfig.title !== undefined ? tooltipConfig.title : tooltipTitle;
      const tooltipProps: any = {
        ...(tooltipConfig || {}),
        title: mergedTooltipTitle,
      };

      if (!siderCollapsed.value && !inlineCollapsed.value) {
        tooltipProps.title = null;
        // Reset `visible` to fix control mode tooltip display not correct
        // ref: https://github.com/ant-design/ant-design/issues/16742
        tooltipProps.open = false;
      }

      // ============================ Render ============================
      const optionRoleProps = {};

      if (props.role === 'option') {
        optionRoleProps['aria-selected'] = selected.value;
      }

      const icon = props.icon ?? slots.icon?.(props);
      const itemSemanticClass = firstLevel
        ? semanticClassNames?.value?.item
        : semanticClassNames?.value?.subMenu?.item;
      const itemSemanticStyle = firstLevel
        ? semanticStyles?.value?.item
        : semanticStyles?.value?.subMenu?.item;
      const itemIconClass = firstLevel
        ? semanticClassNames?.value?.itemIcon
        : semanticClassNames?.value?.subMenu?.itemIcon;
      const itemIconStyle = firstLevel
        ? semanticStyles?.value?.itemIcon
        : semanticStyles?.value?.subMenu?.itemIcon;
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs;
      const resolvedIcon = typeof icon === 'function' ? icon(props.originItemValue) : icon;

      let itemNode: any = (
        <Overflow.Item
          component="li"
          {...restAttrs}
          id={props.id}
          style={{
            ...directionStyle.value,
            ...(itemSemanticStyle || {}),
            ...((attrStyle as any) || {}),
          }}
          class={[
            classNames.value,
            itemSemanticClass,
            attrClass,
            {
              [`${prefixCls.value}-item-only-child`]:
                (icon ? childrenLength + 1 : childrenLength) === 1,
            },
          ]}
          role={props.role || 'menuitem'}
          tabindex={props.disabled ? null : -1}
          data-menu-id={key}
          aria-disabled={props.disabled}
          {...optionRoleProps}
          onMouseenter={onMouseEnter}
          onMouseleave={onMouseLeave}
          onClick={onInternalClick}
          onKeydown={onInternalKeyDown}
          onFocus={onInternalFocus}
          title={typeof title === 'string' ? title : undefined}
        >
          {cloneElement(
            resolvedIcon,
            {
              class: cx(`${prefixCls.value}-item-icon`, itemIconClass),
              ...(itemIconStyle ? { style: itemIconStyle } : {}),
            },
            false,
          )}
          {renderItemChildren(icon, children, extra)}
        </Overflow.Item>
      );

      if (_internalRenderMenuItem?.value) {
        itemNode = _internalRenderMenuItem.value(itemNode, { ...props, ...attrs });
      }

      if (disableMenuItemTitleTooltip?.value || tooltipVal === false) {
        return itemNode;
      }

      const mergedPlacement = tooltipConfig?.placement || (rtl.value ? 'left' : 'right');
      const mergedOverlayClassName = cx(
        `${prefixCls.value}-inline-collapsed-tooltip`,
        tooltipConfig?.overlayClassName,
      );

      return (
        <Tooltip
          {...tooltipProps}
          placement={mergedPlacement}
          overlayClassName={mergedOverlayClassName}
        >
          {itemNode}
        </Tooltip>
      );
    };
  },
});
