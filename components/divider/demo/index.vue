<template>
  <demo-sort>
    <horizontal />
    <with-text />
    <size />
    <plain />
    <vertical />
    <customize-style />
    <variant />
    <style-class />
  </demo-sort>
</template>

<script lang="ts">
import Horizontal from './horizontal.vue';
import WithText from './with-text.vue';
import Plain from './plain.vue';
import Variant from './variant.vue';
import Size from './size.vue';
import Vertical from './vertical.vue';
import CustomizeStyle from './customize-style.vue';
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
    Plain,
    Variant,
    Size,
    Vertical,
    CustomizeStyle,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
