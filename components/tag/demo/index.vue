<template>
  <demo-sort>
    <Basic />
    <Colorful />
    <Control />
    <Checkable />
    <Animation />
    <Icon />
    <Status />
    <Customize />
    <Draggable />
    <ComponentToken />
    <Disabled />
    <StyleClass />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Colorful from './colorful.vue';
import Control from './control.vue';
import Checkable from './checkable.vue';
import Animation from './animation.vue';
import Icon from './icon.vue';
import Status from './status.vue';
import Customize from './customize.vue';
import Draggable from './draggable.vue';
import ComponentToken from './component-token.vue';
import Disabled from './disabled.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Colorful,
    Control,
    Checkable,
    Animation,
    Icon,
    Status,
    Customize,
    Draggable,
    ComponentToken,
    Disabled,
    StyleClass,
  },
});
</script>
