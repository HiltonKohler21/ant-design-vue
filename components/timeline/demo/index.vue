<template>
  <demo-sort>
    <basic />
    <variant-demo />
    <pending />
    <pending-legacy />
    <alternate />
    <horizontal-demo />
    <horizontal-debug />
    <custom />
    <end />
    <title-demo />
    <title-span />
    <semantic />
    <style-class />
    <right />
    <label-demo />
    <color />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import VariantDemo from './variant.vue';
import Pending from './pending.vue';
import PendingLegacy from './pending-legacy.vue';
import Alternate from './alternate.vue';
import HorizontalDemo from './horizontal.vue';
import HorizontalDebug from './horizontal-debug.vue';
import Custom from './custom.vue';
import End from './end.vue';
import TitleDemo from './title.vue';
import TitleSpan from './title-span.vue';
import Semantic from './semantic.vue';
import StyleClass from './style-class.vue';
import Right from './right.vue';
import LabelDemo from './label.vue';
import Color from './color.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    VariantDemo,
    Pending,
    PendingLegacy,
    Alternate,
    HorizontalDemo,
    HorizontalDebug,
    Custom,
    End,
    TitleDemo,
    TitleSpan,
    Semantic,
    StyleClass,
    Right,
    LabelDemo,
    Color,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
