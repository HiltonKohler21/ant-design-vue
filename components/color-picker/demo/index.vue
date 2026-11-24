<template>
  <demo-sort>
    <basic />
    <size />
    <controlled />
    <gradient />
    <show-text />
    <text-render />
    <disabled />
    <disabled-alpha />
    <allow-clear />
    <trigger />
    <trigger-event />
    <format />
    <presets />
    <presets-line-gradient />
    <panel-render />
    <style-class />
    <pure-panel />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Controlled from './controlled.vue';
import ShowText from './show-text.vue';
import TextRender from './text-render.vue';
import Gradient from './gradient.vue';
import Presets from './presets.vue';
import PresetsLineGradient from './presets-line-gradient.vue';
import Size from './size.vue';
import AllowClear from './allow-clear.vue';
import Disabled from './disabled.vue';
import DisabledAlpha from './disabled-alpha.vue';
import Format from './format.vue';
import Trigger from './trigger.vue';
import TriggerEvent from './trigger-event.vue';
import PanelRender from './panel-render.vue';
import StyleClass from './style-class.vue';
import PurePanel from './pure-panel.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Controlled,
    ShowText,
    TextRender,
    Gradient,
    Presets,
    PresetsLineGradient,
    Size,
    AllowClear,
    Disabled,
    DisabledAlpha,
    Format,
    Trigger,
    TriggerEvent,
    PanelRender,
    StyleClass,
    PurePanel,
  },
  setup() {
    return {};
  },
});
</script>
