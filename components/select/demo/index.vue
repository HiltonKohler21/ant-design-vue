<template>
  <demo-sort>
    <Basic />
    <Search />
    <SearchFilterOption />
    <SearchMultiField />
    <Multiple />
    <Size />
    <OptionRender />
    <SearchSort />
    <Tags />
    <Optgroup />
    <Coordinate />
    <LabelInValue />
    <AutomaticTokenization />
    <CustomTokenization />
    <SelectUsers />
    <Suffix />
    <CustomDropdownMenu />
    <HideSelected />
    <Variant />
    <FilledDebug />
    <ClearSuffixDebug />
    <CustomTagRender />
    <CustomLabelRender />
    <Responsive />
    <BigData />
    <statusVue />
    <placementVue />
    <PlacementDebug />
    <SearchBox />
    <OptionLabelProp />
    <fieldNamesVue />
    <DebugDemo />
    <RenderPanel />
    <OptionLabelCenter />
    <DebugFlipShift />
    <ComponentToken />
    <MaxCount />
    <StyleClass />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Size from './size.vue';
import Tags from './tags.vue';
import AutomaticTokenization from './automatic-tokenization.vue';
import CustomTokenization from './custom-tokenization.vue';
import LabelInValue from './label-in-value.vue';
import Multiple from './multiple.vue';
import Coordinate from './coordinate.vue';
import Optgroup from './optgroup.vue';
import SearchBox from './search-box.vue';
import Search from './search.vue';
import SearchFilterOption from './search-filter-option.vue';
import SearchMultiField from './search-multi-field.vue';
import SearchSort from './search-sort.vue';
import OptionRender from './option-render.vue';
import SelectUsers from './select-users.vue';
import Suffix from './suffix.vue';
import HideSelected from './hide-selected.vue';
import CustomDropdownMenu from './custom-dropdown-menu.vue';
import CustomTagRender from './custom-tag-render.vue';
import CustomLabelRender from './custom-label-render.vue';
import OptionLabelProp from './option-label-prop.vue';
import BigData from './big-data.vue';
import Responsive from './responsive.vue';
import fieldNamesVue from './field-names.vue';
import placementVue from './placement.vue';
import PlacementDebug from './placement-debug.vue';
import statusVue from './status.vue';
import Variant from './variant.vue';
import FilledDebug from './filled-debug.vue';
import ClearSuffixDebug from './clear-suffix-debug.vue';
import DebugDemo from './debug.vue';
import RenderPanel from './render-panel.vue';
import OptionLabelCenter from './option-label-center.vue';
import DebugFlipShift from './debug-flip-shift.vue';
import ComponentToken from './component-token.vue';
import MaxCount from './maxCount.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    placementVue,
    PlacementDebug,
    statusVue,
    fieldNamesVue,
    Basic,
    Size,
    Tags,
    AutomaticTokenization,
    CustomTokenization,
    LabelInValue,
    Multiple,
    Coordinate,
    Optgroup,
    SearchBox,
    Search,
    SearchFilterOption,
    SearchMultiField,
    SearchSort,
    OptionRender,
    SelectUsers,
    Suffix,
    HideSelected,
    CustomDropdownMenu,
    CustomTagRender,
    CustomLabelRender,
    OptionLabelProp,
    BigData,
    Responsive,
    Variant,
    FilledDebug,
    ClearSuffixDebug,
    DebugDemo,
    RenderPanel,
    OptionLabelCenter,
    DebugFlipShift,
    ComponentToken,
    MaxCount,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>

<style>
[id^='components-select-demo-'] .ant-select {
  margin: 0 8px 10px 0;
}
</style>
