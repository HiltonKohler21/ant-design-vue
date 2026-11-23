<template>
  <demo-sort>
    <basic />
    <disabled />
    <controller />
    <group />
    <check-all />
    <layout />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import CheckAll from './check-all.vue';
import Controller from './controller.vue';
import Disabled from './disabled.vue';
import Group from './group.vue';
import Layout from './layout.vue';
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
  },
  setup() {
    return {};
  },
});
</script>
