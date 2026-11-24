<docs>
---
order: 2
title:
  zh-CN: 跨日期事件
  en-US: Event Range
---

## zh-CN

通过 `cellRender` 渲染跨日期事件范围。示例根据日期判断事件的开始、持续、结束或单日状态，并用连续色条展示。

## en-US

Render event ranges across days with `cellRender`. The example calculates whether each date is the start, middle, end, or a single-day event and draws compact range bars.
</docs>

<template>
  <div class="demo-calendar-event-range">
    <a-calendar
      :default-value="defaultValue"
      :class-names="{ itemContent: 'calendar-event-range-item-content' }"
    >
      <template #cellRender="{ current, info }">
        <div v-if="info.type === 'date'" class="event-cell">
          <div class="event-list">
            <span
              v-for="event in getCurrentEvents(current)"
              :key="event.key"
              :class="['event-bar', `event-bar-${getRangePosition(current, event)}`]"
              :style="{ backgroundColor: event.color }"
            >
              {{
                getRangePosition(current, event) === 'start' ||
                getRangePosition(current, event) === 'single'
                  ? event.title
                  : ''
              }}
            </span>
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { theme } from 'ant-design-vue';

interface CalendarEvent {
  key: string;
  title: string;
  start: Dayjs;
  end: Dayjs;
  color: string;
}

const defaultValue = dayjs('2026-01-01');
const { token } = theme.useToken();

const events = computed<CalendarEvent[]>(() => [
  {
    key: 'release',
    title: 'Release window',
    start: dayjs('2026-01-08'),
    end: dayjs('2026-01-10'),
    color: token.value.colorPrimary,
  },
  {
    key: 'design-review',
    title: 'Design review',
    start: dayjs('2026-01-14'),
    end: dayjs('2026-01-14'),
    color: token.value.colorSuccess,
  },
  {
    key: 'maintenance',
    title: 'Maintenance',
    start: dayjs('2026-01-21'),
    end: dayjs('2026-01-24'),
    color: token.value.colorWarning,
  },
  {
    key: 'bug-fix',
    title: 'Bug fix',
    start: dayjs('2026-01-30'),
    end: dayjs('2026-01-31'),
    color: token.value.colorError,
  },
]);

const isInRange = (current: Dayjs, event: CalendarEvent) => {
  return !current.isBefore(event.start, 'day') && !current.isAfter(event.end, 'day');
};

const getCurrentEvents = (current: Dayjs) => {
  return events.value.filter(event => isInRange(current, event));
};

const getRangePosition = (current: Dayjs, event: CalendarEvent) => {
  const starts = current.isSame(event.start, 'day');
  const ends = current.isSame(event.end, 'day');

  if (starts && ends) {
    return 'single';
  }
  if (starts) {
    return 'start';
  }
  if (ends) {
    return 'end';
  }
  return 'middle';
};
</script>

<style scoped>
.demo-calendar-event-range {
  max-width: 100%;
  overflow-x: auto;
}

.demo-calendar-event-range :deep(.calendar-event-range-item-content) {
  overflow: visible;
}

.event-cell {
  min-height: 32px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.event-bar {
  display: block;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.event-bar-start {
  margin-inline-end: -12px;
  padding-inline-start: 8px;
  border-start-start-radius: 999px;
  border-end-start-radius: 999px;
}

.event-bar-middle {
  margin-inline: -12px;
}

.event-bar-end {
  margin-inline-start: -12px;
  border-start-end-radius: 999px;
  border-end-end-radius: 999px;
}

.event-bar-single {
  padding-inline-start: 8px;
  border-radius: 999px;
}
</style>
