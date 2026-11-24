<template>
  <demo-sort :cols="1">
    <simple />
    <basic />
    <loadmore />
    <vertical />
    <pagination />
    <grid />
    <grid-test />
    <resposive />
    <infinite-load />
    <drag-sorting />
    <drag-sorting-handler />
    <grid-drag-sorting />
    <grid-drag-sorting-handler />
    <virtual-list />
    <component-token />
    <spin-debug />
  </demo-sort>
</template>
<script lang="ts">
import Simple from './simple.vue';
import Basic from './basic.vue';
import Loadmore from './loadmore.vue';
import Vertical from './vertical.vue';
import Pagination from './pagination.vue';
import Grid from './grid.vue';
import GridTest from './grid-test.vue';
import Resposive from './resposive.vue';
import InfiniteLoad from './infinite-load.vue';
import DragSorting from './drag-sorting.vue';
import DragSortingHandler from './drag-sorting-handler.vue';
import GridDragSorting from './grid-drag-sorting.vue';
import GridDragSortingHandler from './grid-drag-sorting-handler.vue';
import VirtualList from './virtual-list.vue';
import ComponentToken from './component-token.vue';
import SpinDebug from './spin-debug.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Simple,
    Basic,
    Loadmore,
    Vertical,
    Pagination,
    Grid,
    GridTest,
    Resposive,
    InfiniteLoad,
    DragSorting,
    DragSortingHandler,
    GridDragSorting,
    GridDragSortingHandler,
    VirtualList,
    ComponentToken,
    SpinDebug,
  },
  setup() {
    return {};
  },
});
</script>
