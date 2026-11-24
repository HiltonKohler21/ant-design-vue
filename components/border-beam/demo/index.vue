<template>
  <demo-sort :cols="2">
    <basic />
    <hover />
    <count />
    <custom-container />
    <customized-color />
    <duration />
    <size />
    <line-width />
    <non-uniform-radius />
    <component-token />
    <color />
    <multiple />
    <custom />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Hover from './hover.vue';
import Count from './count.vue';
import CustomContainer from './custom-container.vue';
import CustomizedColor from './customized-color.vue';
import Duration from './duration.vue';
import Size from './size.vue';
import LineWidth from './line-width.vue';
import NonUniformRadius from './non-uniform-radius.vue';
import ComponentToken from './component-token.vue';
import Color from './color.vue';
import Multiple from './multiple.vue';
import Custom from './custom.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Hover,
    Count,
    CustomContainer,
    CustomizedColor,
    Duration,
    Size,
    LineWidth,
    NonUniformRadius,
    ComponentToken,
    Color,
    Multiple,
    Custom,
  },
});
</script>
