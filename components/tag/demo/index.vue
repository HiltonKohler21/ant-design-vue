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
    <CheckableGroup />
    <Variant />
    <HotTags />
    <BorderLess />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Checkable from './checkable.vue';
import CheckableGroup from './checkable-group.vue';
import Colorful from './colorful.vue';
import Variant from './variant.vue';
import Control from './control.vue';
import HotTags from './hot-tags.vue';
import Icon from './icon.vue';
import Status from './status.vue';
import Customize from './customize.vue';
import BorderLess from './border-less.vue';
import Animation from './animation.vue';
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
    Checkable,
    CheckableGroup,
    Colorful,
    Variant,
    Control,
    HotTags,
    Icon,
    Status,
    Customize,
    BorderLess,
    Animation,
    Draggable,
    ComponentToken,
    Disabled,
    StyleClass,
  },
});
</script>
