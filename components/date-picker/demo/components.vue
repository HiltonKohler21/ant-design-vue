<docs>
---
order: 18
version: 4.3.0
title:
  zh-CN: 定制面板
  en-US: Customize Panel
---

## zh-CN

通过 `components` 替换对应面板。

## en-US

Replace panel with `components`.
</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker :show-now="false" :components="{ date: MyDatePanel }" @change="onChange" />
  </a-space>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, ref, watch } from 'vue';
import { Button, Flex, Slider, Typography } from 'ant-design-vue';
import type { DatePickerProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const MyDatePanel = defineComponent({
  name: 'MyDatePanel',
  props: {
    value: { type: Object as () => Dayjs | null, default: null },
    onSelect: { type: Function as unknown as () => (date: Dayjs) => void, required: true },
    onHover: {
      type: Function as unknown as () => (date: Dayjs | null) => void,
      default: undefined,
    },
  },
  setup(props) {
    const startDate = dayjs().date(1).month(0);
    const innerValue = ref<Dayjs>(props.value || startDate);

    watch(
      () => props.value,
      val => {
        if (val) {
          innerValue.value = val;
        }
      },
    );

    const endDate = startDate.add(1, 'year').add(-1, 'day');
    const dateCount = endDate.diff(startDate, 'day');

    const sliderValue = computed(() =>
      Math.min(Math.max(0, innerValue.value.diff(startDate, 'day')), dateCount),
    );

    return () =>
      h(
        Flex,
        {
          vertical: true,
          gap: 'small',
          style: { padding: '16px', width: '280px', maxWidth: '100%' },
        },
        () => [
          h(
            Typography.Title,
            { level: 4, style: { margin: '0px' }, title: "no, it's not" },
            () => 'The BEST Picker Panel',
          ),
          h(Slider, {
            min: 0,
            max: dateCount,
            value: sliderValue.value,
            onChange: (nextValue: number | [number, number]) => {
              const offset = Array.isArray(nextValue) ? nextValue[0] : nextValue;
              const nextDate = startDate.add(offset, 'day');
              innerValue.value = nextDate;
              props.onHover?.(nextDate);
            },
            tipFormatter: (nextValue?: number) =>
              startDate.add(nextValue || 0, 'day').format('YYYY-MM-DD'),
          }),
          h(
            Button,
            {
              type: 'primary',
              onClick: () => {
                props.onSelect(innerValue.value);
              },
            },
            () => "That's It!",
          ),
        ],
      );
  },
});
</script>
