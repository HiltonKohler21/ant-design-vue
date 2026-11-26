<docs>
---
order: 4
title:
  zh-CN: 渐变色
  en-US: Gradients
---

## zh-CN

展示 6 组渐变流光配色，可切换查看不同效果。

## en-US

Display six gradient beam palettes and switch between them.
</docs>

<template>
  <a-flex vertical :gap="16" :style="{ maxWidth: '100%' }">
    <a-segmented v-model:value="currentPresetKey" block size="small" :options="segmentedOptions" />
    <a-border-beam :color="currentPreset.color">
      <a-card
        :title="currentPreset.name"
        :styles="{
          body: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          },
        }"
      >
        <template #extra>
          <a-tag variant="filled">{{ currentPreset.usage }}</a-tag>
        </template>
        <a-typography-text type="secondary">{{ currentPreset.description }}</a-typography-text>
        <a-flex :gap="8" wrap="wrap">
          <a-tag
            v-for="item in currentPreset.color"
            :key="`${item.color}-${item.percent}`"
            :color="item.color"
            variant="filled"
          >
            {{ item.color }} · {{ item.percent }}%
          </a-tag>
        </a-flex>
        <a-typography-text type="secondary">
          Stop positions use the public 0-100 input range.
        </a-typography-text>
      </a-card>
    </a-border-beam>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { BorderBeamGradient } from '@hiltonkohler21/ant-design-vue';

interface PresetItem {
  key: string;
  name: string;
  usage: string;
  description: string;
  color: BorderBeamGradient;
}

const presets: PresetItem[] = [
  {
    key: 'ocean',
    name: 'Ocean',
    usage: 'Dashboard',
    description: 'A calm blue-green accent that works well for data views and cloud tooling.',
    color: [
      { color: '#1677ff', percent: 0 },
      { color: '#36cfc9', percent: 52 },
      { color: '#95de64', percent: 100 },
    ],
  },
  {
    key: 'sunset',
    name: 'Sunset',
    usage: 'Upgrade',
    description: 'A warm highlight for upgrade prompts, featured cards, and marketing blocks.',
    color: [
      { color: '#ff7a45', percent: 0 },
      { color: '#ff4d4f', percent: 49 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
  {
    key: 'aurora',
    name: 'Aurora',
    usage: 'AI',
    description:
      'A vivid cool-toned beam suited for AI assistants, copilots, and automation panels.',
    color: [
      { color: '#7c3aed', percent: 0 },
      { color: '#06b6d4', percent: 57 },
      { color: '#67e8f9', percent: 100 },
    ],
  },
  {
    key: 'forest',
    name: 'Forest',
    usage: 'Recommendation',
    description:
      'A bright natural palette that feels good on recommendation and growth-oriented cards.',
    color: [
      { color: '#22c55e', percent: 0 },
      { color: '#a3e635', percent: 54 },
      { color: '#facc15', percent: 100 },
    ],
  },
  {
    key: 'ember',
    name: 'Ember',
    usage: 'Alert',
    description: 'A high-energy warm gradient for important alerts, launch cards, and hot paths.',
    color: [
      { color: '#fa541c', percent: 0 },
      { color: '#ff7875', percent: 46 },
      { color: '#ffd666', percent: 100 },
    ],
  },
  {
    key: 'nebula',
    name: 'Nebula',
    usage: 'Labs',
    description: 'A cool purple-pink mix that fits experimental modules and product lab surfaces.',
    color: [
      { color: '#2f54eb', percent: 0 },
      { color: '#722ed1', percent: 44 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
];

const segmentedOptions = presets.map(preset => ({
  label: preset.name,
  value: preset.key,
}));

const currentPresetKey = ref<string>(presets[0].key);
const currentPreset = computed(
  () => presets.find(preset => preset.key === currentPresetKey.value) ?? presets[0],
);
</script>
