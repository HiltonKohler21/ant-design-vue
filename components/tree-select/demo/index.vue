<template>
  <demo-sort>
    <basic />
    <multiple />
    <!-- <tree-data /> -->
    <checkable />
    <async />
    <treeLineVue />
    <placementVue />
    <statusVue />
    <suffix />
    <Highlight />
    <virtualScrollVue />
    <customTagRenderVue />
    <replaceFieldsVue />
    <style-class />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Multiple from './multiple.vue';
// import TreeData from './treeData.vue';
import Checkable from './checkable.vue';
import Suffix from './suffix.vue';
import Async from './async.vue';
import Highlight from './highlight.vue';
import treeLineVue from './tree-line.vue';
import virtualScrollVue from './virtual-scroll.vue';
import customTagRenderVue from './custom-tag-render.vue';
import replaceFieldsVue from './replaceFields.vue';
import placementVue from './placement.vue';
import statusVue from './status.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    placementVue,
    statusVue,
    Basic,
    Multiple,
    // TreeData,
    Checkable,
    Suffix,
    Async,
    Highlight,
    treeLineVue,
    virtualScrollVue,
    customTagRenderVue,
    replaceFieldsVue,
    StyleClass,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
