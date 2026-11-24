<template>
  <demo-sort :cols="1">
    <Basic />
    <TemplateCom />
    <Jsx />
    <RowSelection />
    <RowSelectionAndOperation />
    <RowSelectionCustom />
    <RowSelectionDebug />
    <Head />
    <filterInTreeVue />
    <filterSearchVue />
    <MultipleSorter />
    <ResetFilter />
    <CustomFilterPanel />
    <Ajax />
    <Size />
    <Narrow />
    <Bordered />
    <Expand />
    <ExpandAll />
    <ExpandSticky />
    <order-column />
    <ColspanRowspan />
    <ExpandChildren />
    <TreeTableEllipsis />
    <TreeTablePreserveSelectedRowKeys />
    <FixedHeader />
    <AutoHeight />
    <FixedColumns />
    <FixedGappedColumns />
    <FixedColumnsHeader />
    <hidden-columns />
    <GroupingColumns />
    <EditCell />
    <EditRow />
    <NestedTable />
    <DragSorting />
    <DragColumnSorting />
    <DragSortingHandler />
    <Ellipsis />
    <ColumnDefaults />
    <EllipsisCustomTooltip />
    <CustomEmpty />
    <Summary />
    <virtual-list />
    <Responsive />
    <NestTableBorderDebug />
    <NestedTableInTabsDebug />
    <PaginationDemo />
    <RowSelectionCustomDebug />
    <Sticky />
    <DynamicSettings />
    <StyleClass />
    <SelectionsDebug />
    <ResizableColumn />
    <Stripe />
    <component-token />
    <MeasureRowRender />
  </demo-sort>
</template>

<script lang="ts">
import OrderColumn from './order-column.vue';
import VirtualList from './virtual-list.vue';
import HiddenColumns from './hidden-columns.vue';
/* eslint-disable @typescript-eslint/no-unused-vars */
import Ajax from './ajax.vue';
import AutoHeight from './auto-height.vue';
import Basic from './basic.vue';
import Bordered from './bordered.vue';
import ColspanRowspan from './colspan-rowspan.vue';
import ColumnDefaults from './column-defaults.vue';
import ComponentToken from './component-token.vue';
import CustomEmpty from './custom-empty.vue';
import CustomFilterPanel from './custom-filter-panel.vue';
import DragColumnSorting from './drag-column-sorting.vue';
import DragSortingHandler from './drag-sorting-handler.vue';
import DragSorting from './drag-sorting.vue';
import DynamicSettings from './dynamic-settings.vue';
import EditCell from './edit-cell.vue';
import EditRow from './edit-row.vue';
import EllipsisCustomTooltip from './ellipsis-custom-tooltip.vue';
import Ellipsis from './ellipsis.vue';
import ExpandAll from './expand-all.vue';
import ExpandChildren from './expand-children.vue';
import ExpandSticky from './expand-sticky.vue';
import Expand from './expand.vue';
import FixedColumnsHeader from './fixed-columns-header.vue';
import FixedColumns from './fixed-columns.vue';
import FixedGappedColumns from './fixed-gapped-columns.vue';
import FixedHeader from './fixed-header.vue';
import GroupingColumns from './grouping-columns.vue';
import Head from './head.vue';
import Jsx from './jsx.vue';
import MeasureRowRender from './measure-row-render.vue';
import MultipleSorter from './multiple-sorter.vue';
import Narrow from './narrow.vue';
import NestTableBorderDebug from './nest-table-border-debug.vue';
import NestedTableInTabsDebug from './nested-table-in-tabs-debug.vue';
import NestedTable from './nested-table.vue';
import PaginationDemo from './pagination.vue';
import ResetFilter from './reset-filter.vue';
import ResizableColumn from './resizable-column.vue';
import Responsive from './responsive.vue';
import RowSelectionAndOperation from './row-selection-and-operation.vue';
import RowSelectionCustomDebug from './row-selection-custom-debug.vue';
import RowSelectionCustom from './row-selection-custom.vue';
import RowSelectionDebug from './row-selection-debug.vue';
import RowSelection from './row-selection.vue';
import SelectionsDebug from './selections-debug.vue';
import Size from './size.vue';
import Sticky from './sticky.vue';
import Stripe from './stripe.vue';
import StyleClass from './style-class.vue';
import Summary from './summary.vue';
import TemplateCom from './template.vue';
import TreeTableEllipsis from './tree-table-ellipsis.vue';
import TreeTablePreserveSelectedRowKeys from './tree-table-preserveSelectedRowKeys.vue';
import filterSearchVue from './filter-search.vue';
import filterInTreeVue from './filter-in-tree.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    OrderColumn,
    VirtualList,
    HiddenColumns,
    filterInTreeVue,
    filterSearchVue,
    Ajax,
    AutoHeight,
    Basic,
    Bordered,
    ColspanRowspan,
    ColumnDefaults,
    ComponentToken,
    CustomEmpty,
    CustomFilterPanel,
    DragColumnSorting,
    DragSortingHandler,
    DragSorting,
    DynamicSettings,
    EditCell,
    EditRow,
    EllipsisCustomTooltip,
    Ellipsis,
    ExpandAll,
    ExpandChildren,
    ExpandSticky,
    Expand,
    FixedColumnsHeader,
    FixedColumns,
    FixedGappedColumns,
    FixedHeader,
    GroupingColumns,
    Head,
    Jsx,
    MeasureRowRender,
    MultipleSorter,
    Narrow,
    NestTableBorderDebug,
    NestedTableInTabsDebug,
    NestedTable,
    PaginationDemo,
    ResetFilter,
    ResizableColumn,
    Responsive,
    RowSelectionAndOperation,
    RowSelectionCustomDebug,
    RowSelectionCustom,
    RowSelectionDebug,
    RowSelection,
    SelectionsDebug,
    Size,
    Sticky,
    Stripe,
    StyleClass,
    Summary,
    TemplateCom,
    TreeTableEllipsis,
    TreeTablePreserveSelectedRowKeys,
  },
});
</script>
