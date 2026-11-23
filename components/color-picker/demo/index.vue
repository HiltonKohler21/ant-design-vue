<template>
  <demo-sort>
    <basic />
    <size />
    <controlled />
    <gradient />
    <show-text />
    <disabled />
    <allow-clear />
    <trigger />
    <format />
    <presets />
    <panel-render />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Controlled from './controlled.vue';
import ShowText from './show-text.vue';
import Gradient from './gradient.vue';
import Presets from './presets.vue';
import Size from './size.vue';
import AllowClear from './allow-clear.vue';
import Disabled from './disabled.vue';
import Format from './format.vue';
import Trigger from './trigger.vue';
import PanelRender from './panel-render.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Controlled,
    ShowText,
    Gradient,
    Presets,
    Size,
    AllowClear,
    Disabled,
    Format,
    Trigger,
    PanelRender,
  },
  setup() {
    return {};
  },
});
</script>
