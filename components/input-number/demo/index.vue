<template>
  <demo-sort>
    <basic />
    <size />
    <addonVue />
    <disabled />
    <digit />
    <formatter />
    <keyboardVue />
    <changeOnWheelVue />
    <outOfRangeVue />
    <presuffixVue />
    <statusVue />
    <borderlessVue />
    <prefixVue />
    <iconVue />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Disabled from './disabled.vue';
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
    Digit,
    Formatter,
    Size,
    addonVue,
    borderlessVue,
    keyboardVue,
    outOfRangeVue,
  },
});
</script>
