<template>
  <demo-sort>
    <basic />
    <size />
    <addonVue />
    <disabled />
    <allow-clear />
    <digit />
    <formatter />
    <keyboardVue />
    <changeOnWheelVue />
    <variant />
    <spinner />
    <disabled-hover-debug />
    <filled-debug />
    <borderless-height-debug />
    <outOfRangeVue />
    <presuffixVue />
    <statusVue />
    <focus-demo />
    <style-class />
    <borderlessVue />
    <prefixVue />
    <iconVue />
    <controls-debug />
    <render-panel />
    <debug-token />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import AllowClear from './allow-clear.vue';
import Digit from './digit.vue';
import Formatter from './formatter.vue';
import Size from './size.vue';
import addonVue from './addon.vue';
import borderlessVue from './borderless.vue';
import keyboardVue from './keyboard.vue';
import outOfRangeVue from './out-of-range.vue';
import prefixVue from './prefix.vue';
import presuffixVue from './presuffix.vue';
import changeOnWheelVue from './change-on-wheel.vue';
import Variant from './variant.vue';
import Spinner from './spinner.vue';
import FocusDemo from './focus.vue';
import StyleClass from './style-class.vue';
import DisabledHoverDebug from './disabled-hover-debug.vue';
import FilledDebug from './filled-debug.vue';
import BorderlessHeightDebug from './borderless-height-debug.vue';
import ControlsDebug from './controls.vue';
import RenderPanel from './render-panel.vue';
import DebugToken from './debug-token.vue';
import statusVue from './status.vue';
import iconVue from './icon.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    iconVue,
    statusVue,
    prefixVue,
    presuffixVue,
    changeOnWheelVue,
    Basic,
    Disabled,
    AllowClear,
    Digit,
    Formatter,
    Size,
    addonVue,
    borderlessVue,
    keyboardVue,
    outOfRangeVue,
    Variant,
    Spinner,
    FocusDemo,
    StyleClass,
    DisabledHoverDebug,
    FilledDebug,
    BorderlessHeightDebug,
    ControlsDebug,
    RenderPanel,
    DebugToken,
  },
});
</script>
