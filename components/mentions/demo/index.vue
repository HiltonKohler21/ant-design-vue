<template>
  <demo-sort>
    <basic />
    <size />
    <variant />
    <async />
    <FormMentions />
    <prefix />
    <readonly />
    <placement />
    <popup-render />
    <allow-clear />
    <auto-size />
    <autosize-textarea-debug />
    <statusVue />
    <style-class />
    <render-panel />
    <component-token />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import Size from './size.vue';
import Async from './async.vue';
import FormMentions from './form.vue';
import Prefix from './prefix.vue';
import Readonly from './readonly.vue';
import Placement from './placement.vue';
import PopupRender from './popupRender.vue';
import AllowClear from './allowClear.vue';
import AutoSize from './autoSize.vue';
import AutosizeTextareaDebug from './autosize-textarea-debug.vue';
import StyleClass from './style-class.vue';
import RenderPanel from './render-panel.vue';
import statusVue from './status.vue';
import Variant from './variant.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    Basic,
    Size,
    Async,
    Prefix,
    Readonly,
    Placement,
    PopupRender,
    AllowClear,
    AutoSize,
    AutosizeTextareaDebug,
    StyleClass,
    RenderPanel,
    FormMentions,
    Variant,
    ComponentToken,
  },
});
</script>
