<template>
  <demo-sort :cols="1">
    <Basic />
    <Align />
    <More />
    <Changer />
    <Jump />
    <Mini />
    <Simple />
    <Controlled />
    <Total />
    <All />
    <ItemRender />
    <CustomChanger />
    <Components />
    <Wireframe />
    <ComponentToken />
    <VariantDebug />
    <StyleClass />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Align from './align.vue';
import More from './more.vue';
import Changer from './changer.vue';
import Jump from './jump.vue';
import Mini from './mini.vue';
import Simple from './simple.vue';
import Controlled from './controlled.vue';
import Total from './total.vue';
import All from './all.vue';
import ItemRender from './itemRender.vue';
import CustomChanger from './custom-changer.vue';
import Components from './components.vue';
import Wireframe from './wireframe.vue';
import ComponentToken from './component-token.vue';
import VariantDebug from './variant-debug.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Align,
    More,
    Changer,
    Jump,
    Mini,
    Simple,
    Controlled,
    Total,
    All,
    ItemRender,
    CustomChanger,
    Components,
    Wireframe,
    ComponentToken,
    VariantDebug,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
