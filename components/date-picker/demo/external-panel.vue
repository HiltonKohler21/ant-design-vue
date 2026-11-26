<docs>
---
order: 19
title:
  zh-CN: 外部使用面板
  en-US: External use panel
---

## zh-CN

自定义菜单，外置选择面板。

## en-US

Custom menu, external selection panel.
</docs>

<template>
  <a-flex :gap="24" wrap="wrap">
    <div>
      <div :style="{ marginBottom: '12px' }">DatePicker</div>
      <a-dropdown
        arrow
        :open="singleVisible"
        :trigger="['click']"
        @open-change="onSingleDropdownChange"
      >
        <a-space style="cursor: pointer">
          <span>{{ singleDate ? singleDate.format('YYYY-MM-DD') : 'Select date' }}</span>
          <DownOutlined />
        </a-space>
        <template #overlay>
          <a-menu>
            <a-menu-item key="today" @click="selectSingle(dayjs())">Today</a-menu-item>
            <a-menu-item key="tomorrow" @click="selectSingle(dayjs().add(1, 'day'))">
              Tomorrow
            </a-menu-item>
            <a-menu-item key="custom-date">
              <div
                :style="{ position: 'relative', overflow: 'hidden' }"
                @click.stop="singlePanelVisible = true"
              >
                <div>Customize</div>
                <div @click.stop>
                  <a-date-picker
                    :open="singlePanelVisible"
                    :styles="singleHiddenStyles"
                    @change="onSingleDateChange"
                  />
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <div>
      <div :style="{ marginBottom: '12px' }">RangePicker</div>
      <a-dropdown
        arrow
        :open="rangeVisible"
        :trigger="['click']"
        @open-change="onRangeDropdownChange"
      >
        <a-space style="cursor: pointer">
          <span>
            {{
              rangeDates
                ? `${rangeDates[0].format('YYYY-MM-DD')} ~ ${rangeDates[1].format('YYYY-MM-DD')}`
                : 'Select range'
            }}
          </span>
          <DownOutlined />
        </a-space>
        <template #overlay>
          <a-menu>
            <a-menu-item key="7" @click="selectRange([dayjs(), dayjs().add(7, 'day')])">
              7 days
            </a-menu-item>
            <a-menu-item key="30" @click="selectRange([dayjs(), dayjs().add(30, 'day')])">
              30 days
            </a-menu-item>
            <a-menu-item key="custom-range">
              <div
                :style="{ position: 'relative', overflow: 'hidden' }"
                @click.stop="rangePanelVisible = true"
              >
                <div>Customize</div>
                <div @click.stop>
                  <a-range-picker
                    :open="rangePanelVisible"
                    :styles="rangeHiddenStyles"
                    @change="onRangeDateChange"
                  />
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { DatePickerProps } from '@hiltonkohler21/ant-design-vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const singleVisible = ref(false);
const singlePanelVisible = ref(false);
const singleDate = ref<Dayjs | null>(dayjs());

const rangeVisible = ref(false);
const rangePanelVisible = ref(false);
const rangeDates = ref<[Dayjs, Dayjs] | null>([dayjs(), dayjs().add(1, 'day')]);

const singleHiddenStyles: DatePickerProps['styles'] = {
  root: {
    pointerEvents: 'none',
    opacity: 0,
    position: 'absolute',
    bottom: '-12px',
    insetInlineStart: '0px',
  },
};

const rangeHiddenStyles: DatePickerProps['styles'] = {
  root: {
    pointerEvents: 'none',
    opacity: 0,
    position: 'absolute',
    bottom: '0px',
    insetInlineStart: '0px',
  },
};

const onSingleDropdownChange = (open: boolean) => {
  singleVisible.value = open;
  if (!open) singlePanelVisible.value = false;
};

const selectSingle = (date: Dayjs) => {
  singleDate.value = date;
  singleVisible.value = false;
  singlePanelVisible.value = false;
};

const onSingleDateChange = (date: Dayjs | string | null) => {
  singleDate.value = date && typeof date !== 'string' ? date : null;
  singleVisible.value = false;
  singlePanelVisible.value = false;
};

const onRangeDropdownChange = (open: boolean) => {
  rangeVisible.value = open;
  if (!open) rangePanelVisible.value = false;
};

const selectRange = (dates: [Dayjs, Dayjs]) => {
  rangeDates.value = dates;
  rangeVisible.value = false;
  rangePanelVisible.value = false;
};

const onRangeDateChange = (ranges: [Dayjs, Dayjs] | null) => {
  if (ranges?.[0] && ranges?.[1]) {
    rangeDates.value = [ranges[0], ranges[1]];
  } else {
    rangeDates.value = null;
  }
  rangeVisible.value = false;
  rangePanelVisible.value = false;
};
</script>
