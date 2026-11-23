import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, ref, toRaw } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Key, VueNode } from '../_util/type';
import { objectType, withInstall } from '../_util/type';
import devWarning from '../vc-util/devWarning';
import VirtualList from '../vc-virtual-list';
import { useToken } from '../theme/internal';
import useStyle from './style';

export type ScrollAlign = 'top' | 'bottom' | 'auto';

export type ListyScrollToConfig =
  | number
  | {
      top?: number;
      left?: number;
    }
  | {
      index: number;
      align?: ScrollAlign;
      offset?: number;
    }
  | {
      key: Key;
      align?: ScrollAlign;
      offset?: number;
    }
  | {
      groupKey: Key;
      align?: ScrollAlign;
      offset?: number;
    };

export interface ListyGroupConfig<T = any, K extends Key = Key> {
  key?: string | ((item: T) => K);
  title?: (groupKey: K, items: T[]) => VueNode;
}

export interface ListyClassNames {
  root?: string;
  item?: string;
  groupHeader?: string;
  groupSection?: string;
  holder?: string;
  scrollbar?: string;
}

export interface ListyStyles {
  root?: CSSProperties;
  item?: CSSProperties;
  groupHeader?: CSSProperties;
  groupSection?: CSSProperties;
  holder?: CSSProperties;
  scrollbar?: CSSProperties;
}

export type ListySemanticClassNamesFn = (info: { props: ListyProps }) => ListyClassNames;
export type ListySemanticStylesFn = (info: { props: ListyProps }) => ListyStyles;

export interface ListyRef {
  nativeElement?: HTMLElement;
  scrollTo: (config?: ListyScrollToConfig) => void;
  scrollToIndex: (index: number) => void;
}

export const listyProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 数据源（主 API，对齐 antd 6.7.2） */
  items: { type: Array as PropType<any[]>, default: undefined },
  /** @deprecated Please use `items` instead. */
  data: { type: Array as PropType<any[]>, default: undefined },
  /** 自定义渲染 */
  itemRender: { type: Function as PropType<(item: any, index: number) => any> },
  /** 行 key（字段名或函数，主 API，对齐 antd 6.7.2） */
  rowKey: {
    type: [String, Function] as PropType<string | ((item: any, index?: number) => Key)>,
  },
  /** @deprecated Please use `rowKey` instead. */
  itemKey: {
    type: [String, Function] as PropType<string | ((item: any, index?: number) => Key)>,
  },
  /** 列表高度（滚动容器高度；虚拟与非虚拟模式均生效） */
  height: { type: Number },
  /** 行高（可选覆写；未传入时自动从主题 Token 计算） */
  itemHeight: { type: Number },
  /** 横向滚动内容宽度 */
  scrollWidth: { type: Number },
  /** 分组配置 */
  group: objectType<ListyGroupConfig>(),
  /** 分组标题是否吸顶 */
  sticky: { type: Boolean, default: false },
  /** 是否虚拟滚动（默认回退到 ConfigProvider.virtual ?? false） */
  virtual: { type: Boolean, default: undefined },
  /** 行 hover 背景 */
  rowHoverable: { type: Boolean, default: true },
  /** 语义化类名（支持对象与函数） */
  classNames: {
    type: [Object, Function] as PropType<ListyClassNames | ListySemanticClassNamesFn>,
  },
  /** 语义化样式（支持对象与函数） */
  styles: {
    type: [Object, Function] as PropType<ListyStyles | ListySemanticStylesFn>,
  },
  onScroll: { type: Function as PropType<(e: UIEvent) => void> },
});

export type ListyProps = Partial<ExtractPropTypes<ReturnType<typeof listyProps>>>;

interface GroupBucket {
  groupKey: Key;
  entries: { item: any; originIndex: number; key: Key }[];
}

type FlatRow =
  | {
      __listyType: 'group';
      __listyKey: string;
      groupKey: Key;
      items: any[];
    }
  | {
      __listyType: 'item';
      __listyKey: Key;
      item: any;
      originIndex: number;
      groupKey?: Key;
    };

function resolveSemantic<T extends Record<string, any>>(
  source: T | ((info: { props: ListyProps }) => T) | undefined,
  props: ListyProps,
): T {
  if (!source) return {} as T;
  if (typeof source === 'function') {
    return (source({ props }) || {}) as T;
  }
  return source;
}

const Listy = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AListy',
  inheritAttrs: false,
  props: listyProps(),
  setup(props, { attrs, slots, expose }) {
    const { getPrefixCls, direction, configProvider } = useConfigInject('listy', props);
    const prefixCls = computed(() => getPrefixCls('listy', props.prefixCls));
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, , , realToken] = useToken();

    const listRef = ref<any>();
    const rootRef = ref<HTMLElement>();
    const hScrollRef = ref<HTMLElement>();
    const currentScrollTop = ref(0);

    // Dev warnings for deprecated props
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !(props.data !== undefined && props.items === undefined),
        'Listy',
        '`data` is deprecated. Please use `items` instead.',
      );
      devWarning(
        !(props.itemKey !== undefined && props.rowKey === undefined),
        'Listy',
        '`itemKey` is deprecated. Please use `rowKey` instead.',
      );
    }

    const mergedItems = computed<any[]>(() => props.items ?? props.data ?? []);
    const mergedRowKey = computed(() => props.rowKey ?? props.itemKey);

    const listyContextConfig = computed(() => (configProvider as any).listy?.value || {});

    // Auto-compute itemHeight from realToken when omitted (matching antd 6.7.2)
    const computedItemHeight = computed(() => {
      if (props.itemHeight !== undefined) return props.itemHeight;
      const raw: any = realToken.value || {};
      const listyToken = { ...raw, ...(raw.Listy || {}) };
      const fontHeight =
        listyToken.fontHeight ??
        Math.round((listyToken.fontSize ?? 14) * (listyToken.lineHeight ?? 1.5714285714285714));
      const paddingBlock = listyToken.itemPaddingBlock ?? listyToken.paddingSM ?? 12;
      return fontHeight + paddingBlock * 2;
    });

    // Align virtual default with antd 6.7.2: props.virtual ?? configProvider.virtual ?? false
    const mergedVirtual = computed(() => props.virtual ?? configProvider.virtual?.value ?? false);
    const isVirtualMode = computed(() => Boolean(mergedVirtual.value && props.height));

    const itemIndexMap = computed(() => {
      const map = new Map<any, number>();
      const list = mergedItems.value;
      for (let i = 0; i < list.length; i += 1) {
        const entry = list[i];
        const rawEntry = toRaw(entry);
        if (!map.has(entry)) {
          map.set(entry, i);
        }
        if (rawEntry !== entry && !map.has(rawEntry)) {
          map.set(rawEntry, i);
        }
      }
      return map;
    });

    const keyFn = computed(() => {
      const k = mergedRowKey.value;
      if (typeof k === 'function') {
        return (item: any, index?: number) => {
          const idx =
            index !== undefined
              ? index
              : itemIndexMap.value.get(item) ?? itemIndexMap.value.get(toRaw(item)) ?? 0;
          return k(item, idx);
        };
      }
      if (typeof k === 'string') {
        return (item: any, index?: number) => {
          const val = item?.[k];
          if (val !== undefined && val !== null) return val;
          if (index !== undefined) return index;
          const idx = itemIndexMap.value.get(item) ?? itemIndexMap.value.get(toRaw(item));
          return idx !== undefined ? idx : String(item);
        };
      }
      return (item: any, index?: number) => {
        if (
          item != null &&
          typeof item === 'object' &&
          item.key !== undefined &&
          item.key !== null
        ) {
          return item.key;
        }
        if (index !== undefined) return index;
        const idx = itemIndexMap.value.get(item) ?? itemIndexMap.value.get(toRaw(item));
        return idx !== undefined ? idx : String(item);
      };
    });

    // Group computation
    const groupBuckets = computed<GroupBucket[]>(() => {
      const groupCfg = props.group as ListyGroupConfig | undefined;
      if (!groupCfg) return [];
      const list = mergedItems.value;
      const map = new Map<Key, GroupBucket>();
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        let gKey: Key;
        if (typeof groupCfg.key === 'function') {
          gKey = groupCfg.key(item);
        } else if (typeof groupCfg.key === 'string') {
          gKey = item?.[groupCfg.key];
        } else {
          gKey = '';
        }
        let bucket = map.get(gKey);
        if (!bucket) {
          bucket = { groupKey: gKey, entries: [] };
          map.set(gKey, bucket);
        }
        bucket.entries.push({
          item,
          originIndex: i,
          key: keyFn.value(item, i),
        });
      }
      return Array.from(map.values());
    });

    const flatRows = computed<FlatRow[]>(() => {
      if (props.group) {
        const rows: FlatRow[] = [];
        for (const bucket of groupBuckets.value) {
          rows.push({
            __listyType: 'group',
            __listyKey: `__listy_group__${String(bucket.groupKey)}`,
            groupKey: bucket.groupKey,
            items: bucket.entries.map(e => e.item),
          });
          for (const entry of bucket.entries) {
            rows.push({
              __listyType: 'item',
              __listyKey: entry.key,
              item: entry.item,
              originIndex: entry.originIndex,
              groupKey: bucket.groupKey,
            });
          }
        }
        return rows;
      }
      return mergedItems.value.map((item, idx) => ({
        __listyType: 'item' as const,
        __listyKey: keyFn.value(item, idx),
        item,
        originIndex: idx,
      }));
    });

    const mergedSemanticClassNames = computed<ListyClassNames>(() => {
      const ctxCls = resolveSemantic<ListyClassNames>(listyContextConfig.value.classNames, props);
      const propCls = resolveSemantic<ListyClassNames>(props.classNames, props);
      return {
        root: classNames(ctxCls.root, propCls.root),
        item: classNames(ctxCls.item, propCls.item),
        groupHeader: classNames(ctxCls.groupHeader, propCls.groupHeader),
        groupSection: classNames(ctxCls.groupSection, propCls.groupSection),
        holder: classNames(ctxCls.holder, propCls.holder),
        scrollbar: classNames(ctxCls.scrollbar, propCls.scrollbar),
      };
    });

    const mergedSemanticStyles = computed<ListyStyles>(() => {
      const ctxStyle = resolveSemantic<ListyStyles>(listyContextConfig.value.styles, props);
      const propStyle = resolveSemantic<ListyStyles>(props.styles, props);
      return {
        root: { ...ctxStyle.root, ...propStyle.root },
        item: { ...ctxStyle.item, ...propStyle.item },
        groupHeader: { ...ctxStyle.groupHeader, ...propStyle.groupHeader },
        groupSection: { ...ctxStyle.groupSection, ...propStyle.groupSection },
        holder: { ...ctxStyle.holder, ...propStyle.holder },
        scrollbar: { ...ctxStyle.scrollbar, ...propStyle.scrollbar },
      };
    });

    const renderItem = (item: any, index: number) => {
      if (props.itemRender) return props.itemRender(item, index);
      if (slots.item) return (slots.item as any)({ item, index });
      return item?.children ?? item?.label ?? String(item);
    };

    const renderGroupTitle = (groupKey: Key, items: any[]) => {
      const groupCfg = props.group as ListyGroupConfig | undefined;
      if (groupCfg?.title) return groupCfg.title(groupKey, items);
      if (slots.groupTitle) return (slots.groupTitle as any)({ groupKey, items });
      return String(groupKey);
    };

    const getVirtualHolderEl = (): HTMLElement | null => {
      return (
        listRef.value?.componentRef ||
        rootRef.value?.querySelector?.(`.${prefixCls.value}-holder`) ||
        null
      );
    };

    const getHorizontalScrollEl = (): HTMLElement | null => {
      if (hScrollRef.value) return hScrollRef.value;
      if (isVirtualMode.value) return getVirtualHolderEl();
      return rootRef.value || null;
    };

    const scrollNonVirtualToPosition = (
      targetIndex: number,
      align: ScrollAlign = 'auto',
      offset = 0,
      targetEl?: HTMLElement | null,
    ) => {
      const container = rootRef.value;
      if (!container) return;
      const estimatedHeight = computedItemHeight.value;
      const itemTop =
        targetEl && targetEl.offsetHeight > 0 ? targetEl.offsetTop : targetIndex * estimatedHeight;
      const itemHeight =
        targetEl && targetEl.offsetHeight > 0 ? targetEl.offsetHeight : estimatedHeight;
      const itemBottom = itemTop + itemHeight;
      const viewHeight = container.clientHeight || props.height || 0;
      const scrollTop = container.scrollTop;

      let nextTop: number | null = null;
      if (align === 'top') {
        nextTop = itemTop - offset;
      } else if (align === 'bottom') {
        nextTop = itemBottom - viewHeight + offset;
      } else {
        if (itemTop < scrollTop) {
          nextTop = itemTop - offset;
        } else if (viewHeight > 0 && itemBottom > scrollTop + viewHeight) {
          nextTop = itemBottom - viewHeight + offset;
        } else if (viewHeight === 0) {
          nextTop = itemTop - offset;
        }
      }
      if (nextTop !== null) {
        const clamped = Math.max(0, nextTop);
        container.scrollTop = clamped;
        currentScrollTop.value = clamped;
      }
    };

    const scrollTo = (config?: ListyScrollToConfig) => {
      if (config === undefined || config === null) {
        listRef.value?.scrollTo?.(config as any);
        return;
      }

      // 1. Numeric pixel scrollTop (aligned with antd 6.7.2)
      if (typeof config === 'number') {
        const top = Math.max(0, config);
        currentScrollTop.value = top;
        if (isVirtualMode.value) {
          listRef.value?.scrollTo?.(top);
        } else if (rootRef.value) {
          rootRef.value.scrollTop = top;
        }
        return;
      }

      // 2. Absolute pixel { top?, left? }
      if ('top' in config || 'left' in config) {
        if (config.top !== undefined) {
          const top = Math.max(0, config.top);
          currentScrollTop.value = top;
          if (isVirtualMode.value) {
            listRef.value?.scrollTo?.(top);
          } else if (rootRef.value) {
            rootRef.value.scrollTop = top;
          }
        }
        if (config.left !== undefined) {
          const hEl = getHorizontalScrollEl();
          if (hEl) {
            hEl.scrollLeft = Math.max(0, config.left);
          }
        }
        return;
      }

      // 3. { groupKey, align?, offset? }
      if ('groupKey' in config) {
        const rowIndex = flatRows.value.findIndex(
          row => row.__listyType === 'group' && row.groupKey === config.groupKey,
        );
        if (rowIndex === -1) return;
        if (isVirtualMode.value) {
          listRef.value?.scrollTo?.({
            index: rowIndex,
            align: config.align,
            offset: config.offset,
          });
        } else {
          const el = rootRef.value?.querySelector?.(
            `.${prefixCls.value}-group-header[data-group-key="${String(config.groupKey)}"]`,
          ) as HTMLElement | null;
          scrollNonVirtualToPosition(rowIndex, config.align ?? 'top', config.offset ?? 0, el);
        }
        return;
      }

      // 4. { key, align?, offset? }
      if ('key' in config) {
        const rowIndex = flatRows.value.findIndex(
          row => row.__listyType === 'item' && row.__listyKey === config.key,
        );
        if (rowIndex === -1) return;
        if (isVirtualMode.value) {
          listRef.value?.scrollTo?.({
            index: rowIndex,
            align: config.align,
            offset: config.offset,
          });
        } else {
          const el = rootRef.value?.querySelector?.(
            `.${prefixCls.value}-item[data-item-key="${String(config.key)}"]`,
          ) as HTMLElement | null;
          scrollNonVirtualToPosition(rowIndex, config.align ?? 'auto', config.offset ?? 0, el);
        }
        return;
      }

      // 5. { index, align?, offset? }
      if ('index' in config) {
        const rowIndex = props.group
          ? flatRows.value.findIndex(
              row => row.__listyType === 'item' && row.originIndex === config.index,
            )
          : config.index;
        if (rowIndex < 0 || rowIndex >= flatRows.value.length) return;
        if (isVirtualMode.value) {
          listRef.value?.scrollTo?.({
            index: rowIndex,
            align: config.align,
            offset: config.offset,
          });
        } else {
          const itemEls = rootRef.value?.querySelectorAll?.(`.${prefixCls.value}-item`);
          const el = (itemEls?.[config.index] as HTMLElement | undefined) || null;
          scrollNonVirtualToPosition(rowIndex, config.align ?? 'auto', config.offset ?? 0, el);
        }
      }
    };

    const scrollToIndex = (index: number) => {
      scrollTo({ index });
    };

    expose({
      nativeElement: rootRef,
      scrollTo,
      scrollToIndex,
    } as unknown as ListyRef);

    const handleScroll = (e: UIEvent) => {
      const target = e.currentTarget as HTMLElement | null;
      if (target) {
        currentScrollTop.value = target.scrollTop;
      }
      props.onScroll?.(e);
    };

    const activeVirtualStickyGroup = computed(() => {
      if (!isVirtualMode.value || !props.sticky || !props.group || flatRows.value.length === 0) {
        return null;
      }
      const rows = flatRows.value;
      const estimatedRowIndex = Math.min(
        rows.length - 1,
        Math.max(0, Math.floor(currentScrollTop.value / Math.max(1, computedItemHeight.value))),
      );
      for (let i = estimatedRowIndex; i >= 0; i -= 1) {
        const row = rows[i];
        if (row.__listyType === 'group') {
          return row;
        }
      }
      const firstGroup = rows.find(r => r.__listyType === 'group');
      return firstGroup && firstGroup.__listyType === 'group' ? firstGroup : null;
    });

    const renderItemRow = (item: any, originIndex: number, itemKey: Key) => (
      <div
        key={itemKey}
        data-item-key={String(itemKey)}
        class={classNames(`${prefixCls.value}-item`, mergedSemanticClassNames.value.item)}
        style={mergedSemanticStyles.value.item}
      >
        {renderItem(item, originIndex)}
      </div>
    );

    const renderGroupHeaderNode = (
      groupKey: Key,
      items: any[],
      extraClass?: string,
      key?: string,
    ) => (
      <div
        key={key}
        data-group-key={String(groupKey)}
        class={classNames(
          `${prefixCls.value}-group-header`,
          extraClass,
          mergedSemanticClassNames.value.groupHeader,
        )}
        style={mergedSemanticStyles.value.groupHeader}
      >
        {renderGroupTitle(groupKey, items)}
      </div>
    );

    return () => {
      const ctxCfg = listyContextConfig.value;
      const rootClass = classNames(
        prefixCls.value,
        ctxCfg.className,
        mergedSemanticClassNames.value.root,
        props.rootClassName,
        {
          [`${prefixCls.value}-hoverable`]: props.rowHoverable,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class as any,
        hashId.value,
      );

      const baseRootStyle: CSSProperties = {
        ...(ctxCfg.style as CSSProperties),
        ...(mergedSemanticStyles.value.root as CSSProperties),
        ...(attrs.style as CSSProperties),
      };

      const { class: _cls, style: _st, ...restAttrs } = attrs as Record<string, any>;

      // ============================ Virtual Mode ============================
      if (isVirtualMode.value && props.height) {
        const rows = flatRows.value;
        const virtualListNode = (
          <VirtualList
            ref={listRef}
            prefixCls={prefixCls.value}
            data={rows}
            height={props.height}
            itemHeight={computedItemHeight.value}
            itemKey="__listyKey"
            onScroll={handleScroll}
            v-slots={{
              default: (row: FlatRow) =>
                row.__listyType === 'group'
                  ? renderGroupHeaderNode(row.groupKey, row.items, undefined, row.__listyKey)
                  : renderItemRow(row.item, row.originIndex, row.__listyKey),
            }}
          />
        );

        const stickyGroup = activeVirtualStickyGroup.value;

        const contentNode = props.scrollWidth ? (
          <div
            ref={hScrollRef}
            class={`${prefixCls.value}-horizontal-scroll`}
            style={{ overflowX: 'auto' }}
          >
            <div style={{ width: `${props.scrollWidth}px`, minWidth: '100%' }}>
              {virtualListNode}
            </div>
          </div>
        ) : (
          virtualListNode
        );

        return wrapSSR(
          <div ref={rootRef} {...restAttrs} class={rootClass} style={baseRootStyle}>
            {contentNode}
            {stickyGroup && (
              <div class={`${prefixCls.value}-group-header-holder`}>
                {renderGroupHeaderNode(
                  stickyGroup.groupKey,
                  stickyGroup.items,
                  `${prefixCls.value}-group-header-fixed`,
                )}
              </div>
            )}
          </div>,
        );
      }

      // ========================== Non-Virtual Mode ==========================
      const scrollContainerStyle: CSSProperties = {
        ...baseRootStyle,
        ...(props.height !== undefined
          ? {
              height: `${props.height}px`,
              overflowY: 'auto',
            }
          : {}),
        ...(props.scrollWidth !== undefined
          ? {
              overflowX: 'auto',
            }
          : {}),
      };

      let listContent: any;
      if (props.group) {
        listContent = groupBuckets.value.map(bucket => (
          <div
            key={`group-${String(bucket.groupKey)}`}
            data-group-key={String(bucket.groupKey)}
            class={classNames(
              `${prefixCls.value}-group-section`,
              mergedSemanticClassNames.value.groupSection,
            )}
            style={mergedSemanticStyles.value.groupSection}
          >
            {renderGroupHeaderNode(
              bucket.groupKey,
              bucket.entries.map(e => e.item),
              props.sticky ? `${prefixCls.value}-group-header-sticky` : undefined,
            )}
            {bucket.entries.map(entry => renderItemRow(entry.item, entry.originIndex, entry.key))}
          </div>
        ));
      } else {
        listContent = mergedItems.value.map((item, index) =>
          renderItemRow(item, index, keyFn.value(item, index)),
        );
      }

      if (props.scrollWidth !== undefined) {
        listContent = (
          <div style={{ width: `${props.scrollWidth}px`, minWidth: '100%' }}>{listContent}</div>
        );
      }

      return wrapSSR(
        <div
          ref={rootRef}
          {...restAttrs}
          class={rootClass}
          style={scrollContainerStyle}
          onScroll={handleScroll}
        >
          {listContent}
        </div>,
      );
    };
  },
});

export default withInstall(Listy);
