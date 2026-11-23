<docs>
---
order: 5
title:
  zh-CN: 可编辑
  en-US: Editable
---

## zh-CN

提供可编辑的交互能力。

## en-US

Makes Typography editable.
</docs>
<template>
  <a-typography-paragraph :editable="{ onChange: val => (editableStr = val) }">
    {{ editableStr }}
  </a-typography-paragraph>
  <a-typography-paragraph
    :editable="{
      onChange: val => (editableStrWithSuffix = val),
      text: editableStrWithSuffix,
    }"
    :ellipsis="{
      suffix: editableStrWithSuffixSuffixPart,
    }"
  >
    {{ editableStrWithSuffixStartPart }}
  </a-typography-paragraph>
  <a-typography-paragraph
    :editable="{
      icon: h(HighlightOutlined),
      tooltip: 'click to edit text',
      onChange: val => (customIconStr = val),
    }"
  >
    {{ customIconStr }}
  </a-typography-paragraph>
  Trigger edit with:&nbsp;
  <a-radio-group
    :value="stateToRadio"
    @change="e => (chooseTrigger = radioToState(e.target.value))"
  >
    <a-radio value="icon">icon</a-radio>
    <a-radio value="text">text</a-radio>
    <a-radio value="both">both</a-radio>
  </a-radio-group>
  <a-typography-paragraph
    :editable="{
      tooltip: 'click to edit text',
      onChange: val => (clickTriggerStr = val),
      triggerType: chooseTrigger,
    }"
  >
    {{ clickTriggerStr }}
  </a-typography-paragraph>
  <a-typography-paragraph
    :editable="{
      icon: h(HighlightOutlined),
      tooltip: 'click to edit text',
      onChange: val => (customEnterIconStr = val),
      enterIcon: h(CheckOutlined),
    }"
  >
    {{ customEnterIconStr }}
  </a-typography-paragraph>
  <a-typography-paragraph
    :editable="{
      icon: h(HighlightOutlined),
      tooltip: 'click to edit text',
      onChange: val => (noEnterIconStr = val),
      enterIcon: null,
    }"
  >
    {{ noEnterIconStr }}
  </a-typography-paragraph>
  <a-typography-paragraph :editable="{ tooltip: false, onChange: val => (hideTooltipStr = val) }">
    {{ hideTooltipStr }}
  </a-typography-paragraph>
  <a-typography-paragraph
    :editable="{
      onChange: val => (lengthLimitedStr = val),
      maxLength: 50,
      autoSize: { maxRows: 5, minRows: 3 },
    }"
  >
    {{ lengthLimitedStr }}
  </a-typography-paragraph>
  <a-typography-title editable :level="1" style="margin: 0">h1. Ant Design</a-typography-title>
  <a-typography-title editable :level="2" style="margin: 0">h2. Ant Design</a-typography-title>
  <a-typography-title editable :level="3" style="margin: 0">h3. Ant Design</a-typography-title>
  <a-typography-title editable :level="4" style="margin: 0">h4. Ant Design</a-typography-title>
  <a-typography-title editable :level="5" style="margin: 0">h5. Ant Design</a-typography-title>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { CheckOutlined, HighlightOutlined } from '@ant-design/icons-vue';

const editableStr = ref('This is an editable text.');
const editableStrWithSuffix = ref(
  'This is a loooooooooooooooooooooooooooooooong editable text with suffix.',
);
const editableStrWithSuffixStartPart = computed(() => editableStrWithSuffix.value.slice(0, -12));
const editableStrWithSuffixSuffixPart = computed(() => editableStrWithSuffix.value.slice(-12));
const customIconStr = ref('Custom Edit icon and replace tooltip text.');
const clickTriggerStr = ref('Text or icon as trigger - click to start editing.');
const chooseTrigger = ref<('icon' | 'text')[]>(['icon']);
const customEnterIconStr = ref('Editable text with a custom enter icon in edit field.');
const noEnterIconStr = ref('Editable text with no enter icon in edit field.');
const hideTooltipStr = ref('Hide Edit tooltip.');
const lengthLimitedStr = ref('This is an editable text with limited length.');

const radioToState = (input: string): ('icon' | 'text')[] => {
  switch (input) {
    case 'text':
      return ['text'];
    case 'both':
      return ['icon', 'text'];
    case 'icon':
    default:
      return ['icon'];
  }
};

const stateToRadio = computed<string>(() => {
  if (chooseTrigger.value.includes('text')) {
    return chooseTrigger.value.includes('icon') ? 'both' : 'text';
  }
  return 'icon';
});
</script>
