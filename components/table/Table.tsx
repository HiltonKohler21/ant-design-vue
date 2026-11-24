import RcTable from '../vc-table';
import type { TableProps as RcTableProps } from '../vc-table/Table';
import { INTERNAL_HOOKS } from '../vc-table/Table';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import type {
  PaginationProps,
  PaginationSemanticClassNames,
  PaginationSemanticStyles,
} from '../pagination';
import Pagination from '../pagination';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useLazyKVMap from './hooks/useLazyKVMap';
import useFilledColumns from './hooks/useFilledColumns';
import type { Breakpoint } from '../_util/responsiveObserve';
import type {
  TableRowSelection,
  GetRowKey,
  ColumnType,
  ColumnsType,
  TableCurrentDataSource,
  SorterResult,
  GetPopupContainer,
  ExpandType,
  TablePaginationConfig,
  SortOrder,
  TableLocale,
  TableAction,
  FilterValue,
  ExpandableConfig,
  FixedType,
  Key,
  SorterTooltipProps,
  TableClassNamesType,
  TableStylesType,
  TableSemanticClassNames,
  TableSemanticStyles,
  TableResolvedSemanticClassNames,
  TableResolvedSemanticStyles,
  TableRef,
} from './interface';
import useSelection, { SELECTION_COLUMN } from './hooks/useSelection';
import type { SortState } from './hooks/useSorter';
import useSorter, { getSortData } from './hooks/useSorter';
import type { FilterState } from './hooks/useFilter';
import useFilter, { getFilterData } from './hooks/useFilter';
import useTitleColumns from './hooks/useTitleColumns';
import renderExpandIcon from './ExpandIcon';
import scrollTo from '../_util/scrollTo';
import defaultLocale from '../locale/en_US';
import type { SizeType } from '../config-provider';
import devWarning from '../vc-util/devWarning';
import type { CSSProperties } from 'vue';
import {
  nextTick,
  reactive,
  ref,
  computed,
  defineComponent,
  toRaw,
  toRef,
  watchEffect,
  watch,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue';
import type {
  DefaultRecordType,
  RenderExpandIconProps,
  FixedType as RcFixedType,
} from '../vc-table/interface';
import { EXPAND_COLUMN } from '../vc-table';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import {
  mergeClassNames,
  mergeStyles,
  resolveSemantic,
  useMergeSemantic,
} from '../_util/hooks/useMergeSemantic';
import { useProvideSlots, useProvideTableContext } from './context';
import type { ContextSlots } from './context';
import useColumns from './hooks/useColumns';
import { convertChildrenToColumns } from './util';

import {
  stringType,
  booleanType,
  arrayType,
  someType,
  functionType,
  objectType,
} from '../_util/type';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';
import VirtualList from '../vc-virtual-list';
import { useToken } from '../theme/internal';

export type { ColumnsType, TablePaginationConfig, TableRef };

const EMPTY_LIST: any[] = [];

const COMPONENT_SEMANTIC_SUBKEYS = new Set(['wrapper', 'row', 'cell']);
const PAGINATION_SEMANTIC_SUBKEYS = new Set(['root', 'item']);

const UNITLESS_CSS_PROPS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
  'orphans',
  'widows',
  'scale',
]);

interface AppliedSemanticState {
  classes: string[];
  styleKeys: string[];
}

const appliedSemanticMap = new WeakMap<HTMLElement, AppliedSemanticState>();

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function normalizeComponentStyleSlot(
  val: CSSProperties | Record<string, any> | undefined,
  subKeys: Set<string>,
  defaultKey: string,
): Record<string, CSSProperties> | undefined {
  if (!isPlainObject(val)) return undefined;
  const keys = Object.keys(val);
  if (!keys.length) return undefined;
  const isNested = keys.every(k => subKeys.has(k) && isPlainObject(val[k]));
  if (isNested) {
    return val as Record<string, CSSProperties>;
  }
  return { [defaultKey]: val as CSSProperties };
}

function normalizeTableSemanticClassNames(
  raw: TableSemanticClassNames | undefined,
): TableResolvedSemanticClassNames | undefined {
  if (!isPlainObject(raw)) return undefined;
  const result: TableResolvedSemanticClassNames = {};
  if (raw.root) result.root = raw.root;
  if (raw.section) result.section = raw.section;
  if (raw.title) result.title = raw.title;
  if (raw.footer) result.footer = raw.footer;
  if (raw.content) result.content = raw.content;
  if (typeof raw.header === 'string') {
    result.header = { wrapper: raw.header };
  } else if (isPlainObject(raw.header)) {
    result.header = raw.header;
  }
  if (typeof raw.body === 'string') {
    result.body = { wrapper: raw.body };
  } else if (isPlainObject(raw.body)) {
    result.body = raw.body;
  }
  if (typeof raw.pagination === 'string') {
    result.pagination = { root: raw.pagination };
  } else if (isPlainObject(raw.pagination)) {
    result.pagination = raw.pagination;
  }
  return result;
}

function normalizeTableSemanticStyles(
  raw: TableSemanticStyles | undefined,
): TableResolvedSemanticStyles | undefined {
  if (!isPlainObject(raw)) return undefined;
  const result: TableResolvedSemanticStyles = {};
  if (isPlainObject(raw.root)) result.root = raw.root;
  if (isPlainObject(raw.section)) result.section = raw.section;
  if (isPlainObject(raw.title)) result.title = raw.title;
  if (isPlainObject(raw.footer)) result.footer = raw.footer;
  if (isPlainObject(raw.content)) result.content = raw.content;
  const header = normalizeComponentStyleSlot(
    raw.header as any,
    COMPONENT_SEMANTIC_SUBKEYS,
    'wrapper',
  );
  if (header) result.header = header;
  const body = normalizeComponentStyleSlot(raw.body as any, COMPONENT_SEMANTIC_SUBKEYS, 'wrapper');
  if (body) result.body = body;
  const pagination = normalizeComponentStyleSlot(
    raw.pagination as any,
    PAGINATION_SEMANTIC_SUBKEYS,
    'root',
  );
  if (pagination) result.pagination = pagination;
  return result;
}

function applySemanticToElement(
  el: HTMLElement | null | undefined,
  cls: string | undefined,
  styleObj: CSSProperties | undefined,
) {
  if (!el) return;
  const prev = appliedSemanticMap.get(el) || { classes: [], styleKeys: [] };
  const nextClasses = (cls || '').split(/\s+/).filter(Boolean);
  const nextStyleKeys = styleObj ? Object.keys(styleObj) : [];

  if (
    !prev.classes.length &&
    !prev.styleKeys.length &&
    !nextClasses.length &&
    !nextStyleKeys.length
  ) {
    return;
  }

  prev.classes.forEach(c => {
    if (!nextClasses.includes(c)) {
      el.classList.remove(c);
    }
  });
  nextClasses.forEach(c => {
    if (!el.classList.contains(c)) {
      el.classList.add(c);
    }
  });

  prev.styleKeys.forEach(key => {
    if (!nextStyleKeys.includes(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  });

  if (styleObj) {
    nextStyleKeys.forEach(key => {
      const val = (styleObj as any)[key];
      if (val === undefined || val === null) {
        if (key.startsWith('--')) {
          el.style.removeProperty(key);
        } else {
          (el.style as any)[key] = '';
        }
      } else if (key.startsWith('--')) {
        el.style.setProperty(key, String(val));
      } else if (typeof val === 'number' && !UNITLESS_CSS_PROPS.has(key)) {
        (el.style as any)[key] = `${val}px`;
      } else {
        (el.style as any)[key] = val;
      }
    });
  }

  appliedSemanticMap.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
}

function getDirectChildren(parent: Element | null | undefined): HTMLElement[] {
  if (!parent || !parent.children) return [];
  return Array.from(parent.children) as HTMLElement[];
}

function findDirectChildByClass(
  parent: Element | null | undefined,
  cls: string,
): HTMLElement | null {
  const children = getDirectChildren(parent);
  for (const child of children) {
    if (child.classList?.contains(cls)) {
      return child;
    }
  }
  return null;
}

function findDirectChildByTag(parent: Element | null | undefined, tag: string): HTMLElement | null {
  const target = tag.toUpperCase();
  const children = getDirectChildren(parent);
  for (const child of children) {
    if (child.tagName === target) {
      return child;
    }
  }
  return null;
}

function normalizeFixedValue(fixed: FixedType | undefined): RcFixedType | undefined {
  if (fixed === 'start') return 'left';
  if (fixed === 'end') return 'right';
  return fixed;
}

function normalizeColumnsFixed<RecordType>(
  columns: ColumnsType<RecordType>,
): ColumnsType<RecordType> {
  return (columns || []).map(col => {
    const rawCol = toRaw(col);
    if (!col || rawCol === SELECTION_COLUMN || rawCol === EXPAND_COLUMN) {
      return rawCol;
    }
    const nextFixed = normalizeFixedValue(col.fixed);
    const hasChildren = 'children' in col && Array.isArray((col as any).children);
    if (nextFixed === col.fixed && !hasChildren) {
      return col;
    }
    const nextCol: any = { ...col };
    if (nextFixed !== col.fixed) {
      nextCol.fixed = nextFixed;
    }
    if (hasChildren) {
      nextCol.children = normalizeColumnsFixed((col as any).children);
    }
    return nextCol;
  });
}

function isColumnHidden(col: any): boolean {
  return col?.hidden === true || col?.hidden === '';
}

function filterHiddenColumns<RecordType>(
  columns: ColumnsType<RecordType>,
): ColumnsType<RecordType> {
  return (columns || []).reduce<ColumnsType<RecordType>>((acc, col) => {
    if (!col) return acc;
    if (isColumnHidden(col)) {
      return acc;
    }
    if (
      'children' in col &&
      Array.isArray((col as any).children) &&
      (col as any).children.length > 0
    ) {
      const visibleChildren = filterHiddenColumns((col as any).children);
      if (visibleChildren.length > 0) {
        acc.push({
          ...col,
          children: visibleChildren,
        });
      }
      return acc;
    }
    acc.push(col);
    return acc;
  }, []);
}

function flattenLeafColumns(cols: ColumnsType<any>): ColumnType<any>[] {
  const result: ColumnType<any>[] = [];
  (cols || []).forEach(col => {
    if (col && 'children' in col && Array.isArray((col as any).children)) {
      result.push(...flattenLeafColumns((col as any).children));
    } else if (col) {
      result.push(col as ColumnType<any>);
    }
  });
  return result;
}

function getVirtualCellValue(record: any, dataIndex: any) {
  if (dataIndex === undefined || dataIndex === null) return undefined;
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce((acc, key) => (acc != null ? acc[key] : undefined), record);
  }
  return record?.[dataIndex];
}

function normalizePaginationPlacement(
  pos: string,
  isPlacement: boolean,
): 'start' | 'end' | 'center' | string {
  const lower = pos.toLowerCase();
  if (lower.includes('center')) {
    return 'center';
  }
  if (isPlacement) {
    return lower.includes('start') || lower.includes('left') ? 'start' : 'end';
  }
  return lower.replace(/^top|^bottom/, '');
}

interface ChangeEventInfo<RecordType = DefaultRecordType> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: Function;
}

export interface TableProps<RecordType = DefaultRecordType>
  extends Omit<
    RcTableProps<RecordType>,
    | 'transformColumns'
    | 'internalHooks'
    | 'internalRefs'
    | 'data'
    | 'columns'
    | 'scroll'
    | 'emptyText'
    | 'canExpandable'
    | 'onUpdateInternalRefs'
    | 'expandFixed'
    | 'expandColumnWidth'
    | 'expandedRowClassName'
    | 'components'
  > {
  classNames?: TableClassNamesType<TableProps<RecordType>>;
  styles?: TableStylesType<TableProps<RecordType>>;
  dropdownPrefixCls?: string;
  dataSource?: RcTableProps<RecordType>['data'];
  column?: Partial<ColumnType<RecordType>>;
  columns?: ColumnsType<RecordType>;
  components?: RcTableProps<RecordType>['components'] & {
    ExpandIcon?: any;
  };
  expandable?: ExpandableConfig<RecordType>;
  expandFixed?: FixedType;
  expandColumnWidth?: number | string;
  expandedRowClassName?: string | RcTableProps<RecordType>['expandedRowClassName'];
  expandColumnTitle?: any;
  showExpandAll?: boolean;
  onExpandAll?: (expanded: boolean) => void;
  pagination?: false | TablePaginationConfig;
  loading?: boolean | SpinProps;
  size?: SizeType | 'medium';
  bordered?: boolean;
  locale?: TableLocale;
  rootClassName?: string;
  virtual?: boolean;
  rowHoverable?: boolean;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  onResizeColumn?: (w: number, col: ColumnType) => void;
  onScroll?: (e: UIEvent) => void;
  rowSelection?: TableRowSelection<RecordType>;

  getPopupContainer?: GetPopupContainer;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | SorterTooltipProps;
}

export const tableProps = () => {
  return {
    prefixCls: stringType<string>(),
    rootClassName: String,
    classNames: someType<TableClassNamesType>([Object, Function]),
    styles: someType<TableStylesType>([Object, Function]),
    /** 虚拟滚动 */
    virtual: { type: Boolean, default: undefined },
    column: objectType<Partial<ColumnType>>(),
    columns: arrayType<ColumnsType>(),
    rowKey: someType<TableProps['rowKey']>([String, Function]),
    tableLayout: stringType<TableProps['tableLayout']>(),
    rowClassName: someType<TableProps['rowClassName']>([String, Function]),
    rowHoverable: booleanType(true),
    title: functionType<TableProps['title']>(),
    footer: functionType<TableProps['footer']>(),
    id: stringType<TableProps['id']>(),
    showHeader: booleanType(),
    components: objectType<TableProps['components']>(),
    customRow: functionType<TableProps['customRow']>(),
    customHeaderRow: functionType<TableProps['customHeaderRow']>(),
    direction: stringType<TableProps['direction']>(),
    expandable: objectType<ExpandableConfig>(),
    expandFixed: someType<FixedType>([Boolean, String]),
    expandColumnWidth: someType<number | string>([Number, String]),
    expandColumnTitle: someType<any>([String, Object, Function]),
    expandedRowKeys: arrayType<TableProps['expandedRowKeys']>(),
    defaultExpandedRowKeys: arrayType<TableProps['defaultExpandedRowKeys']>(),
    expandedRowRender: functionType<TableProps['expandedRowRender']>(),
    expandRowByClick: booleanType(),
    expandIcon: functionType<TableProps['expandIcon']>(),
    onExpand: functionType<TableProps['onExpand']>(),
    onExpandedRowsChange: functionType<TableProps['onExpandedRowsChange']>(),
    'onUpdate:expandedRowKeys': functionType<TableProps['onExpandedRowsChange']>(),
    defaultExpandAllRows: booleanType(),
    showExpandAll: booleanType(),
    onExpandAll: functionType<(expanded: boolean) => void>(),
    indentSize: Number,
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
    expandIconColumnIndex: Number,
    showExpandColumn: booleanType(),
    expandedRowClassName: someType<TableProps['expandedRowClassName']>([String, Function]),
    childrenColumnName: stringType<TableProps['childrenColumnName']>(),
    rowExpandable: functionType<TableProps['rowExpandable']>(),
    sticky: someType<TableProps['sticky']>([Boolean, Object]),

    dropdownPrefixCls: String,
    dataSource: arrayType<RcTableProps['data']>(),
    pagination: someType<false | TablePaginationConfig>([Boolean, Object]),
    loading: someType<boolean | SpinProps>([Boolean, Object]),
    size: stringType<SizeType | 'medium'>(),
    bordered: booleanType(),
    locale: objectType<TableLocale>(),

    onChange:
      functionType<
        (
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult | SorterResult[],
          extra: TableCurrentDataSource,
        ) => void
      >(),
    onResizeColumn: functionType<(w: number, col: ColumnType) => void>(),
    onScroll: functionType<(e: UIEvent) => void>(),
    rowSelection: objectType<TableRowSelection>(),
    getPopupContainer: functionType<GetPopupContainer>(),
    scroll: objectType<
      RcTableProps['scroll'] & {
        scrollToFirstRowOnChange?: boolean;
      }
    >(),
    sortDirections: arrayType<SortOrder[]>(),
    showSorterTooltip: someType<boolean | SorterTooltipProps>([Boolean, Object], true),
    transformCellText: functionType<TableProps['transformCellText']>(),
  };
};

const InternalTable = defineComponent({
  name: 'InternalTable',
  inheritAttrs: false,
  props: {
    ...tableProps(),
    contextSlots: objectType<ContextSlots>(),
  },
  setup(props, { attrs, slots, expose, emit }) {
    const rootRef = ref<HTMLDivElement>();
    const virtualListRef = ref<any>();

    const {
      size: configSize,
      renderEmpty,
      direction,
      prefixCls,
      configProvider,
    } = useConfigInject('table', props as any);

    const tableConfig = computed(() => configProvider.table?.value || {});
    const mergedSize = computed(() => props.size ?? configSize.value);
    const isMediumSize = computed(
      () => mergedSize.value === 'middle' || mergedSize.value === 'medium',
    );

    const mergedRowKeyProp = computed(() => props.rowKey ?? tableConfig.value.rowKey ?? 'key');
    devWarning(
      !(typeof mergedRowKeyProp.value === 'function' && mergedRowKeyProp.value.length > 1),
      'Table',
      '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
    );

    const mergedScroll = computed(() => props.scroll ?? tableConfig.value.scroll);

    // =========== Semantic classNames & styles ===========
    const mergedPropsForSemantic = computed<TableProps>(() => ({
      ...props,
      size: mergedSize.value,
      bordered: props.bordered,
      scroll: mergedScroll.value,
    }));

    const normalizeClassNamesSource = (source: any) => {
      if (typeof source === 'function') {
        return (info: { props: TableProps }) => normalizeTableSemanticClassNames(source(info));
      }
      return normalizeTableSemanticClassNames(source);
    };

    const normalizeStylesSource = (source: any) => {
      if (typeof source === 'function') {
        return (info: { props: TableProps }) => normalizeTableSemanticStyles(source(info));
      }
      return normalizeTableSemanticStyles(source);
    };

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TableResolvedSemanticClassNames,
      TableResolvedSemanticStyles,
      TableProps
    >(
      () => [
        normalizeClassNamesSource(tableConfig.value.classNames),
        normalizeClassNamesSource(props.classNames),
      ],
      () => [
        normalizeStylesSource(tableConfig.value.styles),
        tableConfig.value.style ? { root: tableConfig.value.style as CSSProperties } : undefined,
        normalizeStylesSource(props.styles),
        isPlainObject(attrs.style) ? { root: attrs.style as CSSProperties } : undefined,
      ],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    const hasDomSemantics = computed(() => {
      const cn = mergedClassNames.value;
      const st = mergedStyles.value;
      return Boolean(
        cn.section ||
          cn.title ||
          cn.footer ||
          cn.content ||
          cn.header?.wrapper ||
          cn.header?.row ||
          cn.header?.cell ||
          cn.body?.wrapper ||
          cn.body?.row ||
          cn.body?.cell ||
          st.section ||
          st.title ||
          st.footer ||
          st.content ||
          st.header?.wrapper ||
          st.header?.row ||
          st.header?.cell ||
          st.body?.wrapper ||
          st.body?.row ||
          st.body?.cell,
      );
    });

    useProvideTableContext({
      onResizeColumn: (w, col) => {
        emit('resizeColumn', w, col);
      },
    });
    const screens = useBreakpoint();

    const rawColumnsRef = computed(() => props.columns || EMPTY_LIST);
    const filledColumns = useFilledColumns(rawColumnsRef, toRef(props, 'column'));

    const mergedColumns = computed(() => {
      const matched = new Set(
        Object.keys(screens.value).filter((m: Breakpoint) => screens.value[m]),
      );
      return normalizeColumnsFixed(
        filledColumns.value.filter(
          (c: ColumnType<DefaultRecordType>) =>
            !c || !c.responsive || c.responsive.some((r: Breakpoint) => matched.has(r)),
        ),
      );
    });

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, , , realToken] = useToken();

    const listItemHeight = computed(() => {
      const raw: any = realToken.value || {};
      const fontSize = raw.fontSize ?? 14;
      const lineHeight = raw.lineHeight ?? 1.5714285714285714;
      const lineWidth = raw.lineWidth ?? 1;
      const padding = raw.padding ?? 16;
      const paddingSM = raw.paddingSM ?? 12;
      const paddingXS = raw.paddingXS ?? 8;
      const fontHeight = Math.floor(fontSize * lineHeight);
      if (isMediumSize.value) {
        return paddingSM * 2 + fontHeight + lineWidth;
      }
      if (mergedSize.value === 'small') {
        return paddingXS * 2 + fontHeight + lineWidth;
      }
      return padding * 2 + fontHeight + lineWidth;
    });

    const virtualScrollY = computed(() => {
      const y = mergedScroll.value?.y;
      if (typeof y === 'number') return y;
      if (typeof y === 'string') {
        const parsed = parseInt(y, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    });

    const transformCellText = computed(
      () => props.transformCellText || configProvider.transformCellText?.value,
    );
    const [tableLocale] = useLocaleReceiver('Table', defaultLocale.Table, toRef(props, 'locale'));
    const rawData = computed(() => props.dataSource || EMPTY_LIST);

    const dropdownPrefixCls = computed(() =>
      configProvider.getPrefixCls('dropdown', props.dropdownPrefixCls),
    );

    // ========================== Expandable ==========================
    const childrenColumnName = computed(
      () => props.childrenColumnName || props.expandable?.childrenColumnName || 'children',
    );

    const mergedExpandedRowRender = computed(
      () => props.expandedRowRender || props.expandable?.expandedRowRender,
    );

    const mergedRowExpandable = computed(
      () => props.rowExpandable ?? props.expandable?.rowExpandable,
    );

    const mergedDefaultExpandAllRows = computed(
      () => props.defaultExpandAllRows ?? props.expandable?.defaultExpandAllRows,
    );

    const mergedDefaultExpandedRowKeys = computed(
      () => props.defaultExpandedRowKeys ?? props.expandable?.defaultExpandedRowKeys,
    );

    const mergedExpandedRowKeysProp = computed(
      () => props.expandedRowKeys ?? props.expandable?.expandedRowKeys,
    );

    const mergedExpandRowByClick = computed(
      () => props.expandRowByClick ?? props.expandable?.expandRowByClick,
    );

    const mergedExpandColumnWidth = computed(
      () => props.expandColumnWidth ?? props.expandable?.columnWidth,
    );

    const mergedExpandFixed = computed(() =>
      normalizeFixedValue(props.expandFixed ?? props.expandable?.fixed),
    );

    const mergedShowExpandColumn = computed(
      () => props.showExpandColumn ?? props.expandable?.showExpandColumn,
    );

    const mergedExpandIconColumnIndexProp = computed(
      () => props.expandIconColumnIndex ?? props.expandable?.expandIconColumnIndex,
    );

    const mergedExpandedRowClassName = computed(() => {
      const raw = props.expandedRowClassName ?? props.expandable?.expandedRowClassName;
      if (typeof raw === 'string') {
        return () => raw;
      }
      return raw;
    });

    const mergedShowExpandAll = computed(() =>
      Boolean(
        (props.showExpandAll ?? props.expandable?.showExpandAll) && mergedExpandedRowRender.value,
      ),
    );

    const mergedExpandColumnTitle = computed(
      () => props.expandColumnTitle ?? props.expandable?.columnTitle,
    );

    const expandType = computed<ExpandType>(() => {
      if (rawData.value.some(item => (item as any)?.[childrenColumnName.value])) {
        return 'nest';
      }

      if (mergedExpandedRowRender.value) {
        return 'row';
      }

      return null;
    });

    const internalRefs = reactive({
      body: null as HTMLElement | null,
    });

    const updateInternalRefs = refs => {
      Object.assign(internalRefs, refs);
    };

    watch(
      [() => internalRefs.body, () => props.onScroll, () => props.virtual],
      ([bodyEl, onScrollHandler, isVirtual], _prev, onCleanup) => {
        if (!bodyEl || !onScrollHandler || isVirtual) return;
        const listener = (e: Event) => {
          onScrollHandler(e as UIEvent);
        };
        bodyEl.addEventListener('scroll', listener);
        onCleanup(() => {
          bodyEl.removeEventListener('scroll', listener);
        });
      },
      { flush: 'post' },
    );

    // ============================ RowKey ============================
    const getRowKey = computed<GetRowKey<DefaultRecordType>>(() => {
      if (typeof mergedRowKeyProp.value === 'function') {
        return mergedRowKeyProp.value;
      }

      return record => (record as any)?.[mergedRowKeyProp.value as string];
    });

    const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

    // ============================ Events =============================
    const changeEventInfo: Partial<ChangeEventInfo> = {};

    const triggerOnChange = (
      info: Partial<ChangeEventInfo>,
      action: TableAction,
      reset = false,
    ) => {
      const { pagination, onChange } = props;
      const scroll = mergedScroll.value;
      const changeInfo = {
        ...changeEventInfo,
        ...info,
      };

      if (reset) {
        changeEventInfo.resetPagination!();

        // Reset event param
        if (changeInfo.pagination!.current) {
          changeInfo.pagination!.current = 1;
        }

        // Trigger pagination events
        if (pagination && pagination.onChange) {
          pagination.onChange(1, changeInfo.pagination!.pageSize);
        }
      }

      if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body) {
        scrollTo(0, {
          getContainer: () => internalRefs.body,
        });
      }

      onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
        currentDataSource: getFilterData(
          getSortData(rawData.value, changeInfo.sorterStates!, childrenColumnName.value),
          changeInfo.filterStates!,
        ),
        action,
      });
    };

    // ============================ Sorter =============================
    const onSorterChange = (sorter: SorterResult | SorterResult[], sorterStates: SortState[]) => {
      triggerOnChange(
        {
          sorter,
          sorterStates,
        },
        'sort',
        false,
      );
    };

    const [transformSorterColumns, sortStates, sorterTitleProps, sorters] = useSorter({
      prefixCls,
      mergedColumns,
      onSorterChange,
      sortDirections: computed(() => props.sortDirections || ['ascend', 'descend']),
      tableLocale,
      showSorterTooltip: toRef(props, 'showSorterTooltip'),
    });
    const sortedData = computed(() =>
      getSortData(rawData.value, sortStates.value, childrenColumnName.value),
    );

    // ============================ Filter ============================
    const onFilterChange = (filters: Record<string, FilterValue>, filterStates: FilterState[]) => {
      triggerOnChange(
        {
          filters,
          filterStates,
        },
        'filter',
        true,
      );
    };

    const [transformFilterColumns, filterStates, filters] = useFilter({
      prefixCls,
      locale: tableLocale,
      dropdownPrefixCls,
      mergedColumns,
      onFilterChange,
      getPopupContainer: toRef(props, 'getPopupContainer'),
    });
    const mergedData = computed(() => getFilterData(sortedData.value, filterStates.value));

    // ========================== Pagination ==========================
    const onPaginationChange = (current: number, pageSize: number) => {
      triggerOnChange(
        {
          pagination: { ...changeEventInfo.pagination, current, pageSize },
        },
        'paginate',
      );
    };

    const [mergedPagination, resetPagination] = usePagination(
      computed(() => mergedData.value.length),
      toRef(props, 'pagination'),
      onPaginationChange,
    );

    watchEffect(() => {
      changeEventInfo.sorter = sorters.value;
      changeEventInfo.sorterStates = sortStates.value;

      changeEventInfo.filters = filters.value;
      changeEventInfo.filterStates = filterStates.value;
      changeEventInfo.pagination =
        props.pagination === false
          ? {}
          : getPaginationParam(mergedPagination.value, props.pagination);

      changeEventInfo.resetPagination = resetPagination;
    });

    // ============================= Data =============================
    const pageData = computed(() => {
      if (props.pagination === false || !mergedPagination.value.pageSize) {
        return mergedData.value;
      }

      const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value;
      devWarning(current > 0, 'Table', '`current` should be positive number.');

      // Dynamic table data
      if (mergedData.value.length < total!) {
        if (mergedData.value.length > pageSize) {
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
        }
        return mergedData.value;
      }

      return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
    });

    watchEffect(
      () => {
        nextTick(() => {
          const { total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value;
          // Dynamic table data
          if (mergedData.value.length < total!) {
            if (mergedData.value.length > pageSize) {
              devWarning(
                false,
                'Table',
                '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
              );
            }
          }
        });
      },
      { flush: 'post' },
    );

    // ===================== ExpandAll Management =====================
    const innerExpandedKeys = ref<Key[]>([]);
    let innerExpandedInitialized = false;
    const ensureInnerExpandedInit = () => {
      if (innerExpandedInitialized) return;
      innerExpandedInitialized = true;
      if (mergedDefaultExpandedRowKeys.value) {
        innerExpandedKeys.value = [...mergedDefaultExpandedRowKeys.value];
      } else if (mergedDefaultExpandAllRows.value) {
        innerExpandedKeys.value = rawData.value
          .filter(record => !mergedRowExpandable.value || mergedRowExpandable.value(record))
          .map((record, idx) => getRowKey.value(record, idx));
      }
    };

    const currentExpandedKeys = computed<Key[]>(() => {
      if (mergedExpandedRowKeysProp.value !== undefined) {
        return [...mergedExpandedRowKeysProp.value];
      }
      if (mergedShowExpandAll.value) {
        ensureInnerExpandedInit();
      }
      return innerExpandedKeys.value;
    });

    const handleExpandedRowsChange = (keys: Key[]) => {
      if (mergedExpandedRowKeysProp.value === undefined) {
        innerExpandedKeys.value = keys;
      }
      props.onExpandedRowsChange?.(keys);
      props.expandable?.onExpandedRowsChange?.(keys);
      props['onUpdate:expandedRowKeys']?.(keys);
    };

    const handleExpand = (expanded: boolean, record: any) => {
      props.onExpand?.(expanded, record);
      props.expandable?.onExpand?.(expanded, record);
    };

    const renderExpandAllIcon = () => {
      const expandablePageKeys = pageData.value
        .filter(record => !mergedRowExpandable.value || mergedRowExpandable.value(record))
        .map((record, idx) => getRowKey.value(record, idx));
      const keySet = new Set(currentExpandedKeys.value);
      const hasExpandable = expandablePageKeys.length > 0;
      const allExpanded = hasExpandable && expandablePageKeys.every(k => keySet.has(k));

      const onToggleExpandAll = (e: MouseEvent) => {
        e?.stopPropagation?.();
        const nextSet = new Set(currentExpandedKeys.value);
        if (allExpanded) {
          expandablePageKeys.forEach(k => nextSet.delete(k));
        } else {
          expandablePageKeys.forEach(k => nextSet.add(k));
        }
        const nextKeys = Array.from(nextSet);
        handleExpandedRowsChange(nextKeys);
        props.onExpandAll?.(!allExpanded);
        props.expandable?.onExpandAll?.(!allExpanded);
      };

      const CustomExpandIcon = (props.components as any)?.ExpandIcon;
      if (CustomExpandIcon) {
        return (
          <CustomExpandIcon
            prefixCls={prefixCls.value}
            type="all"
            expanded={allExpanded}
            expandable={hasExpandable}
            onClick={onToggleExpandAll}
          />
        );
      }

      const iconPrefix = `${prefixCls.value}-row-expand-icon`;
      if (!hasExpandable) {
        return <span class={classNames(iconPrefix, `${iconPrefix}-spaced`)} />;
      }

      return (
        <button
          type="button"
          onClick={onToggleExpandAll}
          class={classNames(iconPrefix, {
            [`${iconPrefix}-expanded`]: allExpanded,
            [`${iconPrefix}-collapsed`]: !allExpanded,
          })}
          aria-label={
            allExpanded
              ? tableLocale.value.collapseAll || 'Collapse all rows'
              : tableLocale.value.expandAll || 'Expand all rows'
          }
          aria-expanded={allExpanded}
        />
      );
    };

    const mergedContextSlots = computed<ContextSlots>(() => {
      const baseSlots: ContextSlots = { ...(props.contextSlots || {}) };
      const titleConfig = mergedExpandColumnTitle.value;
      const needExpandAll = mergedShowExpandAll.value;

      if (needExpandAll || titleConfig !== undefined) {
        const originSlot = baseSlots.expandColumnTitle;
        const toVNodeArray = (node: any) =>
          Array.isArray(node) ? node : node !== undefined && node !== null ? [node] : [];
        baseSlots.expandColumnTitle = () => {
          const expandAllNode = needExpandAll ? renderExpandAllIcon() : null;
          if (typeof titleConfig === 'function') {
            return toVNodeArray(titleConfig({ expandIcon: expandAllNode }));
          }
          if (titleConfig !== undefined) {
            return toVNodeArray(titleConfig);
          }
          if (originSlot) {
            return toVNodeArray(originSlot({ expandIcon: expandAllNode }));
          }
          return toVNodeArray(expandAllNode);
        };
      }
      return baseSlots;
    });

    useProvideSlots(mergedContextSlots);

    // ============================ Column ============================
    const [transformBasicColumns] = useColumns(mergedContextSlots);

    const columnTitleProps = computed(() => {
      const mergedFilters: Record<string, FilterValue> = {};
      const filtersValue = filters.value;
      Object.keys(filtersValue).forEach(filterKey => {
        if (filtersValue[filterKey] !== null) {
          mergedFilters[filterKey] = filtersValue[filterKey]!;
        }
      });
      return {
        ...sorterTitleProps.value,
        filters: mergedFilters,
      };
    });
    const [transformTitleColumns] = useTitleColumns(columnTitleProps);

    const expandIconColumnIndex = computed(() => {
      if (mergedShowExpandColumn.value === false) return -1;
      // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
      if (expandType.value === 'nest' && mergedExpandIconColumnIndexProp.value === undefined) {
        return props.rowSelection ? 1 : 0;
      } else if (mergedExpandIconColumnIndexProp.value! > 0 && props.rowSelection) {
        return mergedExpandIconColumnIndexProp.value! - 1;
      }
      return mergedExpandIconColumnIndexProp.value;
    });

    const rowSelection = ref();
    watch(
      () => props.rowSelection,
      () => {
        rowSelection.value = props.rowSelection ? { ...props.rowSelection } : props.rowSelection;
      },
      { deep: true, immediate: true },
    );
    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = useSelection(rowSelection, {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: computed(() => props.getPopupContainer),
    });

    const internalRowClassName = (record: any, index: number, indent: number) => {
      let mergedRowClassName;
      const { rowClassName } = props;
      if (typeof rowClassName === 'function') {
        mergedRowClassName = classNames(rowClassName(record, index, indent));
      } else {
        mergedRowClassName = classNames(rowClassName);
      }

      return classNames(
        {
          [`${prefixCls.value}-row-selected`]: selectedKeySet.value.has(
            getRowKey.value(record, index),
          ),
        },
        mergedRowClassName,
      );
    };

    const scrollToRow: TableRef['scrollTo'] = config => {
      if (!config) return;
      if (props.virtual && virtualListRef.value?.scrollTo) {
        if (typeof config.top === 'number') {
          virtualListRef.value.scrollTo(config.top);
          return;
        }
        if (config.key !== undefined || typeof config.index === 'number') {
          const alignMap: Record<string, 'top' | 'bottom' | 'auto'> = {
            start: 'top',
            end: 'bottom',
            center: 'auto',
            nearest: 'auto',
          };
          virtualListRef.value.scrollTo({
            ...(config.key !== undefined ? { key: config.key } : { index: config.index! }),
            align: alignMap[config.align || 'nearest'] || 'auto',
            offset: config.offset,
          });
          return;
        }
      }
      const bodyEl =
        internalRefs.body ||
        rootRef.value?.querySelector<HTMLElement>(`.${prefixCls.value}-body`) ||
        rootRef.value?.querySelector<HTMLElement>(`.${prefixCls.value}-content`);
      if (!bodyEl) return;
      if (typeof config.top === 'number') {
        if (typeof bodyEl.scrollTo === 'function') {
          bodyEl.scrollTo({ top: config.top });
        } else {
          bodyEl.scrollTop = config.top;
        }
        return;
      }
      let targetEl: HTMLElement | null = null;
      if (config.key !== undefined) {
        targetEl = bodyEl.querySelector<HTMLElement>(`[data-row-key="${config.key}"]`);
      } else if (typeof config.index === 'number') {
        const rows = bodyEl.querySelectorAll<HTMLElement>(`.${prefixCls.value}-row`);
        targetEl = rows[config.index] || null;
      }
      if (targetEl) {
        if (typeof config.offset === 'number') {
          const top = targetEl.offsetTop + config.offset;
          if (typeof bodyEl.scrollTo === 'function') {
            bodyEl.scrollTo({ top });
          } else {
            bodyEl.scrollTop = top;
          }
        } else if (typeof targetEl.scrollIntoView === 'function') {
          targetEl.scrollIntoView({ block: config.align || 'nearest' });
        }
      }
    };

    expose({
      selectedKeySet,
      nativeElement: rootRef,
      scrollTo: scrollToRow,
    });

    const indentSize = computed(() => {
      const rawIndent = props.indentSize ?? props.expandable?.indentSize;
      return typeof rawIndent === 'number' ? rawIndent : 15;
    });

    const transformColumns = (innerColumns: ColumnsType<any>): ColumnsType<any> => {
      const res = transformTitleColumns(
        transformSelectionColumns(
          transformFilterColumns(transformSorterColumns(transformBasicColumns(innerColumns))),
        ),
      );
      return filterHiddenColumns(res);
    };

    // ==================== Scoped Semantic DOM Sync ====================
    let isSyncingSemantics = false;
    let observer: MutationObserver | null = null;
    let hadDomSemantics = false;

    const syncTableSemantics = () => {
      if (isSyncingSemantics) return;
      const active = hasDomSemantics.value;
      if (!active && !hadDomSemantics) {
        return;
      }
      const rootEl = rootRef.value;
      if (!rootEl) return;

      isSyncingSemantics = true;
      hadDomSemantics = active;
      try {
        const pre = prefixCls.value;
        const cn = mergedClassNames.value;
        const st = mergedStyles.value;

        // Direct path: .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table
        const spinNested = findDirectChildByClass(
          rootEl,
          `${configProvider.getPrefixCls('spin')}-nested-loading`,
        );
        const spinContainer = findDirectChildByClass(
          spinNested,
          `${configProvider.getPrefixCls('spin')}-container`,
        );
        const tableEl = findDirectChildByClass(spinContainer || rootEl, pre);
        if (!tableEl) return;

        // title, footer, section (.ant-table-container)
        applySemanticToElement(findDirectChildByClass(tableEl, `${pre}-title`), cn.title, st.title);
        applySemanticToElement(
          findDirectChildByClass(tableEl, `${pre}-footer`),
          cn.footer,
          st.footer,
        );

        const containerEl = findDirectChildByClass(tableEl, `${pre}-container`);
        applySemanticToElement(containerEl, cn.section, st.section);
        if (!containerEl) return;

        const applyHeaderTable = (tbl: HTMLElement | null) => {
          if (!tbl) return;
          const theadEl = findDirectChildByTag(tbl, 'thead');
          if (!theadEl) return;
          applySemanticToElement(theadEl, cn.header?.wrapper, st.header?.wrapper);
          const headerRows = getDirectChildren(theadEl).filter(el => el.tagName === 'TR');
          headerRows.forEach(tr => {
            applySemanticToElement(tr, cn.header?.row, st.header?.row);
            const cells = getDirectChildren(tr).filter(
              el => el.tagName === 'TH' || el.tagName === 'TD',
            );
            cells.forEach(cell => {
              if (cell.classList.contains(`${pre}-cell`)) {
                applySemanticToElement(cell, cn.header?.cell, st.header?.cell);
              }
            });
          });
        };

        const applyBodyTable = (tbl: HTMLElement | null) => {
          if (!tbl) return;
          const tbodyEl = findDirectChildByTag(tbl, 'tbody');
          if (!tbodyEl) return;
          applySemanticToElement(tbodyEl, cn.body?.wrapper, st.body?.wrapper);
          const bodyRows = getDirectChildren(tbodyEl).filter(
            el => el.tagName === 'TR' && el.classList.contains(`${pre}-row`),
          );
          bodyRows.forEach(tr => {
            applySemanticToElement(tr, cn.body?.row, st.body?.row);
            const cells = getDirectChildren(tr).filter(
              el => el.tagName === 'TD' || el.tagName === 'TH',
            );
            cells.forEach(cell => {
              if (cell.classList.contains(`${pre}-cell`)) {
                applySemanticToElement(cell, cn.body?.cell, st.body?.cell);
              }
            });
          });
        };

        // Unique table mode (.ant-table-content)
        const contentEl = findDirectChildByClass(containerEl, `${pre}-content`);
        if (contentEl) {
          applySemanticToElement(contentEl, cn.content, st.content);
          const innerTable = findDirectChildByTag(contentEl, 'table');
          applyHeaderTable(innerTable);
          applyBodyTable(innerTable);
        }

        // Fixed header / sticky mode (.ant-table-header & .ant-table-body)
        const headerHolderEl = findDirectChildByClass(containerEl, `${pre}-header`);
        if (headerHolderEl) {
          applyHeaderTable(findDirectChildByTag(headerHolderEl, 'table'));
        }
        const bodyHolderEl = findDirectChildByClass(containerEl, `${pre}-body`);
        if (bodyHolderEl) {
          applyBodyTable(findDirectChildByTag(bodyHolderEl, 'table'));
        }
      } finally {
        observer?.takeRecords();
        isSyncingSemantics = false;
      }
    };

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (!hasDomSemantics.value) return;
      const rootEl = rootRef.value;
      if (rootEl && typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
          if (!isSyncingSemantics && hasDomSemantics.value) {
            syncTableSemantics();
          }
        });
        observer.observe(rootEl, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
        });
      }
    };

    onMounted(() => {
      syncTableSemantics();
      setupObserver();
    });

    onUpdated(() => {
      syncTableSemantics();
      if (hasDomSemantics.value && !observer) {
        setupObserver();
      } else if (!hasDomSemantics.value && observer) {
        observer.disconnect();
        observer = null;
      }
    });

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });

    watch(
      [mergedClassNames, mergedStyles, hasDomSemantics],
      () => {
        syncTableSemantics();
        if (hasDomSemantics.value && !observer) {
          setupObserver();
        } else if (!hasDomSemantics.value && observer) {
          observer.disconnect();
          observer = null;
        }
      },
      { flush: 'post', deep: true },
    );

    return () => {
      const CustomExpandIconComp = (props.components as any)?.ExpandIcon;
      const adaptedCustomExpandIcon = CustomExpandIconComp
        ? (iconProps: RenderExpandIconProps<any>) => (
            <CustomExpandIconComp
              prefixCls={iconProps.prefixCls}
              type="row"
              expanded={iconProps.expanded}
              expandable={iconProps.expandable}
              record={iconProps.record}
              onClick={(e: MouseEvent) => {
                iconProps.onExpand(iconProps.record, e);
                e?.stopPropagation?.();
              }}
            />
          )
        : undefined;

      const {
        expandIcon = adaptedCustomExpandIcon ||
          slots.expandIcon ||
          props.expandable?.expandIcon ||
          tableConfig.value.expandable?.expandIcon ||
          renderExpandIcon(tableLocale.value),
        pagination,
        loading,
        bordered,
      } = props;

      const paginationClassNames = (
        mergedClassNames.value.pagination || mergedPagination.value.classNames
          ? (info: { props: any }) =>
              mergeClassNames<PaginationSemanticClassNames>(
                mergedClassNames.value.pagination,
                resolveSemantic(mergedPagination.value.classNames, info),
              )
          : undefined
      ) as PaginationProps['classNames'];

      const paginationStyles = (
        mergedStyles.value.pagination || mergedPagination.value.styles
          ? (info: { props: any }) =>
              mergeStyles<PaginationSemanticStyles>(
                resolveSemantic(mergedPagination.value.styles, info),
                mergedStyles.value.pagination,
              )
          : undefined
      ) as PaginationProps['styles'];

      let topPaginationNode;
      let bottomPaginationNode;
      if (pagination !== false && mergedPagination.value?.total) {
        let paginationSize: TablePaginationConfig['size'];
        if (mergedPagination.value.size) {
          paginationSize = mergedPagination.value.size;
        } else {
          paginationSize = mergedSize.value === 'small' || isMediumSize.value ? 'small' : undefined;
        }

        const paginationRestProps = omit(mergedPagination.value, ['placement', 'position']);
        const renderPagination = (position: string) => (
          <Pagination
            {...paginationRestProps}
            classNames={paginationClassNames}
            styles={paginationStyles}
            class={[
              `${prefixCls.value}-pagination ${prefixCls.value}-pagination-${position}`,
              mergedPagination.value.class,
            ]}
            size={paginationSize}
          />
        );
        const defaultPosition = direction.value === 'rtl' ? 'left' : 'right';
        const { placement, position } = mergedPagination.value;
        const isPlacement = placement !== undefined;
        const mergedPlacement = (placement ?? position) as string[] | undefined;
        if (mergedPlacement !== null && Array.isArray(mergedPlacement)) {
          const topPos = mergedPlacement.find(p => p.includes('top'));
          const bottomPos = mergedPlacement.find(p => p.includes('bottom'));
          const isDisable = mergedPlacement.every(p => `${p}` === 'none');
          if (!topPos && !bottomPos && !isDisable) {
            bottomPaginationNode = renderPagination(defaultPosition);
          }
          if (topPos) {
            topPaginationNode = renderPagination(normalizePaginationPlacement(topPos, isPlacement));
          }
          if (bottomPos) {
            bottomPaginationNode = renderPagination(
              normalizePaginationPlacement(bottomPos, isPlacement),
            );
          }
        } else {
          bottomPaginationNode = renderPagination(defaultPosition);
        }
      }

      // >>>>>>>>> Spinning
      let spinProps: SpinProps | undefined;
      if (typeof loading === 'boolean') {
        spinProps = {
          spinning: loading,
        };
      } else if (typeof loading === 'object') {
        spinProps = {
          spinning: true,
          ...loading,
        };
      }

      const wrapperClassNames = classNames(
        `${prefixCls.value}-wrapper`,
        tableConfig.value.className,
        {
          [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
        },
        props.rootClassName,
        mergedClassNames.value.root,
        attrs.class,
        hashId.value,
      );

      const resolvedRootStyle =
        mergedStyles.value.root && Object.keys(mergedStyles.value.root).length > 0
          ? mergedStyles.value.root
          : undefined;
      const wrapperStyle =
        attrs.style && !isPlainObject(attrs.style)
          ? resolvedRootStyle
            ? [resolvedRootStyle, attrs.style as CSSProperties]
            : (attrs.style as CSSProperties)
          : resolvedRootStyle;

      const useVirtualBody = Boolean(
        props.virtual &&
          virtualScrollY.value &&
          virtualScrollY.value > 0 &&
          typeof props.components?.body !== 'function',
      );

      let mergedComponents = props.components;
      if (useVirtualBody) {
        const leafColumns = flattenLeafColumns(transformColumns(mergedColumns.value));
        const renderVirtualBody = (bodyData: any[], info: any) => {
          if (!bodyData || bodyData.length === 0) {
            return (
              <div
                class={classNames(
                  `${prefixCls.value}-tbody-virtual`,
                  `${prefixCls.value}-placeholder`,
                  mergedClassNames.value.body?.wrapper,
                )}
                style={mergedStyles.value.body?.wrapper}
              >
                <div class={`${prefixCls.value}-cell`}>
                  {slots.emptyText?.() || props.locale?.emptyText || renderEmpty('Table')}
                </div>
              </div>
            );
          }
          return (
            <VirtualList
              ref={virtualListRef}
              prefixCls={`${prefixCls.value}-tbody-virtual`}
              class={mergedClassNames.value.body?.wrapper}
              style={mergedStyles.value.body?.wrapper}
              data={bodyData}
              height={virtualScrollY.value}
              itemHeight={listItemHeight.value}
              itemKey={(record: any) => getRowKey.value(record)}
              onScroll={(e: UIEvent) => {
                info?.onScroll?.({ currentTarget: e.currentTarget as HTMLElement });
                props.onScroll?.(e);
              }}
              v-slots={{
                default: (record: any, rowIndex: number) => {
                  const rowKey = getRowKey.value(record, rowIndex);
                  const customRowProps = (props.customRow?.(record, rowIndex) || {}) as any;
                  const {
                    class: customRowClass,
                    style: customRowStyle,
                    ...restCustomRowProps
                  } = customRowProps;
                  return (
                    <div
                      key={rowKey}
                      data-row-key={rowKey}
                      {...restCustomRowProps}
                      class={classNames(
                        `${prefixCls.value}-row`,
                        internalRowClassName(record, rowIndex, 0),
                        mergedClassNames.value.body?.row,
                        customRowClass,
                      )}
                      style={[mergedStyles.value.body?.row, customRowStyle]}
                    >
                      {leafColumns.map((col, colIdx) => {
                        const rawValue = getVirtualCellValue(record, col.dataIndex);
                        let cellNode: any = rawValue;
                        if (col.customRender) {
                          cellNode = col.customRender({
                            text: rawValue,
                            value: rawValue,
                            record,
                            index: rowIndex,
                            renderIndex: rowIndex,
                            column: col as any,
                          });
                        } else if (slots.bodyCell) {
                          const slotRes = slots.bodyCell({
                            text: rawValue,
                            value: rawValue,
                            record,
                            index: rowIndex,
                            column: col,
                          });
                          if (slotRes !== undefined) {
                            cellNode = slotRes;
                          }
                        }
                        if (transformCellText.value) {
                          cellNode = transformCellText.value({
                            text: cellNode,
                            column: col as any,
                            record,
                            index: rowIndex,
                          });
                        }
                        const customCellProps = (col.customCell?.(record, rowIndex, col as any) ||
                          {}) as any;
                        const {
                          class: customCellClass,
                          style: customCellStyle,
                          ...restCustomCellProps
                        } = customCellProps;
                        const widthStyle =
                          col.width !== undefined
                            ? {
                                flex: `0 0 ${
                                  typeof col.width === 'number' ? `${col.width}px` : col.width
                                }`,
                                width: typeof col.width === 'number' ? `${col.width}px` : col.width,
                              }
                            : { flex: '1 1 0' };
                        return (
                          <div
                            key={col.key ?? String(col.dataIndex ?? colIdx)}
                            {...restCustomCellProps}
                            class={classNames(
                              `${prefixCls.value}-cell`,
                              col.className,
                              mergedClassNames.value.body?.cell,
                              customCellClass,
                            )}
                            style={[
                              widthStyle,
                              col.align ? { textAlign: col.align } : undefined,
                              mergedStyles.value.body?.cell,
                              customCellStyle,
                            ]}
                          >
                            {cellNode}
                          </div>
                        );
                      })}
                    </div>
                  );
                },
              }}
            />
          );
        };
        mergedComponents = {
          ...props.components,
          body: renderVirtualBody as any,
        };
      }

      const restAttrs = omit(attrs, ['class', 'style']);
      const rcTableProps = omit(props, [
        'columns',
        'column',
        'virtual',
        'classNames',
        'styles',
        'expandable',
        'expandColumnTitle',
        'showExpandAll',
        'onExpandAll',
        'rowHoverable',
        'scroll',
        'expandedRowKeys',
        'defaultExpandedRowKeys',
        'defaultExpandAllRows',
        'expandedRowRender',
        'expandRowByClick',
        'expandColumnWidth',
        'expandFixed',
        'indentSize',
        'expandIconColumnIndex',
        'showExpandColumn',
        'expandedRowClassName',
        'childrenColumnName',
        'rowExpandable',
        'onExpand',
        'onExpandedRowsChange',
        'onUpdate:expandedRowKeys',
        'onScroll',
        'contextSlots',
      ]);

      const rcExpandedRowKeys = mergedShowExpandAll.value
        ? currentExpandedKeys.value
        : (mergedExpandedRowKeysProp.value as any);

      return wrapSSR(
        <div ref={rootRef} class={wrapperClassNames} style={wrapperStyle}>
          <Spin spinning={false} {...spinProps}>
            {topPaginationNode}
            <RcTable
              {...restAttrs}
              {...rcTableProps}
              scroll={mergedScroll.value}
              components={mergedComponents}
              expandedRowKeys={rcExpandedRowKeys}
              defaultExpandedRowKeys={mergedDefaultExpandedRowKeys.value as any}
              defaultExpandAllRows={mergedDefaultExpandAllRows.value}
              expandedRowRender={mergedExpandedRowRender.value}
              expandRowByClick={mergedExpandRowByClick.value}
              expandColumnWidth={mergedExpandColumnWidth.value as any}
              expandFixed={mergedExpandFixed.value}
              expandIconColumnIndex={expandIconColumnIndex.value}
              expandedRowClassName={mergedExpandedRowClassName.value}
              childrenColumnName={childrenColumnName.value}
              rowExpandable={mergedRowExpandable.value}
              onExpand={handleExpand}
              onExpandedRowsChange={handleExpandedRowsChange}
              indentSize={indentSize.value}
              expandIcon={expandIcon}
              columns={mergedColumns.value as any}
              direction={direction.value}
              prefixCls={prefixCls.value}
              class={classNames({
                [`${prefixCls.value}-middle`]: isMediumSize.value,
                [`${prefixCls.value}-small`]: mergedSize.value === 'small',
                [`${prefixCls.value}-bordered`]: bordered,
                [`${prefixCls.value}-empty`]: rawData.value.length === 0,
                [`${prefixCls.value}-virtual`]: !!props.virtual,
                [`${prefixCls.value}-no-header`]:
                  !props.title && !slots.title && props.showHeader === false,
                [`${prefixCls.value}-row-hover-disabled`]: props.rowHoverable === false,
              })}
              data={pageData.value}
              rowKey={getRowKey.value}
              rowClassName={internalRowClassName}
              // Internal
              internalHooks={INTERNAL_HOOKS}
              internalRefs={internalRefs as any}
              onUpdateInternalRefs={updateInternalRefs}
              transformColumns={transformColumns as any}
              transformCellText={transformCellText.value}
              v-slots={{
                ...slots,
                emptyText: () =>
                  slots.emptyText?.() || props.locale?.emptyText || renderEmpty('Table'),
              }}
            />
            {bottomPaginationNode}
          </Spin>
        </div>,
      );
    };
  },
});

const Table = defineComponent({
  name: 'ATable',
  inheritAttrs: false,
  props: tableProps(),
  slots: Object as CustomSlotsType<{
    emptyText?: any;
    expandIcon?: RenderExpandIconProps<any>;
    title?: any;
    footer?: any;
    summary?: any;
    expandedRowRender?: any;
    expandColumnTitle?: any;
    bodyCell?: (props: {
      text: any;
      value: any;
      record: Record<string, any>;
      index: number;
      column: ColumnType;
    }) => void;
    headerCell?: (props: { title: any; column: ColumnType }) => void;
    customFilterIcon?: any;
    customFilterDropdown?: any;
    default: any;
  }>,
  setup(props, { attrs, slots, expose }) {
    const table = ref();
    const nativeElement = computed(() => table.value?.nativeElement);
    const scrollToMethod: TableRef['scrollTo'] = config => {
      table.value?.scrollTo?.(config);
    };
    expose({
      table,
      nativeElement,
      scrollTo: scrollToMethod,
    });
    return () => {
      const columns = props.columns || convertChildrenToColumns(slots.default?.());
      return (
        <InternalTable
          ref={table}
          {...attrs}
          {...props}
          columns={columns || []}
          expandedRowRender={
            slots.expandedRowRender ||
            props.expandedRowRender ||
            props.expandable?.expandedRowRender
          }
          contextSlots={{ ...slots }} // use new object, 否则slot热更新失效，原因需进一步探究
          v-slots={slots}
        />
      );
    };
  },
});

export default Table;
