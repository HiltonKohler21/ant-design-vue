<template>
  <demo-sort :cols="1">
    <basic />
    <control />
    <vertical />
    <collapsible />
    <multiple />
    <lazy />
    <reset />
    <nested />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Vertical from './vertical.vue';
import Multiple from './multiple.vue';
import Collapsible from './collapsible.vue';
import Nested from './nested.vue';
import Control from './control.vue';
import Lazy from './lazy.vue';
import Reset from './reset.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Vertical,
    Multiple,
    Collapsible,
    Nested,
    Control,
    Lazy,
    Reset,
  },
  setup() {
    return {};
  },
});
</script>
