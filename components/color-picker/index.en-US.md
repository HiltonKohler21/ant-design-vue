---
category: Components
type: Data Entry
title: ColorPicker
---

For color selection.

## When To Use

- When the user needs to select a color.

## API

### ColorPicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value(v-model) | The color value | string | - | 4.3.0 |
| defaultValue | The default color value | string | `#1677ff` | 4.3.0 |
| disabled | Disable | boolean | false | 4.3.0 |
| disabledAlpha | Disable alpha selection | boolean | false | 4.3.0 |
| showText | Show color text | boolean | false | 4.3.0 |
| presets | Preset colors | { label: string; colors: string[] }[] | - | 4.3.0 |
| allowClear | Allow clear | boolean | false | 4.3.0 |
| open(v-model:open) | Controlled open | boolean | - | 4.3.0 |
| size | Size | `large` \| `middle` \| `small` | `middle` | 4.3.0 |
| status | Validation status | `error` \| `warning` | - | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |

### Events

| Events Name | Description                     | Arguments               |
| ----------- | ------------------------------- | ----------------------- |
| change      | Callback when color changes     | (color: string) => void |
| openChange  | Callback when popup shows/hides | (open: boolean) => void |

> Note: current version supports solid colors (hex/rgb/hsb); gradient is not supported yet.
