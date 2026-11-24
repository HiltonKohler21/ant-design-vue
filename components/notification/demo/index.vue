<template>
  <demo-sort>
    <hook />
    <duratioin />
    <with-icon />
    <with-btn />
    <custom-icon />
    <placement />
    <update />
    <stack />
    <show-with-progress />
    <basic />
    <custom-style />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Hook from './hook.vue';
import Duratioin from './duration.vue';
import WithIcon from './with-icon.vue';
import CustomIcon from './custom-icon.vue';
import WithBtn from './with-btn.vue';
import CustomStyle from './custom-style.vue';
import Placement from './placement.vue';
import Update from './update.vue';
import ShowWithProgress from './show-with-progress.vue';
import Stack from './stack.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Duratioin,
    WithIcon,
    CustomIcon,
    WithBtn,
    CustomStyle,
    Placement,
    Update,
    Hook,
    ShowWithProgress,
    Stack,
    ComponentToken,
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
