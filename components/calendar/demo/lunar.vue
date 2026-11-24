<docs>
---
order: 5
title:
  zh-CN: 农历日历
  en-US: Lunar Calendar
---

## zh-CN

展示农历、节日等信息。

## en-US

Display lunar calendar, holidays and other information.
</docs>

<template>
  <div class="demo-calendar-lunar-wrapper">
    <a-calendar :fullscreen="false" @panel-change="onPanelChange" @select="onDateChange">
      <template #fullCellRender="{ current: date, info }">
        <div
          v-if="info.type === 'date'"
          :class="[
            'ant-picker-cell-inner',
            'lunar-date-cell',
            {
              'lunar-current': selectDate.isSame(date, 'date'),
              'lunar-today': date.isSame(today, 'date'),
            },
          ]"
        >
          <div class="lunar-text">
            <span
              :class="{
                'lunar-weekend': date.day() === 6 || date.day() === 0,
                'lunar-gray': !panelDate.isSame(date, 'month'),
              }"
            >
              {{ date.date() }}
            </span>
            <div class="lunar-sub">{{ getLunarDayLabel(date) }}</div>
          </div>
        </div>
        <div
          v-else-if="info.type === 'month'"
          :class="[
            'lunar-month-cell',
            {
              'lunar-month-cell-current': selectDate.isSame(date, 'month'),
            },
          ]"
        >
          {{ date.month() + 1 }}月（{{ getLunarMonthName(date.year(), date.month()) }}）
        </div>
      </template>

      <template #headerRender="{ value, type, onChange, onTypeChange }">
        <a-row justify="end" :gutter="8" :style="{ padding: '8px' }">
          <a-col>
            <a-select
              size="small"
              :popup-match-select-width="false"
              class="my-year-select"
              :value="value.year()"
              :options="getYearOptions(value.year())"
              @change="(newYear: number) => onChange(value.clone().year(newYear))"
            />
          </a-col>
          <a-col>
            <a-select
              size="small"
              :popup-match-select-width="false"
              :value="value.month()"
              :options="getMonthOptions(value.year())"
              @change="(newMonth: number) => onChange(value.clone().month(newMonth))"
            />
          </a-col>
          <a-col>
            <a-radio-group size="small" :value="type" @change="e => onTypeChange(e.target.value)">
              <a-radio-button value="month">月</a-radio-button>
              <a-radio-button value="year">年</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
      </template>
    </a-calendar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { CalendarProps } from 'ant-design-vue';

const CHINESE_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const LUNAR_DAYS = [
  '',
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];
const ZODIAC_MAP: Record<string, string> = {
  子: '鼠',
  丑: '牛',
  寅: '虎',
  卯: '兔',
  辰: '龙',
  巳: '蛇',
  午: '马',
  未: '羊',
  申: '猴',
  酉: '鸡',
  戌: '狗',
  亥: '猪',
};

const SOLAR_HOLIDAYS: Record<string, string> = {
  '1-1': '元旦',
  '5-1': '劳动节',
  '10-1': '国庆节',
};

const LUNAR_HOLIDAYS: Record<string, string> = {
  '正月-1': '春节',
  '正月-15': '元宵',
  '五月-5': '端午',
  '七月-7': '七夕',
  '八月-15': '中秋',
  '九月-9': '重阳',
};

const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const getLunarParts = (d: Date) => {
  const parts = lunarFormatter.formatToParts(d);
  let relatedYear = '';
  let yearName = '';
  let month = '';
  let day = 1;
  for (const part of parts) {
    if (part.type === 'relatedYear') relatedYear = part.value;
    else if (part.type === 'yearName') yearName = part.value;
    else if (part.type === 'month') month = part.value;
    else if (part.type === 'day') day = parseInt(part.value, 10) || 1;
  }
  return { relatedYear, yearName, month, day };
};

const getLunarDayLabel = (date: Dayjs) => {
  const solarKey = `${date.month() + 1}-${date.date()}`;
  if (SOLAR_HOLIDAYS[solarKey]) {
    return SOLAR_HOLIDAYS[solarKey];
  }
  const { month, day } = getLunarParts(date.toDate());
  const lunarKey = `${month}-${day}`;
  if (LUNAR_HOLIDAYS[lunarKey]) {
    return LUNAR_HOLIDAYS[lunarKey];
  }
  if (day === 1) {
    return month;
  }
  return LUNAR_DAYS[day] || String(day);
};

const getLunarMonthName = (year: number, monthIndex: number) => {
  const { month } = getLunarParts(new Date(year, monthIndex, 15));
  return month;
};

const getYearLabel = (year: number) => {
  const { yearName } = getLunarParts(new Date(year, 5, 1));
  const yearCn = String(year)
    .split('')
    .map(ch => CHINESE_DIGITS[Number(ch)] ?? ch)
    .join('');
  const zodiac = yearName ? ZODIAC_MAP[yearName.slice(-1)] || '' : '';
  return `${yearCn}年（${yearName}${zodiac}年）`;
};

const getYearOptions = (year: number) => {
  const options: { label: string; value: number }[] = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    options.push({
      label: getYearLabel(i),
      value: i,
    });
  }
  return options;
};

const getMonthOptions = (year: number) => {
  const options: { label: string; value: number }[] = [];
  for (let i = 0; i < 12; i += 1) {
    options.push({
      label: `${i + 1}月（${getLunarMonthName(year, i)}）`,
      value: i,
    });
  }
  return options;
};

const today = dayjs();
const selectDate = ref<Dayjs>(dayjs());
const panelDate = ref<Dayjs>(dayjs());

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('YYYY-MM-DD'), mode);
  panelDate.value = value;
};

const onDateChange: CalendarProps<Dayjs>['onSelect'] = value => {
  selectDate.value = value;
};
</script>

<style scoped>
.demo-calendar-lunar-wrapper {
  width: 450px;
  max-width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 5px;
  box-sizing: border-box;
  overflow-x: auto;
}

.lunar-date-cell {
  position: relative;
  height: 40px;
  line-height: 1.25;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lunar-date-cell::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  max-width: 40px;
  max-height: 40px;
  background: transparent;
  transition: background-color 0.3s;
  border-radius: 4px;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.lunar-date-cell:hover::before {
  background: rgba(0, 0, 0, 0.04);
}

.lunar-today::before {
  border-color: #1677ff;
}

.lunar-text {
  position: relative;
  z-index: 1;
}

.lunar-sub {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.lunar-weekend {
  color: #ff4d4f;
}

.lunar-gray {
  opacity: 0.4;
}

.lunar-current {
  color: #fff;
}

.lunar-current::before {
  background: #1677ff;
}

.lunar-current:hover::before {
  background: #1677ff;
  opacity: 0.8;
}

.lunar-current .lunar-sub {
  color: #fff;
  opacity: 0.9;
}

.lunar-current .lunar-weekend {
  color: #fff;
}

.lunar-month-cell {
  width: 120px;
  max-width: 100%;
  border-radius: 4px;
  padding: 5px 0;
  margin: 0 auto;
}

.lunar-month-cell:hover {
  background: rgba(0, 0, 0, 0.04);
}

.lunar-month-cell-current {
  color: #fff;
  background: #1677ff;
}

.lunar-month-cell-current:hover {
  background: #1677ff;
  opacity: 0.8;
}
</style>
