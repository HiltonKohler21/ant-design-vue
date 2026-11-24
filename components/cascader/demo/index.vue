<template>
  <demo-sort>
    <basic />
    <default-value />
    <custom-trigger />
    <hover />
    <disabled-option />
    <change-on-select />
    <multipleVue />
    <show-checked-strategy />
    <size />
    <custom-render />
    <search />
    <lazy />
    <fields-name />
    <suffix />
    <custom-dropdown />
    <placement />
    <variantVue />
    <status />
    <style-class />
    <panelVue />
    <tagRender />
    <ellipsis-debug />
    <render-panel />
    <component-token />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import DefaultValue from './default-value.vue';
import ChangeOnSelect from './change-on-select.vue';
import CustomRender from './custom-render.vue';
import CustomTrigger from './custom-trigger.vue';
import DisabledOption from './disabled-option.vue';
import Hover from './hover.vue';
import Lazy from './lazy.vue';
import Search from './search.vue';
import Size from './size.vue';
import FieldsName from './fields-name.vue';
import Suffix from './suffix.vue';
import multipleVue from './multiple.vue';
import ShowCheckedStrategy from './showCheckedStrategy.vue';
import CustomDropdown from './custom-dropdown.vue';
import Placement from './placement.vue';
import Status from './status.vue';
import tagRender from './tagRender.vue';
import panelVue from './panel.vue';
import variantVue from './variant.vue';
import StyleClass from './style-class.vue';
import EllipsisDebug from './ellipsis-debug.vue';
import RenderPanel from './render-panel.vue';
import ComponentToken from './component-token.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    DefaultValue,
    ChangeOnSelect,
    CustomRender,
    CustomTrigger,
    DisabledOption,
    Hover,
    Lazy,
    Search,
    Size,
    FieldsName,
    Suffix,
    multipleVue,
    ShowCheckedStrategy,
    CustomDropdown,
    Placement,
    Status,
    tagRender,
    panelVue,
    variantVue,
    StyleClass,
    EllipsisDebug,
    RenderPanel,
    ComponentToken,
  },
});
</script>
<style>
[id^='components-cascader-demo-'] .ant-cascader {
  width: 300px;
  max-width: 100%;
}
</style>
