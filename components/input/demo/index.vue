<template>
  <demo-sort>
    <basic />
    <size />
    <variant />
    <search-variant-debug />
    <filled-debug />
    <addon />
    <compact-style />
    <search-input />
    <search-input-loading />
    <textarea-demo />
    <autosize-textarea />
    <otp />
    <tooltip />
    <presuffix />
    <password-input />
    <allow-clear />
    <show-count />
    <advance-count />
    <statusVue />
    <focus-demo />
    <style-class />
    <group />
    <borderlessVue />
    <borderless-debug />
    <align-debug />
    <textarea-resize />
    <debug-addon />
    <component-token />
  </demo-sort>
</template>

<script>
import Variant from './variant.vue';
import Otp from './otp.vue';
import Basic from './basic.vue';
import AutosizeTextarea from './autosize-textarea.vue';
import Presuffix from './presuffix.vue';
import SearchInput from './search-input.vue';
import SearchInputLoading from './search-input-loading.vue';
import Size from './size.vue';
import Group from './group.vue';
import TextareaDemo from './textarea.vue';
import AllowClear from './allow-clear.vue';
import PasswordInput from './password-input.vue';
import ShowCount from './show-count.vue';
import AdvanceCount from './advance-count.vue';
import CompactStyle from './compact-style.vue';
import FocusDemo from './focus.vue';
import Addon from './addon.vue';
import Tooltip from './tooltip.vue';
import borderlessVue from './borderless.vue';
import statusVue from './status.vue';
import StyleClass from './style-class.vue';
import SearchVariantDebug from './search-variant-debug.vue';
import FilledDebug from './filled-debug.vue';
import BorderlessDebug from './borderless-debug.vue';
import AlignDebug from './align.vue';
import TextareaResize from './textarea-resize.vue';
import DebugAddon from './debug-addon.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Variant,
    Otp,
    statusVue,
    StyleClass,
    ComponentToken,
    Basic,
    AutosizeTextarea,
    Presuffix,
    SearchInput,
    SearchInputLoading,
    Size,
    Group,
    TextareaDemo,
    CompactStyle,
    AdvanceCount,
    FocusDemo,
    Addon,
    Tooltip,
    AllowClear,
    PasswordInput,
    ShowCount,
    borderlessVue,
    SearchVariantDebug,
    FilledDebug,
    BorderlessDebug,
    AlignDebug,
    TextareaResize,
    DebugAddon,
  },
});
</script>
<style></style>
