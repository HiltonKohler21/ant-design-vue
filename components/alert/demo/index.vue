<template>
  <demo-sort>
    <basic />
    <four-style />
    <filled />
    <closable />
    <description />
    <icon />
    <close-text />
    <banner />
    <custom-icon />
    <smooth-closed />
    <error-boundary />
    <action />
    <loop-banner />
    <custom-title-alignment />
  </demo-sort>
</template>
<script lang="ts">
import Banner from './banner.vue';
import Basic from './basic.vue';
import Closable from './closable.vue';
import CloseText from './close-text.vue';
import Description from './description.vue';
import Icon from './icon.vue';
import Action from './action.vue';
import Style from './style.vue';
import Filled from './filled.vue';
import SmoothClosed from './smooth-closed.vue';
import ErrorBoundary from './error-boundary.vue';
import CustomIcon from './custom-icon.vue';
import LoopBanner from './loop-banner.vue';
import CustomTitleAlignment from './custom-title-alignment.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Banner,
    Closable,
    CloseText,
    Description,
    Icon,
    FourStyle: Style, //style 标签报错
    Filled,
    SmoothClosed,
    ErrorBoundary,
    CustomIcon,
    Action,
    LoopBanner,
    CustomTitleAlignment,
  },
  setup() {
    return {};
  },
});
</script>
<style scoped>
:deep([id^='components-alert-demo'] .ant-alert) {
  margin-bottom: 16px;
}
</style>
