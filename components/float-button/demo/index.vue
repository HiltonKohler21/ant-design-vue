<template>
  <demo-sort>
    <basic></basic>
    <type></type>
    <shape></shape>
    <description></description>
    <tooltip></tooltip>
    <group></group>
    <group-menu></group-menu>
    <back-top></back-top>
    <badge></badge>
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Type from './type.vue';
import Shape from './shape.vue';
import Description from './description.vue';
import Tooltip from './tooltip.vue';
import group from './group.vue';
import GroupMenu from './group-menu.vue';
import BackTop from './back-top.vue';
import Badge from './badge.vue';

import { defineComponent } from 'vue';
import US from '../index.en-US.md';
import CN from '../index.zh-CN.md';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Type,
    Shape,
    Description,
    Tooltip,
    group,
    GroupMenu,
    BackTop,
    Badge,
  },
  setup() {
    return {};
  },
});
</script>
