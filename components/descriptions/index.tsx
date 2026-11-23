import type {
  Ref,
  App,
  PropType,
  VNode,
  HTMLAttributes,
  ExtractPropTypes,
  Plugin,
  CSSProperties,
  InjectionKey,
} from 'vue';
import {
  onBeforeMount,
  ref,
  defineComponent,
  onBeforeUnmount,
  provide,
  toRef,
  computed,
} from 'vue';
import warning from '../_util/warning';
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserve';
import useResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import Row from './Row';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { CustomSlotsType, Key, VueNode } from '../_util/type';
import type { DescriptionsSemanticName, SemanticNames, SemanticStylesMap } from '../_util/semantic';
import useStyle from './style';

export type DescriptionsItemSpan = number | 'filled' | Partial<Record<Breakpoint, number>>;

export interface DescriptionsItemType {
  key?: Key;
  label?: VueNode;
  children?: VueNode;
  span?: DescriptionsItemSpan;
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  class?: any;
  className?: string;
  style?: CSSProperties;
  classNames?: SemanticNames<'label' | 'content'>;
  styles?: SemanticStylesMap<'label' | 'content'>;
}

export const DescriptionsItemProps = {
  prefixCls: String,
  label: PropTypes.any,
  span: [Number, String, Object] as PropType<DescriptionsItemSpan>,
};

const descriptionsItemProp = () => ({
  prefixCls: String,
  label: PropTypes.any,
  labelStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  contentStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  classNames: {
    type: Object as PropType<SemanticNames<'label' | 'content'>>,
    default: undefined,
  },
  styles: {
    type: Object as PropType<SemanticStylesMap<'label' | 'content'>>,
    default: undefined,
  },
  span: {
    type: [Number, String, Object] as PropType<DescriptionsItemSpan>,
    default: 1 as DescriptionsItemSpan,
  },
});

export type DescriptionsItemProp = Partial<
  ExtractPropTypes<ReturnType<typeof descriptionsItemProp>>
>;

export const DescriptionsItem = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADescriptionsItem',
  props: descriptionsItemProp(),
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

const DEFAULT_COLUMN_MAP: Partial<Record<Breakpoint, number>> = {
  xxxl: 3,
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

function getColumn(column: DescriptionsProps['column'], screens: ScreenMap): number {
  if (typeof column === 'number') {
    return column;
  }

  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }

  return 3;
}

function getFilledItem(node: VNode, rowRestCol: number, span?: number): VNode {
  let clone = node;

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    });
    warning(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.',
    );
  }

  return clone;
}

function resolveItemSpan(
  span: DescriptionsItemSpan | undefined,
  screens: ScreenMap,
): { span?: number; filled?: boolean } {
  if (span === 'filled') {
    return { filled: true };
  }
  if (typeof span === 'number') {
    return { span };
  }
  if (span && typeof span === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && span[breakpoint] !== undefined) {
        return { span: span[breakpoint] };
      }
    }
    return { span: undefined };
  }
  return { span: undefined };
}

function getRows(children: VNode[], column: number, screens: ScreenMap) {
  const childNodes = flattenChildren(children);
  const rows: VNode[][] = [];

  let tmpRow: VNode[] = [];
  let rowRestCol = column;
  childNodes.forEach((node, index) => {
    const rawSpan: DescriptionsItemSpan | undefined = node.props?.span;
    const { span, filled } = resolveItemSpan(rawSpan, screens);
    const mergedSpan = span || 1;
    const normalizedNode =
      rawSpan !== undefined && typeof rawSpan !== 'number' && !filled
        ? cloneElement(node, { span: mergedSpan })
        : node;

    if (filled) {
      tmpRow.push(cloneElement(node, { span: rowRestCol }));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
      return;
    }

    // Additional handle last one
    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(normalizedNode, rowRestCol, span));
      rows.push(tmpRow);
      return;
    }

    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(normalizedNode);
    } else {
      tmpRow.push(getFilledItem(normalizedNode, rowRestCol, mergedSpan));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });

  return rows;
}

export const descriptionsProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 语义化 classNames（antd 5.25+）：root / header / title / extra / label / content */
  classNames: {
    type: Object as PropType<SemanticNames<DescriptionsSemanticName>>,
    default: undefined,
  },
  /** 语义化 styles（antd 5.25+）：root / header / title / extra / label / content */
  styles: {
    type: Object as PropType<SemanticStylesMap<DescriptionsSemanticName>>,
    default: undefined,
  },
  bordered: { type: Boolean, default: undefined },
  size: { type: String as PropType<'default' | 'middle' | 'small'>, default: 'default' },
  title: PropTypes.any,
  extra: PropTypes.any,
  column: {
    type: [Number, Object] as PropType<number | Partial<Record<Breakpoint, number>>>,
    default: (): number | Partial<Record<Breakpoint, number>> => DEFAULT_COLUMN_MAP,
  },
  layout: String as PropType<'horizontal' | 'vertical'>,
  colon: { type: Boolean, default: undefined },
  labelStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  contentStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  items: { type: Array as PropType<DescriptionsItemType[]> },
});

export type DescriptionsProps = HTMLAttributes &
  Partial<ExtractPropTypes<ReturnType<typeof descriptionsProps>>>;

export interface DescriptionsContextProp {
  labelStyle?: Ref<CSSProperties>;
  contentStyle?: Ref<CSSProperties>;
  classNames?: Ref<SemanticNames<DescriptionsSemanticName> | undefined>;
  styles?: Ref<SemanticStylesMap<DescriptionsSemanticName> | undefined>;
}

export const descriptionsContext: InjectionKey<DescriptionsContextProp> =
  Symbol('descriptionsContext');

const Descriptions = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADescriptions',
  inheritAttrs: false,
  props: descriptionsProps(),
  slots: Object as CustomSlotsType<{
    title?: any;
    extra?: any;
    default?: any;
  }>,
  Item: DescriptionsItem,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction, configProvider } = useConfigInject('descriptions', props);
    let token: number;
    const screens = ref<ScreenMap>({});

    const [wrapSSR, hashId] = useStyle(prefixCls);
    const responsiveObserve = useResponsiveObserve();

    const contextDescriptions = computed(() => configProvider.descriptions?.value as any);

    const mergedClassNames = computed<SemanticNames<DescriptionsSemanticName>>(() => {
      const ctx = contextDescriptions.value?.classNames;
      const own = props.classNames;
      return {
        root: classNames(ctx?.root, own?.root) || undefined,
        header: classNames(ctx?.header, own?.header) || undefined,
        title: classNames(ctx?.title, own?.title) || undefined,
        extra: classNames(ctx?.extra, own?.extra) || undefined,
        label: classNames(ctx?.label, own?.label) || undefined,
        content: classNames(ctx?.content, own?.content) || undefined,
      };
    });

    const mergedStyles = computed<SemanticStylesMap<DescriptionsSemanticName>>(() => {
      const ctx = contextDescriptions.value?.styles;
      const own = props.styles;
      const merge = (a?: CSSProperties, b?: CSSProperties) => (a || b ? { ...a, ...b } : undefined);
      return {
        root: merge(ctx?.root, own?.root),
        header: merge(ctx?.header, own?.header),
        title: merge(ctx?.title, own?.title),
        extra: merge(ctx?.extra, own?.extra),
        label: merge(ctx?.label, own?.label),
        content: merge(ctx?.content, own?.content),
      };
    });

    onBeforeMount(() => {
      token = responsiveObserve.value.subscribe(screen => {
        screens.value = screen;
      });
    });

    onBeforeUnmount(() => {
      responsiveObserve.value.unsubscribe(token);
    });

    provide(descriptionsContext, {
      labelStyle: toRef(props, 'labelStyle'),
      contentStyle: toRef(props, 'contentStyle'),
      classNames: mergedClassNames,
      styles: mergedStyles,
    });

    const mergeColumn = computed(() => getColumn(props.column, screens.value));

    return () => {
      const {
        size,
        bordered = false,
        layout = 'horizontal',
        colon = true,
        title = slots.title?.(),
        extra = slots.extra?.(),
        items,
      } = props;

      const children = items
        ? items.map((item, index) => (
            <DescriptionsItem
              key={item.key ?? index}
              label={item.label}
              span={item.span}
              labelStyle={item.labelStyle}
              contentStyle={item.contentStyle}
              class={classNames(item.class, item.className) || undefined}
              style={item.style}
              classNames={item.classNames}
              styles={item.styles}
            >
              {item.children}
            </DescriptionsItem>
          ))
        : slots.default?.();
      const rows = getRows(children, mergeColumn.value, screens.value);

      return wrapSSR(
        <div
          {...attrs}
          class={[
            prefixCls.value,
            {
              [`${prefixCls.value}-${size}`]: size !== 'default',
              [`${prefixCls.value}-bordered`]: !!bordered,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            contextDescriptions.value?.className,
            props.rootClassName,
            mergedClassNames.value.root,
            attrs.class,
            hashId.value,
          ]}
          style={[
            contextDescriptions.value?.style,
            contextDescriptions.value?.styles?.root,
            attrs.style as any,
            props.styles?.root,
          ]}
        >
          {(title || extra) && (
            <div
              class={[`${prefixCls.value}-header`, mergedClassNames.value.header]}
              style={mergedStyles.value.header}
            >
              {title && (
                <div
                  class={[`${prefixCls.value}-title`, mergedClassNames.value.title]}
                  style={mergedStyles.value.title}
                >
                  {title}
                </div>
              )}
              {extra && (
                <div
                  class={[`${prefixCls.value}-extra`, mergedClassNames.value.extra]}
                  style={mergedStyles.value.extra}
                >
                  {extra}
                </div>
              )}
            </div>
          )}
          <div class={`${prefixCls.value}-view`}>
            <table>
              <tbody>
                {rows.map((row, index) => (
                  <Row
                    key={index}
                    index={index}
                    colon={colon}
                    prefixCls={prefixCls.value}
                    vertical={layout === 'vertical'}
                    bordered={bordered}
                    row={row}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>,
      );
    };
  },
});

Descriptions.install = function (app: App) {
  app.component(Descriptions.name, Descriptions);
  app.component(Descriptions.Item.name, Descriptions.Item);
  return app;
};
export default Descriptions as typeof Descriptions &
  Plugin & {
    readonly Item: typeof DescriptionsItem;
  };
