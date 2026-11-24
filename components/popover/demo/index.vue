<template>
  <demo-sort>
    <basic />
    <trigger-type />
    <placement />
    <arrow />
    <arrow-center />
    <shift />
    <control />
    <hover-with-click />
    <style-class />
    <render-panel />
    <wireframe />
    <component-token />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import TriggerType from './triggerType.vue';
import Placement from './placement.vue';
import Arrow from './arrow.vue';
import ArrowCenter from './arrow-point-at-center.vue';
import Shift from './shift.vue';
import Control from './control.vue';
import HoverWithClick from './hover-with-click.vue';
import StyleClass from './style-class.vue';
import RenderPanel from './render-panel.vue';
import Wireframe from './wireframe.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    TriggerType,
    Placement,
    Arrow,
    ArrowCenter,
    Shift,
    Control,
    HoverWithClick,
    StyleClass,
    RenderPanel,
    Wireframe,
    ComponentToken,
  },
});
</script>
