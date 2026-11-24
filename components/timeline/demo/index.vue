<template>
  <demo-sort>
    <basic />
    <variant-demo />
    <pending />
    <alternate />
    <horizontal-demo />
    <custom />
    <right />
    <label-demo />
    <color />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import LabelDemo from './label.vue';
import Basic from './basic.vue';
import Color from './color.vue';
import Pending from './pending.vue';
import Custom from './custom.vue';
import Alternate from './alternate.vue';
import Right from './right.vue';
import VariantDemo from './variant.vue';
import HorizontalDemo from './horizontal.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    LabelDemo,
    Basic,
    Color,
    Pending,
    Custom,
    Alternate,
    Right,
    VariantDemo,
    HorizontalDemo,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
