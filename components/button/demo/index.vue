<template>
  <demo-sort>
    <basic />
    <color-variant />
    <icon />
    <icon-position />
    <size />
    <disabled />
    <loading />
    <multiple />
    <ghost />
    <danger />
    <block />
    <button-group />
  </demo-sort>
</template>
<script lang="ts">
import ButtonGroup from './button-group.vue';
import Basic from './basic.vue';
import ColorVariant from './color-variant.vue';
import Disabled from './disabled.vue';
import Ghost from './ghost.vue';
import Icon from './icon.vue';
import IconPosition from './icon-position.vue';
import Loading from './loading.vue';
import Multiple from './multiple.vue';
import Size from './size.vue';
import Block from './block.vue';
import Danger from './danger.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    ButtonGroup,
    Basic,
    ColorVariant,
    Disabled,
    Ghost,
    Icon,
    IconPosition,
    Loading,
    Multiple,
    Size,
    Block,
    Danger,
  },
  setup() {
    return {};
  },
});
</script>
<style scoped>
:deep([id^='components-button-demo-'] .ant-btn) {
  margin-right: 8px;
  margin-bottom: 12px;
}
:deep([id^='components-button-demo-'] .ant-btn-rtl) {
  margin-right: 0;
  margin-left: 8px;
}
:deep([id^='components-button-demo-'] .ant-btn-group > .ant-btn),
:deep([id^='components-button-demo-'] .ant-btn-group > span > .ant-btn) {
  margin-right: 0;
}
</style>
