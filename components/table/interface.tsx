import type {
  GetRowKey,
  ColumnType as RcColumnType,
  RenderedCell as RcRenderedCell,
  ExpandableConfig as RcExpandableConfig,
  DefaultRecordType,
  FixedType as RcFixedType,
  GetComponentProps,
} from '../vc-table/interface';
import type { TooltipProps } from '../tooltip';
import type { CheckboxProps } from '../checkbox';
import type {
  PaginationProps,
  PaginationSemanticClassNames,
  PaginationSemanticStyles,
} from '../pagination';
import type { Breakpoint } from '../_util/responsiveObserve';
import type { INTERNAL_SELECTION_ITEM } from './hooks/useSelection';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import type { CSSProperties, VNodeArrayChildren } from 'vue';

export type FixedType = RcFixedType | 'start' | 'end';

export interface TableComponentsSemanticClassNames {
  wrapper?: string;
  cell?: string;
  row?: string;
}

export interface TableComponentsSemanticStyles {
  wrapper?: CSSProperties;
  cell?: CSSProperties;
  row?: CSSProperties;
}

export interface TableSemanticClassNames {
  root?: string;
  section?: string;
  title?: string;
  footer?: string;
  content?: string;
  header?: string | TableComponentsSemanticClassNames;
  body?: string | TableComponentsSemanticClassNames;
  pagination?: string | PaginationSemanticClassNames;
}

export interface TableSemanticStyles {
  root?: CSSProperties;
  section?: CSSProperties;
  title?: CSSProperties;
  footer?: CSSProperties;
  content?: CSSProperties;
  header?: CSSProperties | TableComponentsSemanticStyles;
  body?: CSSProperties | TableComponentsSemanticStyles;
  pagination?: CSSProperties | PaginationSemanticStyles;
}

export interface TableResolvedSemanticClassNames {
  root?: string;
  section?: string;
  title?: string;
  footer?: string;
  content?: string;
  header?: TableComponentsSemanticClassNames;
  body?: TableComponentsSemanticClassNames;
  pagination?: PaginationSemanticClassNames;
}

export interface TableResolvedSemanticStyles {
  root?: CSSProperties;
  section?: CSSProperties;
  title?: CSSProperties;
  footer?: CSSProperties;
  content?: CSSProperties;
  header?: TableComponentsSemanticStyles;
  body?: TableComponentsSemanticStyles;
  pagination?: PaginationSemanticStyles;
}

export type TableClassNamesType<Props = any> =
  | TableSemanticClassNames
  | ((info: { props: Props }) => TableSemanticClassNames);

export type TableStylesType<Props = any> =
  | TableSemanticStyles
  | ((info: { props: Props }) => TableSemanticStyles);

export interface ExpandableConfig<RecordType = DefaultRecordType>
  extends Omit<RcExpandableConfig<RecordType>, 'fixed' | 'expandedRowClassName'> {
  fixed?: FixedType;
  expandedRowClassName?: string | RcExpandableConfig<RecordType>['expandedRowClassName'];
  columnTitle?: VueNode | ((info: { expandIcon: VueNode }) => VueNode);
  showExpandAll?: boolean;
  onExpandAll?: (expanded: boolean) => void;
  forceRender?: boolean;
  /** @deprecated Please use `Table.EXPAND_COLUMN` instead */
  expandedRowOffset?: number;
}

export type { GetRowKey };

export type Key = string | number;

export type RowSelectionType = 'checkbox' | 'radio';

export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void;

export type ExpandType = null | 'row' | 'nest';

export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: any;
  filterReset?: any;
  filterEmptyText?: any;
  filterCheckall?: any;
  filterCheckAll?: any;
  filterSearchPlaceholder?: any;
  emptyText?: any | (() => any);
  selectAll?: any;
  selectNone?: any;
  selectInvert?: any;
  selectionAll?: any;
  selectRow?: string;
  selectedRow?: string;
  selectionMenu?: string;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  expandAll?: string;
  collapseAll?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export type SortOrder = 'descend' | 'ascend' | null;

export type SorterTooltipTarget = 'full-header' | 'sorter-icon';

export type SorterTooltipProps = TooltipProps & {
  target?: SorterTooltipTarget;
};

const TableActions = tuple('paginate', 'sort', 'filter');
export type TableAction = (typeof TableActions)[number];

export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

export interface ColumnFilterItem {
  text: VueNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}
export interface ColumnTitleProps<RecordType> {
  /** @deprecated Please use `sorterColumns` instead. */
  sortOrder?: SortOrder;
  /** @deprecated Please use `sorterColumns` instead. */
  sortColumn?: ColumnType<RecordType>;
  sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[];

  filters?: Record<string, FilterValue>;
}

type ColumnTitleNode = VueNode | VNodeArrayChildren;
export type ColumnTitle<RecordType> =
  | ColumnTitleNode
  | ((props: ColumnTitleProps<RecordType>) => ColumnTitleNode);

export type FilterValue = (Key | boolean)[];
export type FilterKey = Key[] | null;
export type FilterSearchType<RecordType = Record<string, any>> =
  | boolean
  | ((input: string, record: RecordType) => boolean);
export interface FilterConfirmProps {
  closeDropdown: boolean;
}
export interface FilterResetProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

export interface FilterDropdownProps<RecordType> {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: Key[]) => void;
  selectedKeys: Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterResetProps) => void;
  filters?: ColumnFilterItem[];
  /** Only close filterDropdown */
  close: () => void;
  visible: boolean;
  column: ColumnType<RecordType>;
}

export interface ColumnType<RecordType = DefaultRecordType>
  extends Omit<RcColumnType<RecordType>, 'title' | 'fixed'> {
  title?: ColumnTitle<RecordType>;
  fixed?: FixedType;
  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;
  // Sorter
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
        compare?: CompareFn<RecordType>;
        /** Config multiple sorter order priority */
        multiple?: number;
      };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | SorterTooltipProps;
  sortIcon?: (props: { sortOrder: SortOrder | null }) => any;
  filterOnClose?: boolean;
  filterDropdownProps?: Record<string, any>;

  // Filter
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: VueNode | ((props: FilterDropdownProps<RecordType>) => VueNode);
  filterMultiple?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterIcon?: VueNode | ((opt: { filtered: boolean; column: ColumnType }) => VueNode);
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  filterDropdownOpen?: boolean;
  onFilterDropdownOpenChange?: (visible: boolean) => void;
  filterResetToDefaultFilteredValue?: boolean;
  // Responsive
  responsive?: Breakpoint[];
  /** 隐藏列（4.3.0+） */
  hidden?: boolean;

  // Deprecated
  /** @deprecated Please use `filterDropdownOpen` instead */
  filterDropdownVisible?: boolean;
  /** @deprecated Please use `onFilterDropdownOpenChange` instead */
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
}

export interface ColumnGroupType<RecordType> extends Omit<ColumnType<RecordType>, 'dataIndex'> {
  children: ColumnsType<RecordType>;
}

export type ColumnsType<RecordType = DefaultRecordType> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export interface SelectionItem {
  key: string;
  text: VueNode;
  onSelect?: SelectionItemSelectFn;
}

export type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: T[],
  nativeEvent: Event,
) => void;

export interface TableRowSelection<T = DefaultRecordType> {
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean;
  type?: RowSelectionType;
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>;
  getTitleCheckboxProps?: () => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>;
  onSelect?: SelectionSelectFn<T>;
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectInvert?: (selectedRowKeys: Key[]) => void;
  onSelectNone?: () => void;
  selections?: INTERNAL_SELECTION_ITEM[] | boolean;
  hideSelectAll?: boolean;
  fixed?: FixedType;
  columnWidth?: string | number;
  columnTitle?: string | VueNode | ((checkboxNode: VueNode) => VueNode);
  checkStrictly?: boolean;
  align?: 'left' | 'center' | 'right';
  customCell?: GetComponentProps<T>;
  onCell?: GetComponentProps<T>;
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: VueNode,
  ) => VueNode | RcRenderedCell<T>;
}

export type TransformColumns<RecordType> = (
  columns: ColumnsType<RecordType>,
) => ColumnsType<RecordType>;

export interface TableCurrentDataSource<RecordType = DefaultRecordType> {
  currentDataSource: RecordType[];
  action: TableAction;
}

export interface SorterResult<RecordType = DefaultRecordType> {
  column?: ColumnType<RecordType>;
  order?: SortOrder;
  field?: Key | readonly Key[];
  columnKey?: Key;
}

export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;

export type TablePaginationPlacement =
  | 'topStart'
  | 'topCenter'
  | 'topEnd'
  | 'bottomStart'
  | 'bottomCenter'
  | 'bottomEnd'
  | 'none';

export type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'none';

export interface TablePaginationConfig extends PaginationProps {
  placement?: TablePaginationPlacement[];
  position?: TablePaginationPosition[];
  class?: string;
  style?: CSSProperties;
}

export interface TableRef {
  nativeElement?: HTMLDivElement;
  scrollTo?: (config: {
    index?: number;
    key?: Key;
    top?: number;
    offset?: number;
    align?: 'start' | 'center' | 'end' | 'nearest';
  }) => void;
}

export interface TransformCellTextProps {
  text: any;
  column: ColumnType;
  record: any;
  index: number;
}
