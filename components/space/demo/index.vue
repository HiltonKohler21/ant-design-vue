<template>
  <demo-sort :cols="1">
    <Base />
    <Vertical />
    <Size />
    <Align />
    <Wrap />
    <Split />
    <Compact />
    <CompactButtons />
    <CompactButtonVertical />
    <Customize />
    <Addon />
    <StyleClass />
    <ComponentToken />
  </demo-sort>
</template>
<script lang="ts">
import Base from './base.vue';
import Customize from './customize.vue';
import Vertical from './vertical.vue';
import Align from './align.vue';
import Wrap from './wrap.vue';
import Split from './split.vue';
import Compact from './compact.vue';
import CompactButtons from './compact-buttons.vue';
import CompactButtonVertical from './compact-button-vertical.vue';
import Addon from './addon.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
import Size from './size.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Base,
    Customize,
    Vertical,
    Align,
    Wrap,
    Split,
    Compact,
    CompactButtons,
    CompactButtonVertical,
    Addon,
    StyleClass,
    ComponentToken,
    Size,
  },
  setup() {
    return {};
  },
});
</script>
