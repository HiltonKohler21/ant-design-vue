<template>
  <demo-sort :cols="1">
    <basic />
    <twotone />
    <custom />
    <iconfont />
    <script-url />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import IconDisplay from '../../../site/src/theme/template/IconDisplay';
import Basic from './basic.vue';
import Custom from './custom.vue';
import Iconfont from './iconfont.vue';
import ScriptUrl from './scriptUrl.vue';
import Twotone from './two-tone.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  CN,
  US,
  beforeExamples: {
    id: 'list-of-icons',
    title: {
      'zh-CN': '图标列表',
      'en-US': 'List of icons',
    },
    component: markRaw(IconDisplay),
  },
  components: {
    Basic,
    Custom,
    Iconfont,
    ScriptUrl,
    Twotone,
  },
});
</script>
