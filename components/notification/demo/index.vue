<template>
  <demo-sort>
    <hook />
    <duration />
    <with-icon />
    <with-btn />
    <custom-icon />
    <placement />
    <update />
    <stack />
    <show-with-progress />
    <basic />
    <progress-color />
    <component-token />
    <render-panel />
    <style-class />
  </demo-sort>
</template>
<script lang="ts">
import Hook from './hook.vue';
import Duration from './duration.vue';
import WithIcon from './with-icon.vue';
import WithBtn from './with-btn.vue';
import CustomIcon from './custom-icon.vue';
import Placement from './placement.vue';
import Update from './update.vue';
import Stack from './stack.vue';
import ShowWithProgress from './show-with-progress.vue';
import Basic from './basic.vue';
import ProgressColor from './progress-color.vue';
import ComponentToken from './component-token.vue';
import RenderPanel from './render-panel.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Hook,
    Duration,
    WithIcon,
    WithBtn,
    CustomIcon,
    Placement,
    Update,
    Stack,
    ShowWithProgress,
    Basic,
    ProgressColor,
    ComponentToken,
    RenderPanel,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
<style>
[id^='components-notification-demo-'] .ant-btn {
  margin-right: 8px;
}
</style>
