<template>
  <demo-sort>
    <basic />
    <color-variant />
    <debug-color-variant />
    <icon />
    <icon-placement />
    <debug-icon />
    <debug-block />
    <size />
    <disabled />
    <loading />
    <multiple />
    <ghost />
    <danger />
    <block />
    <button-group />
    <chinese-chars-loading />
    <component-token />
    <linear-gradient />
    <wave />
    <chinese-space />
    <custom-disabled-bg />
    <style-class />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import ColorVariant from './color-variant.vue';
import DebugColorVariant from './debug-color-variant.vue';
import Icon from './icon.vue';
import IconPlacement from './icon-placement.vue';
import DebugIcon from './debug-icon.vue';
import DebugBlock from './debug-block.vue';
import Size from './size.vue';
import Disabled from './disabled.vue';
import Loading from './loading.vue';
import Multiple from './multiple.vue';
import Ghost from './ghost.vue';
import Danger from './danger.vue';
import Block from './block.vue';
import ButtonGroup from './button-group.vue';
import ChineseCharsLoading from './chinese-chars-loading.vue';
import ComponentToken from './component-token.vue';
import LinearGradient from './linear-gradient.vue';
import Wave from './wave.vue';
import ChineseSpace from './chinese-space.vue';
import CustomDisabledBg from './custom-disabled-bg.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    ColorVariant,
    DebugColorVariant,
    Icon,
    IconPlacement,
    DebugIcon,
    DebugBlock,
    Size,
    Disabled,
    Loading,
    Multiple,
    Ghost,
    Danger,
    Block,
    ButtonGroup,
    ChineseCharsLoading,
    ComponentToken,
    LinearGradient,
    Wave,
    ChineseSpace,
    CustomDisabledBg,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
