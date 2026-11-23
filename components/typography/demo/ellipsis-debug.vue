<docs>
---
order: 10
debug: true
title:
  zh-CN: 省略号 Debug
  en-US: Ellipsis Debug
---

## zh-CN

多行文本省略。页面底部包含「可复制 + 省略」时 tooltip 行为的调试区块，便于验证：悬停文字显示省略 tooltip，悬停复制按钮仅显示复制 tooltip，从复制按钮移回文字时省略 tooltip 再次出现。

## en-US

Multiple line ellipsis support. The bottom section is a debug block for copyable + ellipsis tooltip behavior: hover text for ellipsis tooltip, hover copy button for copy-only tooltip, then move back to text to confirm the ellipsis tooltip shows again.
</docs>
<template>
  <a-switch v-model:checked="longText" checked-children="Long Text" />
  <a-switch v-model:checked="copyable" />
  <a-switch v-model:checked="editable" />
  <a-switch v-model:checked="expandable" />
  <a-slider v-model:value="rows" :min="1" :max="10" />
  <a-typography-paragraph
    v-if="longText"
    :ellipsis="{ rows, expandable }"
    :copyable="copyable"
    :editable="editable"
  >
    Ant Design, a design language for background applications, is refined by Ant UED Team. This is a
    nest sample
    <a-typography-text code strong delete>Test</a-typography-text>
    case. Bnt Design, a design language for background applications, is refined by Ant UED Team. Cnt
    Design, a design language for background applications, is refined by Ant UED Team. Dnt Design, a
    design language for background applications, is refined by Ant UED Team. Ent Design, a design
    language for background applications, is refined by Ant UED Team.
  </a-typography-paragraph>
  <a-typography-paragraph
    v-else
    :ellipsis="{ rows, expandable }"
    :copyable="copyable"
    :editable="editable"
  >
    Hello World
  </a-typography-paragraph>

  <a-typography-text :style="{ maxWidth: '400px', fontSize: '24px' }" copyable ellipsis>
    {{ templateStr }}
  </a-typography-text>

  <br />

  <a-typography-text :style="{ maxWidth: '400px', fontSize: '12px' }" copyable ellipsis>
    {{ templateStr }}
  </a-typography-text>

  <br />

  <a-typography-text :style="{ width: '400px', fontSize: '24px' }" copyable ellipsis>
    {{ templateStr }}
  </a-typography-text>

  <br />

  <a-typography-text :style="{ width: '100px' }" ellipsis copyable>
    Ant Design is a design language for background applications, is refined by Ant UED Team.
  </a-typography-text>

  <p>
    [Before]
    <a-typography-text ellipsis>not ellipsis</a-typography-text>
    [After]
  </p>

  <div :style="{ display }">
    <a-typography-text :style="{ width: '100px' }" :ellipsis="{ tooltip: 'I am ellipsis now!' }">
      默认 display none 样式的超长文字， 悬停 tooltip 失效了
    </a-typography-text>
  </div>

  <a-typography-paragraph
    :style="{ width: '300px' }"
    :ellipsis="{ rows: 3, expandable: true, symbol: h('span', 'Open') }"
  >
    {{ templateStr.slice(0, 60) }}
    <span style="font-size: 5em">ANTD</span>
    {{ templateStr.slice(60) }}
  </a-typography-paragraph>

  <pre><a-typography-paragraph :ellipsis="{ rows: 2, expandable: true }">{{ text }}</a-typography-paragraph></pre>

  <br />

  <a-typography-text :style="{ width: '100px', whiteSpace: 'nowrap' }" ellipsis copyable>
    {{ templateStr }}
  </a-typography-text>

  <div style="margin-top: 24px">
    <div style="margin-bottom: 8px; font-size: 12px; color: #666">
      <strong>Debug: copyable + ellipsis tooltips</strong>
      <br />
      1. Hover the text → ellipsis tooltip (full content) should show.
      <br />
      2. Hover the copy button → only &quot;Copy&quot; / &quot;Copied&quot; tooltip should show.
      <br />
      3. Move from copy button back to the text (without leaving the block) → ellipsis tooltip
      should show again.
    </div>
    <a-typography-text
      :style="{ width: '280px', display: 'block' }"
      :ellipsis="{ tooltip: true }"
      copyable
    >
      {{ templateStr }}
    </a-typography-text>
  </div>
</template>
<script lang="ts" setup>
import { h, onBeforeUnmount, onMounted, ref } from 'vue';

const templateStr =
  'In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the efficiency of development.';

const text = `this is a multiline
  text that has many
  lines and
    - render like this
    - and this

  and that`;

const rows = ref(1);
const longText = ref(true);
const copyable = ref(false);
const editable = ref(false);
const expandable = ref(false);
const display = ref('none');

let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  timer = setTimeout(() => {
    display.value = 'block';
  }, 100);
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
