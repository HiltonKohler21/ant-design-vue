<template>
  <demo-sort :cols="1">
    <Basic />
    <TitleDemo />
    <ParagraphDebug />
    <TextDemo />
    <Shimmer />
    <Editable />
    <Copyable />
    <Ellipsis />
    <EllipsisControlled />
    <EllipsisMiddle />
    <EllipsisDebug />
    <Suffix />
    <ComponentTokenDebug />
    <LinkDangerDebug />
    <TableDemo />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import TitleDemo from './title.vue';
import ParagraphDebug from './paragraph-debug.vue';
import TextDemo from './text.vue';
import Shimmer from './shimmer.vue';
import Editable from './editable.vue';
import Copyable from './copyable.vue';
import Ellipsis from './ellipsis.vue';
import EllipsisControlled from './ellipsis-controlled.vue';
import EllipsisMiddle from './ellipsis-middle.vue';
import EllipsisDebug from './ellipsis-debug.vue';
import Suffix from './suffix.vue';
import ComponentTokenDebug from './componentToken-debug.vue';
import LinkDangerDebug from './link-danger-debug.vue';
import TableDemo from './table.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    TitleDemo,
    ParagraphDebug,
    TextDemo,
    Shimmer,
    Editable,
    Copyable,
    Ellipsis,
    EllipsisControlled,
    EllipsisMiddle,
    EllipsisDebug,
    Suffix,
    ComponentTokenDebug,
    LinkDangerDebug,
    TableDemo,
  },
  setup() {
    return {};
  },
});
</script>
