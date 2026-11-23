<template>
  <demo-sort :cols="1">
    <basic />
    <virtual />
    <group />
    <horizontal />
    <rich />
    <infinite />
    <style-class />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Virtual from './virtual.vue';
import Group from './group.vue';
import Horizontal from './horizontal.vue';
import Rich from './rich.vue';
import Infinite from './infinite.vue';
import StyleClass from './style-class.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Virtual,
    Group,
    Horizontal,
    Rich,
    Infinite,
    StyleClass,
  },
});
</script>
