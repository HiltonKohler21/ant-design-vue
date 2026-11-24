---
category: Components
type: Data Entry
title: TimePicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kGmGSLk_1fwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1hDmQJIDFJQAAAAAAAAAAAAADrJ8AQ/original
---

To select/input a time.

## When To Use

By clicking the input box, you can select a time from a popup panel.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether allow clearing text | boolean \| [AllowClearConfig](/components/date-picker/#allowclearconfig) | true | 4.3.0 |
| autofocus | If get focus when component mounted | boolean | false |  |
| ~~bordered~~ | Whether has border style, please use `variant` instead | boolean | true |  |
| cellRender | Custom rendering function for picker cells | `(current, info) => VNode` \| v-slot:cellRender | - | 4.3.0 |
| changeOnScroll | Trigger selection when scroll the column | boolean | false | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| `(info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| clearIcon | The custom clear icon | VNode \| v-slot:clearIcon | - |  |
| clearText | The clear tooltip of icon | string | clear |  |
| components | Custom panels, input, and footer buttons. See [DatePicker Components](/components/date-picker/#components) | [Components](/components/date-picker/#components) | - | 4.3.0 |
| defaultValue | To set default time | [dayjs](https://day.js.org/) \| string | - |  |
| disabled | Determine whether the TimePicker is disabled | boolean | false |  |
| disabledTime | To specify the time that cannot be selected | [DisabledTime](#disabledtime) | - | 3.3.0 |
| format | To set the time format | string | `HH:mm:ss` |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a div element in body | function(trigger) | - |  |
| hideDisabledOptions | Whether hide the options that can not be selected | boolean | false |  |
| hourStep | Interval between hours in picker | number | 1 |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| minuteStep | Interval between minutes in picker | number | 1 |  |
| needConfirm | Require clicking the OK button to confirm selection | boolean | true | 4.3.0 |
| open(v-model) | Whether to popup panel | boolean | false |  |
| placeholder | Display when there's no value | string \| \[string, string] | `Select a time` |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| ~~popupClassName~~ | The className of panel, please use `classNames.popup.root` instead | string | - |  |
| ~~popupStyle~~ | The style of panel, please use `styles.popup.root` instead | CSSProperties | - |  |
| prefix | The custom prefix | VNode \| slot | - | 4.3.0 |
| previewValue | When the user selects the time hover option, whether the input field undergoes a temporary change | `false` \| `'hover'` | `'hover'` | 4.3.0 |
| renderExtraFooter | Called from time picker panel to render some addon to its bottom | v-slot:renderExtraFooter | - |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| secondStep | Interval between seconds in picker | number | 1 |  |
| showNow | Whether to show `Now` button on panel | boolean | - |  |
| size | To determine the size of the input box, the height of `large` and `small` are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| `(info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| suffix | The custom suffix | VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | The custom suffix icon, please use `suffix` instead | v-slot:suffixIcon | - |  |
| use12Hours | Display as 12 hours format, with default format `h:mm:ss a` | boolean | false |  |
| value(v-model) | To set time | [dayjs](https://day.js.org/) | - |  |
| valueFormat | optional, format of binding value. If not specified, the binding value will be a Date object | string, [date formats](https://day.js.org/docs/en/display/format) | - |  |
| variant | Variants of picker | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | a callback function, can be executed when the selected time is changing | function(time: dayjs \| string, timeString: string): void |  |
| clear | Callback when click the clear button | `() => void` | 4.3.0 |
| openChange | a callback function which will be called while panel opening/closing | (open: boolean): void |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

### TimeRangePicker

Same props from [RangePicker](/components/date-picker/#rangepicker) of DatePicker. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| order | Order start and end time | boolean | true |  |
| disabledTime | To specify the time that cannot be selected | [RangeDisabledTime](#rangedisabledtime) | - | 3.3.0 |

#### TimeRangePicker Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| calendarChange | Callback function, can be executed when the start time or the end time of the range is changing | function(dates: \[dayjs, dayjs], dateStrings: \[string, string], info: { range: `start` \| `end` }) |

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

| Slot            | Description                        | Version |
| --------------- | ---------------------------------- | ------- |
| root            | Root container element             | 4.3.0   |
| prefix          | Prefix element                     | 4.3.0   |
| input           | Input element                      | 4.3.0   |
| suffix          | Suffix element                     | 4.3.0   |
| popup.root      | Popup overlay root element         | 4.3.0   |
| popup.container | Popup panel container element      | 4.3.0   |
| popup.content   | Popup time columns content element | 4.3.0   |
| popup.item      | Popup time cell inner element      | 4.3.0   |
| popup.footer    | Popup panel footer element         | 4.3.0   |

## FAQ

### How to use TimePicker with customize date library（like moment.js \| dayjs \| date-fns）？

Please refer [replace date](/docs/vue/replace-date)
