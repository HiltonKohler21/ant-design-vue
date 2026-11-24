<template>
  <demo-sort>
    <basic />
    <disabled />
    <text-and-icon />
    <size />
    <loading />
    <style-class />
    <component-token />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import Text from './text.vue';
import Size from './size.vue';
import Loading from './loading.vue';
import StyleClass from './style-class.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Disabled,
    TextAndIcon: Text, // text 无法识别
    Size,
    Loading,
    StyleClass,
    ComponentToken,
  },
});
</script>
