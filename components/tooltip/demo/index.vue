<template>
  <demo-sort>
    <basic />
    <SmoothTransition />
    <placement />
    <Arrow />
    <shift />
    <auto-adjust-overflow />
    <force-align />
    <destroy-on-close />
    <color />
    <render-panel />
    <debug-demo />
    <disabled />
    <disabled-children />
    <wrap-custom-component />
    <style-class />
    <arrow-point-at-center />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import SmoothTransition from './smooth-transition.vue';
import Placement from './placement.vue';
import Arrow from './arrow.vue';
import Shift from './shift.vue';
import AutoAdjustOverflow from './auto-adjust-overflow.vue';
import ForceAlign from './force-align.vue';
import DestroyOnClose from './destroy-on-close.vue';
import Color from './color.vue';
import RenderPanel from './render-panel.vue';
import DebugDemo from './debug.vue';
import Disabled from './disabled.vue';
import DisabledChildren from './disabled-children.vue';
import WrapCustomComponent from './wrap-custom-component.vue';
import StyleClass from './style-class.vue';
import arrowPointAtCenter from './arrow-point-at-center.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    SmoothTransition,
    Placement,
    Arrow,
    Shift,
    AutoAdjustOverflow,
    ForceAlign,
    DestroyOnClose,
    Color,
    RenderPanel,
    DebugDemo,
    Disabled,
    DisabledChildren,
    WrapCustomComponent,
    StyleClass,
    arrowPointAtCenter,
  },
  setup() {
    return {};
  },
});
</script>
