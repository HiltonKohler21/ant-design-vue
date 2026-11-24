<template>
  <demo-sort>
    <basic />
    <size />
    <variant />
    <addon />
    <search-input />
    <search-input-loading />
    <textarea-resize />
    <autosize-textarea />
    <otp />
    <tooltip />
    <presuffix />
    <password-input />
    <allow-clear />
    <show-count />
    <statusVue />
    <style-class />
    <group />
    <borderlessVue />
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
import TextareaResize from './textarea.vue';
import AllowClear from './allow-clear.vue';
import PasswordInput from './password-input.vue';
import ShowCount from './show-count.vue';
import Addon from './addon.vue';
import Tooltip from './tooltip.vue';
import borderlessVue from './borderless.vue';
import statusVue from './status.vue';
import StyleClass from './style-class.vue';
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
    TextareaResize,
    Addon,
    Tooltip,
    AllowClear,
    PasswordInput,
    ShowCount,
    borderlessVue,
  },
});
</script>
<style></style>
