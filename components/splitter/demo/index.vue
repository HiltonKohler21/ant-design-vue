<template>
  <demo-sort :cols="1">
    <size />
    <basic />
    <control />
    <vertical />
    <collapsible />
    <collapsible-icon />
    <multiple />
    <group />
    <nested />
    <lazy />
    <customize />
    <style-class />
    <reset />
    <nested-in-tabs />
    <debug />
    <size-mix />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Size from './size.vue';
import Basic from './basic.vue';
import Control from './control.vue';
import Vertical from './vertical.vue';
import Collapsible from './collapsible.vue';
import CollapsibleIcon from './collapsibleIcon.vue';
import Multiple from './multiple.vue';
import Group from './group.vue';
import Nested from './nested.vue';
import Lazy from './lazy.vue';
import Customize from './customize.vue';
import StyleClass from './style-class.vue';
import Reset from './reset.vue';
import NestedInTabs from './nested-in-tabs.vue';
import Debug from './debug.vue';
import SizeMix from './size-mix.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Size,
    Basic,
    Control,
    Vertical,
    Collapsible,
    CollapsibleIcon,
    Multiple,
    Group,
    Nested,
    Lazy,
    Customize,
    StyleClass,
    Reset,
    NestedInTabs,
    Debug,
    SizeMix,
  },
  setup() {
    return {};
  },
});
</script>
