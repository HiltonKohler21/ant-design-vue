<template>
  <demo-sort>
    <Basic />
    <value />
    <Size />
    <NeedConfirm />
    <Disabled />
    <HideColumn />
    <IntervalOptions />
    <Addon />
    <Hours />
    <ChangeOnScroll />
    <ColoredPopup />
    <RangePicker />
    <Variant />
    <statusVue />
    <Suffix />
    <StyleClass />
    <Bordered />
    <placementVue />
    <RenderPanel />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Value from './value.vue';
import Hours from './12hours.vue';
import Addon from './addon.vue';
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import HideColumn from './hide-column.vue';
import IntervalOptions from './interval-options.vue';
import ChangeOnScroll from './change-on-scroll.vue';
import ColoredPopup from './colored-popup.vue';
import Size from './size.vue';
import Suffix from './suffix.vue';
import StyleClass from './style-class.vue';
import Bordered from './bordered.vue';
import Variant from './variant.vue';
import NeedConfirm from './need-confirm.vue';
import RangePicker from './range-picker.vue';
import placementVue from './placement.vue';
import statusVue from './status.vue';
import RenderPanel from './render-panel.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Value,
    placementVue,
    statusVue,
    Hours,
    Addon,
    Basic,
    Disabled,
    HideColumn,
    IntervalOptions,
    ChangeOnScroll,
    ColoredPopup,
    Size,
    Suffix,
    StyleClass,
    Bordered,
    Variant,
    NeedConfirm,
    RangePicker,
    RenderPanel,
  },
});
</script>
<style>
[id^='components-time-picker-demo-'] .ant-picker {
  margin: 0 8px 12px 0;
  max-width: 100%;
}
</style>
