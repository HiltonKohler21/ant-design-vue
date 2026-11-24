---
category: Components
type: 数据录入
title: TimePicker
subtitle: 时间选择框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kGmGSLk_1fwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1hDmQJIDFJQAAAAAAAAAAAAADrJ8AQ/original
---

输入或选择时间的控件。

## 何时使用

当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否展示清除按钮 | boolean \| [AllowClearConfig](/components/date-picker-cn/#allowclearconfig) | true | 4.3.0 |
| autofocus | 自动获取焦点 | boolean | false |  |
| ~~bordered~~ | 是否有边框，请使用 `variant` 替代 | boolean | true |  |
| cellRender | 自定义单元格的内容 | `(current, info) => VNode` \| v-slot:cellRender | - | 4.3.0 |
| changeOnScroll | 在滚动时改变选择值 | boolean | false | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| `(info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| clearIcon | 自定义的清除图标 | VNode \| v-slot:clearIcon | - |  |
| clearText | 清除按钮的提示文案 | string | clear |  |
| components | 自定义面板、输入框和底部按钮，详见 [DatePicker Components](/components/date-picker-cn/#components) | [Components](/components/date-picker-cn/#components) | - | 4.3.0 |
| defaultValue | 默认时间 | [dayjs](https://day.js.org/) \| string | - |  |
| disabled | 禁用全部操作 | boolean | false |  |
| disabledTime | 不可选择的时间 | [DisabledTime](#disabledtime) | - | 3.3.0 |
| format | 展示的时间格式 | string | `HH:mm:ss` |  |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - |  |
| hideDisabledOptions | 隐藏禁止选择的选项 | boolean | false |  |
| hourStep | 小时选项间隔 | number | 1 |  |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false |  |
| minuteStep | 分钟选项间隔 | number | 1 |  |
| needConfirm | 是否需要点击确认按钮触发值变更 | boolean | true | 4.3.0 |
| open(v-model) | 面板是否打开 | boolean | false |  |
| placeholder | 没有值的时候显示的内容 | string \| \[string, string] | `请选择时间` |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| ~~popupClassName~~ | 弹出层类名，请使用 `classNames.popup.root` 替代 | string | - |  |
| ~~popupStyle~~ | 弹出层样式对象，请使用 `styles.popup.root` 替代 | CSSProperties | - |  |
| prefix | 自定义前缀 | VNode \| slot | - | 4.3.0 |
| previewValue | 当用户选择时间悬停选项时，输入字段的值是否发生临时更改 | `false` \| `'hover'` | `'hover'` | 4.3.0 |
| renderExtraFooter | 选择框底部显示自定义的内容 | v-slot:renderExtraFooter | - |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| secondStep | 秒选项间隔 | number | 1 |  |
| showNow | 面板是否显示“此刻”按钮 | boolean | - |  |
| size | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px | `large` \| `middle` \| `small` | - |  |
| status | 设置校验状态 | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| `(info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| suffix | 自定义后缀 | VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | 自定义的选择框后缀图标，请使用 `suffix` 替代 | v-slot:suffixIcon | - |  |
| use12Hours | 使用 12 小时制，为 true 时 `format` 默认为 `h:mm:ss a` | boolean | false |  |
| value(v-model) | 当前时间 | [dayjs](https://day.js.org/) | - |  |
| valueFormat | 可选，绑定值的格式，对 value、defaultValue 起作用。不指定则绑定值为 dayjs 对象 | string，[具体格式](https://day.js.org/docs/zh-CN/display/format) | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 时间发生变化的回调 | function(time: dayjs \| string, timeString: string): void |  |
| clear | 点击清除按钮时的回调 | `() => void` | 4.3.0 |
| openChange | 面板打开/关闭时的回调 | (open: boolean): void |  |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### TimeRangePicker

属性与 DatePicker 的 [RangePicker](/components/date-picker-cn/#rangepicker) 相同。还包含以下属性：

| 参数         | 说明                 | 类型                                    | 默认值 | 版本  |
| ------------ | -------------------- | --------------------------------------- | ------ | ----- |
| order        | 始末时间是否自动排序 | boolean                                 | true   |       |
| disabledTime | 不可选择的时间       | [RangeDisabledTime](#rangedisabledtime) | -      | 3.3.0 |

#### TimeRangePicker 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| calendarChange | 待选时间发生变化的回调 | function(dates: \[dayjs, dayjs], dateStrings: \[string, string], info: { range: `start` \| `end` }) |

#### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

## Semantic DOM

| 插槽            | 说明               | 版本  |
| --------------- | ------------------ | ----- |
| root            | 根元素容器         | 4.3.0 |
| prefix          | 前缀元素           | 4.3.0 |
| input           | 输入框元素         | 4.3.0 |
| suffix          | 后缀元素           | 4.3.0 |
| popup.root      | 弹出层根元素       | 4.3.0 |
| popup.container | 弹出面板容器元素   | 4.3.0 |
| popup.content   | 弹出时间列内容元素 | 4.3.0 |
| popup.item      | 弹出时间单元格元素 | 4.3.0 |
| popup.footer    | 弹出面板底部元素   | 4.3.0 |

## FAQ

### 如何在 TimePicker 中使用自定义日期库（如 moment.js \| dayjs \| date-fns）？

请参考[《自定义日期库》](/docs/vue/replace-date-cn)
