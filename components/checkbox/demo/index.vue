<template>
  <demo-sort>
    <basic />
    <disabled />
    <controller />
    <group />
    <check-all />
    <layout />
    <style-class />
    <debug-line />
    <debug-disable-popover />
    <debug-group-width />
    <custom-line-width />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import CheckAll from './check-all.vue';
import Controller from './controller.vue';
import Disabled from './disabled.vue';
import Group from './group.vue';
import Layout from './layout.vue';
import StyleClass from './style-class.vue';
import DebugLine from './debug-line.vue';
import DebugDisablePopover from './debug-disable-popover.vue';
import DebugGroupWidth from './debug-group-width.vue';
import CustomLineWidth from './custom-line-width.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    CheckAll,
    Controller,
    Disabled,
    Group,
    Layout,
    StyleClass,
    DebugLine,
    DebugDisablePopover,
    DebugGroupWidth,
    CustomLineWidth,
  },
  setup() {
    return {};
  },
});
</script>
