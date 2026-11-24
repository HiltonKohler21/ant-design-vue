import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { getPropsSlot } from '../_util/props-util';
import type { DropdownProps } from '../dropdown/dropdown';
import Dropdown from '../dropdown/dropdown';
import type { MenuProps } from '../menu';
import Menu from '../menu';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectBreadcrumb } from './BreadcrumbContext';
import type { MouseEventHandler } from '../_util/EventInterface';
import { eventType, objectType } from '../_util/type';
import type { CustomSlotsType, Key, VueNode } from '../_util/type';

export interface BreadcrumbMenuItem {
  key?: Key;
  title?: VueNode;
  label?: VueNode;
  path?: string;
  href?: string;
  onClick?: MouseEventHandler;
  [key: string]: any;
}

export type BreadcrumbMenuProps = Omit<MenuProps, 'items'> & {
  items?: BreadcrumbMenuItem[];
};

export const breadcrumbItemProps = () => ({
  prefixCls: String,
  href: String,
  separator: PropTypes.any,
  dropdownProps: objectType<DropdownProps>(),
  dropdownIcon: PropTypes.any,
  menu: objectType<BreadcrumbMenuProps>(),
  overlay: PropTypes.any,
  onClick: eventType<MouseEventHandler>(),
});

export type BreadcrumbItemProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbItemProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABreadcrumbItem',
  inheritAttrs: false,
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps(),
  // emits: ['click'],
  slots: Object as CustomSlotsType<{
    separator: any;
    overlay: any;
    dropdownIcon: any;
    default: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);
    const { classNames: semanticClassNames, styles: semanticStyles } = useInjectBreadcrumb();
    /**
     * if menu or overlay is present
     * Wrap a Dropdown
     */
    const renderBreadcrumbNode = (breadcrumbItem: VueNode, prefixCls: string) => {
      const overlay = getPropsSlot(slots, props, 'overlay');
      const customDropdownIcon = getPropsSlot(slots, props, 'dropdownIcon');
      const dropdownIcon = customDropdownIcon !== undefined ? customDropdownIcon : <DownOutlined />;

      if (props.menu) {
        const { items, ...menuProps } = props.menu;
        const menuOverlay = (
          <Menu
            {...menuProps}
            items={
              items?.map(({ key, title, label, path, href: itemHref, ...itemProps }, index) => {
                let mergedLabel: VueNode = label ?? title;

                if (path) {
                  mergedLabel = <a href={`${props.href ?? ''}${path}`}>{mergedLabel}</a>;
                } else if (itemHref !== undefined) {
                  mergedLabel = <a href={itemHref}>{mergedLabel}</a>;
                }

                return {
                  ...itemProps,
                  key: key ?? index,
                  label: mergedLabel,
                };
              }) as MenuProps['items']
            }
          />
        );
        return (
          <Dropdown placement="bottom" {...props.dropdownProps} overlay={menuOverlay}>
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              {dropdownIcon}
            </span>
          </Dropdown>
        );
      }

      if (overlay) {
        return (
          <Dropdown placement="bottom" {...props.dropdownProps} overlay={overlay}>
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              {dropdownIcon}
            </span>
          </Dropdown>
        );
      }
      return breadcrumbItem;
    };
    const handleClick = (e: MouseEvent) => {
      emit('click', e);
    };
    return () => {
      const separator = getPropsSlot(slots, props, 'separator') ?? '/';
      const children = getPropsSlot(slots, props);
      const { class: cls, style, ...restAttrs } = attrs;
      let link: VueNode;
      if (props.href !== undefined) {
        link = (
          <a
            class={`${prefixCls.value}-link`}
            href={props.href || undefined}
            onClick={handleClick}
            {...restAttrs}
          >
            {children}
          </a>
        );
      } else {
        link = (
          <span class={`${prefixCls.value}-link`} onClick={handleClick} {...restAttrs}>
            {children}
          </span>
        );
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children !== undefined && children !== null) {
        const itemClass = classNames(cls as any, semanticClassNames.value.item) || undefined;
        const itemStyle =
          semanticStyles.value.item || style
            ? [semanticStyles.value.item, style as CSSProperties]
            : undefined;
        const separatorClass = classNames(
          `${prefixCls.value}-separator`,
          semanticClassNames.value.separator,
        );
        const separatorStyle = semanticStyles.value.separator;
        return (
          <li class={itemClass} style={itemStyle}>
            {link}
            {separator && (
              <span class={separatorClass} style={separatorStyle}>
                {separator}
              </span>
            )}
          </li>
        );
      }
      return null;
    };
  },
});
