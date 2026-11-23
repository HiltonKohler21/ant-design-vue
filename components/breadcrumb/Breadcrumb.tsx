import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { cloneVNode, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import warning from '../_util/warning';
import type { BreadcrumbItemProps, BreadcrumbMenuProps } from './BreadcrumbItem';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import type { DropdownProps } from '../dropdown/dropdown';
import Menu from '../menu';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { CustomSlotsType, Key, VueNode } from '../_util/type';

export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

export interface BreadcrumbItemType {
  key?: Key;
  /**
   * Different with `path`. Directly set the link of this item.
   */
  href?: string;
  /**
   * Different with `href`. It will concat all prev `path` to the current one.
   */
  path?: string;
  title?: VueNode;
  /** @deprecated Please use `title` instead */
  breadcrumbName?: string;
  menu?: BreadcrumbMenuProps;
  class?: any;
  className?: string;
  style?: CSSProperties;
  dropdownProps?: DropdownProps;
  onClick?: MouseEventHandler;
  /** @deprecated Please use `menu` instead */
  children?: Omit<BreadcrumbItemType, 'children'>[];
  [key: `data-${string}`]: string;
}

export interface BreadcrumbSeparatorType {
  key?: Key;
  type: 'separator';
  separator?: VueNode;
}

export type ItemType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>;

export const breadcrumbProps = () => ({
  rootClassName: String,
  prefixCls: String,
  routes: { type: Array as PropType<Route[]> },
  items: { type: Array as PropType<ItemType[]> },
  params: PropTypes.any,
  separator: PropTypes.any,
  dropdownIcon: PropTypes.any,
  itemRender: {
    type: Function as PropType<
      (opt: { route: any; params: any; routes: any[]; paths: string[] }) => VueNode
    >,
  },
});

export type BreadcrumbProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbProps>>>;

function getBreadcrumbName(route: Route, params: unknown) {
  if (!route.breadcrumbName) {
    return null;
  }
  const paramsKeys = Object.keys(params || {}).join('|');
  if (!paramsKeys) {
    return route.breadcrumbName;
  }
  const name = route.breadcrumbName.replace(
    new RegExp(`:(${paramsKeys})`, 'g'),
    (replacement, key) => params[key] || replacement,
  );
  return name;
}

function getItemTitle(item: ItemType, params: Record<string, any>) {
  const rawTitle = item.title !== undefined ? item.title : item.breadcrumbName;
  if (rawTitle === undefined || rawTitle === null) {
    return null;
  }
  if (typeof rawTitle === 'string') {
    const paramsKeys = Object.keys(params || {}).join('|');
    if (!paramsKeys) {
      return rawTitle;
    }
    return rawTitle.replace(
      new RegExp(`:(${paramsKeys})`, 'g'),
      (replacement, key) => params[key] || replacement,
    );
  }
  return rawTitle;
}

function defaultItemRender(opt: {
  route: Route;
  params: unknown;
  routes: Route[];
  paths: string[];
}): VueNode {
  const { route, params, routes, paths } = opt;
  const isLastItem = routes.indexOf(route) === routes.length - 1;
  const name = getBreadcrumbName(route, params);
  return isLastItem ? <span>{name}</span> : <a href={`#/${paths.join('/')}`}>{name}</a>;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABreadcrumb',
  inheritAttrs: false,
  props: breadcrumbProps(),
  slots: Object as CustomSlotsType<{
    separator: any;
    dropdownIcon: any;
    itemRender: { route: any; params: any; routes: any[]; paths: string[] };
    default: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('breadcrumb', props);
    const {
      componentConfig: breadcrumbConfig,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('breadcrumb');
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getPath = (path: string, params: unknown) => {
      path = (path || '').replace(/^\//, '');
      Object.keys(params || {}).forEach(key => {
        path = path.replace(`:${key}`, params[key]);
      });
      return path;
    };

    const addChildPath = (paths: string[], childPath: string, params: unknown) => {
      const originalPaths = [...paths];
      const path = getPath(childPath || '', params);
      if (path) {
        originalPaths.push(path);
      }
      return originalPaths;
    };

    const genForRoutes = ({
      routes = [],
      params = {},
      separator,
      dropdownIcon,
      itemRender = defaultItemRender,
    }: any) => {
      const paths = [];
      return routes.map((route: Route) => {
        const path = getPath(route.path, params);

        if (path) {
          paths.push(path);
        }
        const tempPaths = [...paths];
        // generated overlay by route.children
        let overlay = null;
        if (route.children && route.children.length) {
          overlay = (
            <Menu
              items={route.children.map(child => ({
                key: child.path || child.breadcrumbName,
                label: itemRender({
                  route: child,
                  params,
                  routes,
                  paths: addChildPath(tempPaths, child.path, params),
                }),
              }))}
            ></Menu>
          );
        }
        const itemProps: BreadcrumbItemProps = { separator };
        if (overlay) {
          itemProps.overlay = overlay;
        }
        if (dropdownIcon !== undefined) {
          itemProps.dropdownIcon = dropdownIcon;
        }
        return (
          <BreadcrumbItem {...itemProps} key={path || route.breadcrumbName}>
            {itemRender({ route, params, routes, paths: tempPaths })}
          </BreadcrumbItem>
        );
      });
    };

    const genForItems = ({
      items = [],
      params = {},
      separator,
      dropdownIcon,
      customItemRender,
    }: {
      items: ItemType[];
      params: Record<string, any>;
      separator: any;
      dropdownIcon: any;
      customItemRender?: any;
    }) => {
      const paths: string[] = [];
      return items.map((item, index) => {
        const {
          path,
          key,
          type,
          menu,
          children: itemChildren,
          onClick,
          class: itemClass,
          className: itemClassName,
          style: itemStyle,
          separator: itemSeparator,
          dropdownProps,
          ...restItem
        } = item;

        const mergedPath = path !== undefined ? getPath(path, params) : undefined;
        if (mergedPath !== undefined) {
          paths.push(mergedPath);
        }
        const tempPaths = [...paths];
        const mergedKey = key ?? index;

        if (type === 'separator') {
          return <BreadcrumbSeparator key={mergedKey}>{itemSeparator}</BreadcrumbSeparator>;
        }

        let mergedMenu = menu;
        if (!mergedMenu && itemChildren && itemChildren.length) {
          mergedMenu = {
            items: itemChildren.map(child => ({
              ...child,
              key: child.key ?? child.path ?? (child.title as string) ?? child.breadcrumbName,
              title: child.title ?? child.breadcrumbName,
            })),
          };
        }

        let { href } = item;
        if (paths.length && mergedPath !== undefined) {
          href = `#/${paths.join('/')}`;
        }

        const isLastItem = index === items.length - 1;
        const itemProps: BreadcrumbItemProps = {
          separator: isLastItem ? '' : separator,
        };
        if (mergedMenu) {
          itemProps.menu = mergedMenu;
        }
        if (dropdownProps) {
          itemProps.dropdownProps = dropdownProps;
        }
        if (dropdownIcon !== undefined) {
          itemProps.dropdownIcon = dropdownIcon;
        }
        if (onClick) {
          itemProps.onClick = onClick;
        }

        const extraAttrs: Record<string, any> = {};
        Object.keys(restItem).forEach(attrKey => {
          if (attrKey.startsWith('data-') || attrKey.startsWith('aria-')) {
            extraAttrs[attrKey] = (restItem as any)[attrKey];
          }
        });

        const mergedClass = classNames(itemClass, itemClassName) || undefined;

        if (customItemRender) {
          return (
            <BreadcrumbItem
              key={mergedKey}
              {...itemProps}
              {...extraAttrs}
              class={mergedClass}
              style={itemStyle}
            >
              {customItemRender({ route: item, params, routes: items, paths: tempPaths })}
            </BreadcrumbItem>
          );
        }

        return (
          <BreadcrumbItem
            key={mergedKey}
            {...itemProps}
            {...extraAttrs}
            class={mergedClass}
            style={itemStyle}
            href={href}
          >
            {getItemTitle(item, params)}
          </BreadcrumbItem>
        );
      });
    };

    return () => {
      let crumbs: VueNode[];

      const { items, routes, params = {} } = props;

      const children = flattenChildren(getPropsSlot(slots, props));
      const separator =
        getPropsSlot(slots, props, 'separator') ?? breadcrumbConfig.value.separator ?? '/';
      const dropdownIcon =
        getPropsSlot(slots, props, 'dropdownIcon') ?? breadcrumbConfig.value.dropdownIcon;

      const customItemRender = props.itemRender || slots.itemRender;
      const itemRender = customItemRender || defaultItemRender;
      if (items && items.length > 0) {
        crumbs = genForItems({
          items,
          params,
          separator,
          dropdownIcon,
          customItemRender,
        });
      } else if (routes && routes.length > 0) {
        // generated by route
        crumbs = genForRoutes({
          routes,
          params,
          separator,
          dropdownIcon,
          itemRender,
        });
      } else if (children.length) {
        crumbs = children.map((element, index) => {
          warning(
            typeof element.type === 'object' &&
              (element.type.__ANT_BREADCRUMB_ITEM || element.type.__ANT_BREADCRUMB_SEPARATOR),
            'Breadcrumb',
            "Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children",
          );
          const cloneProps: Record<string, any> = { separator, key: index };
          if (
            dropdownIcon !== undefined &&
            element.props?.dropdownIcon === undefined &&
            !(element.children as any)?.dropdownIcon
          ) {
            cloneProps.dropdownIcon = dropdownIcon;
          }
          return cloneVNode(element, cloneProps);
        });
      }

      const breadcrumbClassName = classNames(
        prefixCls.value,
        contextClassName.value,
        contextClassNames.value.root,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class as any,
        props.rootClassName,
        hashId.value,
      );

      return wrapSSR(
        <nav
          {...attrs}
          class={breadcrumbClassName}
          style={[contextStyle.value, contextStyles.value.root, attrs.style as CSSProperties]}
        >
          <ol>{crumbs}</ol>
        </nav>,
      );
    };
  },
});
