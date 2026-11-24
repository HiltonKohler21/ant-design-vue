<docs>
---
order: 15
version: 4.3.0
title:
  zh-CN: 定制计数能力
  en-US: Custom count logic
---

## zh-CN

在某些场景下，需要定制计数能力（例如 emoji 长度以 1 计算），可以通过 `count` 属性来实现。在该模式下，通过 `count.max` 属性来超出原生 `maxlength` 的限制。

## en-US

It is necessary to customize the counting ability in some scenarios (such as emoji length is counted as 1), which can be achieved through the `count` attribute. Use `count.max` attribute exceeds the limit of the native `maxlength`.
</docs>

<template>
  <a-flex vertical :gap="16">
    <div>
      <a-typography-title :level="5">Exceed Max</a-typography-title>
      <a-input
        :count="{
          show: true,
          max: 10,
        }"
        default-value="Hello, antd!"
      />
    </div>

    <div>
      <a-typography-title :level="5">Emoji count as length 1</a-typography-title>
      <a-input
        :count="{
          show: true,
          strategy: countRunes,
        }"
        default-value="🔥🔥🔥"
      />
    </div>

    <div>
      <a-typography-title :level="5">Not exceed max</a-typography-title>
      <a-input
        :count="{
          show: true,
          max: 6,
          strategy: countRunes,
          exceedFormatter: formatExceed,
        }"
        default-value="🔥 antd"
      />
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
const splitRunes = (txt: string): string[] => {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(txt), (s: { segment: string }) => s.segment);
  }
  return Array.from(txt);
};

const countRunes = (txt: string) => splitRunes(txt).length;

const formatExceed = (txt: string, { max }: { max: number }) =>
  splitRunes(txt).slice(0, max).join('');
</script>
