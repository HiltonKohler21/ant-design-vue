<template>
  <demo-sort>
    <basic />
    <options />
    <custom />
    <non-case-sensitive />
    <certain-category />
    <uncertain-category />
    <statusVue />
    <variantVue />
    <allow-clear />
    <style-class />
    <border-less />
    <customize-clear-debug />
    <disabled-custom-debug />
    <disabled-in-form-debug />
    <filled-custom-debug />
    <form-debug />
    <auto-complete-and-select />
    <render-panel />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Options from './options.vue';
import Custom from './custom.vue';
import NonCaseSensitive from './non-case-sensitive.vue';
import CertainCategory from './certain-category.vue';
import UncertainCategory from './uncertain-category.vue';
import statusVue from './status.vue';
import variantVue from './variant.vue';
import BorderLess from './border-less.vue';
import AllowClear from './allow-clear.vue';
import StyleClass from './style-class.vue';
import CustomizeClearDebug from './customize-clear-debug.vue';
import DisabledCustomDebug from './disabled-custom-debug.vue';
import DisabledInFormDebug from './disabled-in-form-debug.vue';
import FilledCustomDebug from './filled-custom-debug.vue';
import FormDebug from './form-debug.vue';
import AutoCompleteAndSelect from './AutoComplete-and-Select.vue';
import RenderPanel from './render-panel.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    variantVue,
    Basic,
    Options,
    Custom,
    NonCaseSensitive,
    CertainCategory,
    UncertainCategory,
    BorderLess,
    AllowClear,
    StyleClass,
    CustomizeClearDebug,
    DisabledCustomDebug,
    DisabledInFormDebug,
    FilledCustomDebug,
    FormDebug,
    AutoCompleteAndSelect,
    RenderPanel,
  },
  setup() {
    return {};
  },
});
</script>
