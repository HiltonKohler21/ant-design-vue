<template>
  <demo-sort>
    <basic></basic>
    <type></type>
    <shape></shape>
    <description></description>
    <tooltip></tooltip>
    <group></group>
    <group-menu></group-menu>
    <controlled></controlled>
    <placement></placement>
    <draggable></draggable>
    <back-top></back-top>
    <progress-ring></progress-ring>
    <badge></badge>
    <badge-debug></badge-debug>
    <style-class></style-class>
    <render-panel></render-panel>
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
import Controlled from './controlled.vue';
import Placement from './placement.vue';
import Draggable from './draggable.vue';
import BackTop from './back-top.vue';
import ProgressRing from './progress-ring.vue';
import Badge from './badge.vue';
import BadgeDebug from './badge-debug.vue';
import StyleClass from './style-class.vue';
import RenderPanel from './render-panel.vue';

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
    Controlled,
    Placement,
    Draggable,
    BackTop,
    ProgressRing,
    Badge,
    BadgeDebug,
    StyleClass,
    RenderPanel,
  },
  setup() {
    return {};
  },
});
</script>
