<template>
  <demo-sort>
    <basic />
    <non-modal />
    <placement />
    <Mask />
    <indicator />
    <actions-render />
    <gap />
    <style-class />
    <render-panel />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import NonModal from './non-modal.vue';
import Placement from './placement.vue';
import Mask from './mask.vue';
import Indicator from './indicator.vue';
import ActionsRender from './actions-render.vue';
import Gap from './gap.vue';
import StyleClass from './style-class.vue';
import RenderPanel from './render-panel.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    NonModal,
    Placement,
    Mask,
    Indicator,
    ActionsRender,
    Gap,
    StyleClass,
    RenderPanel,
  },
  setup() {
    return {};
  },
});
</script>
