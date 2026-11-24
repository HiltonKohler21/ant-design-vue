<template>
  <demo-sort :cols="1">
    <basic />
    <horizontal />
    <static />
    <on-click />
    <customize-highlight />
    <target-offset />
    <target-offset-per-link />
    <on-change />
    <replace />
    <legacy-anchor />
    <style-class />
    <component-token />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Horizontal from './horizontal.vue';
import Static from './static.vue';
import OnClick from './onClick.vue';
import CustomizeHighlight from './customizeHighlight.vue';
import TargetOffset from './targetOffset.vue';
import TargetOffsetPerLink from './targetOffset-per-link.vue';
import OnChange from './onChange.vue';
import Replace from './replace.vue';
import LegacyAnchor from './legacy-anchor.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Horizontal,
    Static,
    OnClick,
    CustomizeHighlight,
    TargetOffset,
    TargetOffsetPerLink,
    OnChange,
    Replace,
    LegacyAnchor,
    StyleClass,
    ComponentToken,
  },
  setup() {
    return {};
  },
});
</script>
