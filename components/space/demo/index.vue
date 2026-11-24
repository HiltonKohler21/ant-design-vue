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
    <CompactDebug />
    <CompactNested />
    <Debug />
    <GapInLine />
    <StyleClass />
    <ComponentToken />
  </demo-sort>
</template>
<script lang="ts">
import Base from './base.vue';
import Vertical from './vertical.vue';
import Size from './size.vue';
import Align from './align.vue';
import Wrap from './wrap.vue';
import Split from './split.vue';
import Compact from './compact.vue';
import CompactButtons from './compact-buttons.vue';
import CompactButtonVertical from './compact-button-vertical.vue';
import Customize from './customize.vue';
import Addon from './addon.vue';
import CompactDebug from './compact-debug.vue';
import CompactNested from './compact-nested.vue';
import Debug from './debug.vue';
import GapInLine from './gap-in-line.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Base,
    Vertical,
    Size,
    Align,
    Wrap,
    Split,
    Compact,
    CompactButtons,
    CompactButtonVertical,
    Customize,
    Addon,
    CompactDebug,
    CompactNested,
    Debug,
    GapInLine,
    StyleClass,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
