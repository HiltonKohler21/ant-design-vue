<template>
  <demo-sort :cols="1">
    <basic />
    <row-hoverable-debug />
    <virtual />
    <horizontal />
    <group />
    <rich />
    <drag-sorting />
    <infinite />
    <style-class />
    <scroll-to />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import RowHoverableDebug from './row-hoverable-debug.vue';
import Virtual from './virtual.vue';
import Horizontal from './horizontal.vue';
import Group from './group.vue';
import Rich from './rich.vue';
import DragSorting from './drag-sorting.vue';
import Infinite from './infinite.vue';
import StyleClass from './style-class.vue';
import ScrollTo from './scroll-to.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    RowHoverableDebug,
    Virtual,
    Horizontal,
    Group,
    Rich,
    DragSorting,
    Infinite,
    StyleClass,
    ScrollTo,
  },
});
</script>
