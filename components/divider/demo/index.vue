<template>
  <demo-sort>
    <horizontal />
    <with-text />
    <size />
    <plain />
    <vertical />
    <customize-style />
    <component-token />
    <variant />
    <style-class />
  </demo-sort>
</template>

<script lang="ts">
import Horizontal from './horizontal.vue';
import WithText from './with-text.vue';
import Size from './size.vue';
import Plain from './plain.vue';
import Vertical from './vertical.vue';
import CustomizeStyle from './customize-style.vue';
import ComponentToken from './component-token.vue';
import Variant from './variant.vue';
import StyleClass from './style-class.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Horizontal,
    WithText,
    Size,
    Plain,
    Vertical,
    CustomizeStyle,
    ComponentToken,
    Variant,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
