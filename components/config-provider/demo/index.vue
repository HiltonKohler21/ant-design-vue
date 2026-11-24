<template>
  <demo-sort :cols="1">
    <Locale />
    <Direction />
    <Size />
    <Theme />
    <Wave />
    <HolderRender />
    <ComponentConfig />
    <PrefixCls />
    <UseConfig />
    <Warning />
    <FocusOutlineDebug />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Locale from './locale.vue';
import Direction from './direction.vue';
import Size from './size.vue';
import Theme from './theme.vue';
import Wave from './wave.vue';
import HolderRender from './holderRender.vue';
import ComponentConfig from './component-config.vue';
import PrefixCls from './prefixCls.vue';
import UseConfig from './useConfig.vue';
import Warning from './warning.vue';
import FocusOutlineDebug from './focus-outline-debug.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Locale,
    Direction,
    Size,
    Theme,
    Wave,
    HolderRender,
    ComponentConfig,
    PrefixCls,
    UseConfig,
    Warning,
    FocusOutlineDebug,
  },
});
</script>
