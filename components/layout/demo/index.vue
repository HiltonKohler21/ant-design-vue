<template>
  <demo-sort :cols="1">
    <basic />
    <top />
    <top-side />
    <top-side2 />
    <Side />
    <custom-trigger />
    <collapsible-overlay />
    <responsive />
    <Fixed />
    <FixedSider />
    <CustomTriggerDebug />
    <ComponentToken />
  </demo-sort>
</template>

<script>
import Basic from './basic.vue';
import Top from './top.vue';
import TopSide from './top-side.vue';
import TopSide2 from './top-side-2.vue';
import Side from './side.vue';
import CustomTrigger from './custom-trigger.vue';
import CollapsibleOverlay from './collapsible-overlay.vue';
import Responsive from './responsive.vue';
import Fixed from './fixed.vue';
import FixedSider from './fixed-sider.vue';
import CustomTriggerDebug from './custom-trigger-debug.vue';
import ComponentToken from './component-token.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Top,
    TopSide,
    TopSide2,
    Side,
    CustomTrigger,
    CollapsibleOverlay,
    Responsive,
    Fixed,
    FixedSider,
    CustomTriggerDebug,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
