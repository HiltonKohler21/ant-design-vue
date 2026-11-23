<template>
  <demo-sort>
    <Basic />
    <Checkable />
    <Colorful />
    <Control />
    <HotTags />
    <Icon />
    <Status />
    <BorderLess />
    <Animation />
    <Draggable />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Checkable from './checkable.vue';
import Colorful from './colorful.vue';
import Control from './control.vue';
import HotTags from './hot-tags.vue';
import Icon from './icon.vue';
import Status from './status.vue';
import BorderLess from './border-less.vue';
import Animation from './animation.vue';
import Draggable from './draggable.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Checkable,
    Colorful,
    Control,
    HotTags,
    Icon,
    Status,
    BorderLess,
    Animation,
    Draggable,
  },
});
</script>
