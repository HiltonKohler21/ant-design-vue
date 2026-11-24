<template>
  <demo-sort>
    <basic />
    <basic-controlled />
    <draggable />
    <dynamic />
    <search />
    <show-line />
    <custom-icon />
    <directory />
    <directory-debug />
    <switcher-icon />
    <virtual-scroll />
    <scroll-to />
    <drag-debug />
    <big-data />
    <block-node />
    <replace-fields />
    <context-menu />
    <accordion />
    <component-token />
    <multiple-line />
    <style-class />
    <line-debug />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import BasicControlled from './basic-controlled.vue';
import Draggable from './draggable.vue';
import Dynamic from './dynamic.vue';
import Search from './search.vue';
import Line from './line.vue';
import CustomIcon from './customized-icon.vue';
import Directory from './directory.vue';
import DirectoryDebug from './directory-debug.vue';
import SwitcherIcon from './switcher-icon.vue';
import VirtualScroll from './virtual-scroll.vue';
import ScrollTo from './scroll-to.vue';
import DragDebug from './drag-debug.vue';
import BigData from './big-data.vue';
import BlockNode from './block-node.vue';
import ReplaceFields from './replaceFields.vue';
import ContextMenu from './context-menu.vue';
import Accordion from './accordion.vue';
import ComponentToken from './component-token.vue';
import MultipleLine from './multiple-line.vue';
import StyleClass from './style-class.vue';
import LineDebug from './line-debug.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    BasicControlled,
    Draggable,
    Dynamic,
    Search,
    ShowLine: Line,
    CustomIcon,
    Directory,
    DirectoryDebug,
    SwitcherIcon,
    VirtualScroll,
    ScrollTo,
    DragDebug,
    BigData,
    BlockNode,
    ReplaceFields,
    ContextMenu,
    Accordion,
    ComponentToken,
    MultipleLine,
    StyleClass,
    LineDebug,
  },
  setup() {
    return {};
  },
});
</script>
