<template>
  <demo-sort :cols="1">
    <Basic />
    <Border />
    <Text />
    <Padding />
    <Size />
    <Responsive />
    <Vertical />
    <VerticalBorder />
    <StyleDemo />
    <StyleClass />
    <JsxDemo />
    <ComponentToken />
    <Block />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Border from './border.vue';
import Text from './text.vue';
import Padding from './padding.vue';
import Size from './size.vue';
import Responsive from './responsive.vue';
import Vertical from './vertical.vue';
import VerticalBorder from './vertical-border.vue';
import StyleDemo from './style.vue';
import StyleClass from './style-class.vue';
import JsxDemo from './jsx.vue';
import ComponentToken from './component-token.vue';
import Block from './block.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Descriptions',
  subtitle: '描述列表',
  cols: 1,
  CN,
  US,
  components: {
    Basic,
    Border,
    Text,
    Padding,
    Size,
    Responsive,
    Vertical,
    VerticalBorder,
    StyleDemo,
    StyleClass,
    JsxDemo,
    ComponentToken,
    Block,
  },
});
</script>
