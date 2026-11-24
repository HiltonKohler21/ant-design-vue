---
category: Components
type: Data Display
title: Statistic
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YL7PRYNtH-4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BPWDRbSYxJ4AAAAAAAAAAAAADrJ8AQ/original
---

Display statistic number.

## When To Use

- When want to highlight some data.
- When want to display statistic data with description.

## API

### Statistic

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the Statistic component. Supports object or function | Record<SemanticDOM, string> \| (info: { props: StatisticProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| decimalSeparator | decimal separator | string | . |  |
| formatter | customize value display logic | v-slot \| ({value}) => VNode | - |  |
| groupSeparator | group separator | string | , |  |
| loading | Loading status of Statistic | boolean | false |  |
| precision | precision of input value | number | - |  |
| prefix | prefix node of value | string \| v-slot | - |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the Statistic component. Supports object or function | Record<SemanticDOM, CSSProperties> \| (info: { props: StatisticProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| suffix | suffix node of value | string \| v-slot | - |  |
| title | Display title | string \| v-slot | - |  |
| value | Display value | string \| number | - |  |
| ~~valueStyle~~ | Set value section style (deprecated, please use `styles.content` instead) | style | - |  |

> Supported `SemanticDOM` slots: `root` \| `header` \| `title` \| `content` \| `value` \| `prefix` \| `suffix`.

### Statistic.Countdown

| Property   | Description                            | Type             | Default    |
| ---------- | -------------------------------------- | ---------------- | ---------- |
| format     | Format as [dayjs](https://day.js.org/) | string           | 'HH:mm:ss' |
| prefix     | prefix node of value                   | string \| v-slot | -          |
| suffix     | suffix node of value                   | string \| v-slot | -          |
| title      | Display title                          | string \| v-slot | -          |
| value      | Set target countdown time              | number \| dayjs  | -          |
| valueStyle | Set value css style                    | style            | -          |

#### Statistic.Countdown Events

| Events Name | Description                  | Arguments                |
| ----------- | ---------------------------- | ------------------------ |
| change      | Trigger when time's changing | (value?: number) => void |
| finish      | Trigger when time's up       | () => void               |

### Statistic.Timer `4.3.0`

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| format | Format as [dayjs](https://day.js.org/) | string | 'HH:mm:ss' |
| prefix | prefix node of value | string \| v-slot | - |
| suffix | suffix node of value | string \| v-slot | - |
| title | Display title | string \| v-slot | - |
| type | Timer type, countdown or countup | `'countdown'` \| `'countup'` | `'countdown'` |
| value | Set target timestamp | number \| string \| dayjs | - |
| valueStyle | Set value css style | style | - |

#### Statistic.Timer Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | Trigger when time's changing | (value?: number) => void |
| finish | Trigger when time's up (only called when `type="countdown"`) | () => void |
