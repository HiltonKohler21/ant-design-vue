<template>
  <demo-sort>
    <basic />
    <vertical />
    <block />
    <shape />
    <disabled />
    <controlled />
    <custom />
    <dynamic />
    <size />
    <with-icon />
    <icon-only />
    <with-name />
    <style-class />
    <controlled-two />
    <size-consistent />
    <component-token />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Vertical from './vertical.vue';
import Block from './block.vue';
import Shape from './shape.vue';
import Disabled from './disabled.vue';
import Controlled from './controlled.vue';
import Custom from './custom.vue';
import Dynamic from './dynamic.vue';
import Size from './size.vue';
import WithIcon from './with-icon.vue';
import IconOnly from './icon-only.vue';
import WithName from './with-name.vue';
import StyleClass from './style-class.vue';
import ControlledTwo from './controlled-two.vue';
import SizeConsistent from './size-consistent.vue';
import ComponentToken from './component-token.vue';

export default defineComponent({
  components: {
    Basic,
    Vertical,
    Block,
    Shape,
    Disabled,
    Controlled,
    Custom,
    Dynamic,
    Size,
    WithIcon,
    IconOnly,
    WithName,
    StyleClass,
    ControlledTwo,
    SizeConsistent,
    ComponentToken,
  },
  category: 'Components',
  subtitle: '分段控制器',
  type: 'Data Display',
  title: 'Segmented',
  CN,
  US,
});
</script>
