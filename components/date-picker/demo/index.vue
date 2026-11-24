<template>
  <demo-sort>
    <Basic />
    <RangePicker />
    <Multiple />
    <MultipleDebug />
    <NeedConfirm />
    <Switchable />
    <Format />
    <Time />
    <Mask />
    <DateRange />
    <Disabled />
    <DisabledDate />
    <AllowEmpty />
    <SelectInRnage />
    <PresettedRanges />
    <ExtraFooter />
    <Size />
    <DateRender />
    <CellRender />
    <ComponentsDemo />
    <ExternalPanel />
    <BuddhistEra />
    <statusVue />
    <Variant />
    <StyleClass />
    <FilledDebug />
    <placementVue />
    <Mode />
    <start-end />
    <Suffix />
    <Bordered />
    <text-demo />
    <RenderPanel />
    <ComponentToken />
    <SuffixDebug />
  </demo-sort>
</template>
<script lang="ts">
import StartEnd from './start-end.vue';
import TextDemo from './text.vue';
import Basic from './basic.vue';
import DateRender from './date-render.vue';
import CellRender from './cell-render.vue';
import ComponentsDemo from './components.vue';
import ExternalPanel from './external-panel.vue';
import BuddhistEra from './buddhist-era.vue';
import DisabledDate from './disabled-date.vue';
import Disabled from './disabled.vue';
import AllowEmpty from './allow-empty.vue';
import ExtraFooter from './extra-footer.vue';
import Format from './format.vue';
import Mask from './mask.vue';
import DateRange from './date-range.vue';
import Mode from './mode.vue';
import PresettedRanges from './presetted-ranges.vue';
import SelectInRnage from './select-in-range.vue';
import Size from './size.vue';
import Switchable from './switchable.vue';
import Time from './time.vue';
import Suffix from './suffix.vue';
import SuffixDebug from './suffix-debug.vue';
import Bordered from './bordered.vue';
import Variant from './variant.vue';
import StyleClass from './style-class.vue';
import FilledDebug from './filled-debug.vue';
import Multiple from './multiple.vue';
import MultipleDebug from './multiple-debug.vue';
import NeedConfirm from './need-confirm.vue';
import RangePicker from './range-picker.vue';
import placementVue from './placement.vue';
import statusVue from './status.vue';
import RenderPanel from './render-panel.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    TextDemo,
    StartEnd,
    statusVue,
    placementVue,
    Basic,
    DateRender,
    CellRender,
    ComponentsDemo,
    ExternalPanel,
    BuddhistEra,
    DisabledDate,
    Disabled,
    AllowEmpty,
    ExtraFooter,
    Format,
    Mask,
    DateRange,
    Mode,
    PresettedRanges,
    Size,
    Switchable,
    Time,
    Suffix,
    SuffixDebug,
    SelectInRnage,
    Bordered,
    Variant,
    StyleClass,
    FilledDebug,
    Multiple,
    MultipleDebug,
    NeedConfirm,
    RangePicker,
    RenderPanel,
    ComponentToken,
  },
});
</script>
<style>
[id^='components-date-picker-demo-'] .ant-picker {
  margin: 0 8px 12px 0;
  max-width: 100%;
}
</style>
