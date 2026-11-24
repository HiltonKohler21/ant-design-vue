<template>
  <demo-sort>
    <line-demo />
    <circle-demo />
    <line-mini />
    <circle-micro />
    <circle-mini />
    <dynamic />
    <format />
    <dashboard />
    <segment />
    <line-cap />
    <gradient-line />
    <steps />
    <circle-steps />
    <Size />
    <info-position />
    <style-class />
  </demo-sort>
</template>
<script lang="ts">
import Line from './line.vue';
import Circle from './circle.vue';
import LineMini from './line-mini.vue';
import CircleMicro from './circle-micro.vue';
import CircleMini from './circle-mini.vue';
import Dynamic from './dynamic.vue';
import Format from './format.vue';
import Dashboard from './dashboard.vue';
import Segment from './segment.vue';
import LineCap from './linecap.vue';
import GradientLine from './gradient-line.vue';
import Steps from './steps.vue';
import CircleSteps from './circle-steps.vue';
import Size from './size.vue';
import InfoPosition from './info-position.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    LineDemo: Line,
    CircleDemo: Circle,
    LineMini,
    CircleMicro,
    CircleMini,
    Dynamic,
    Format,
    Dashboard,
    Segment,
    LineCap,
    GradientLine,
    Steps,
    CircleSteps,
    Size,
    InfoPosition,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
