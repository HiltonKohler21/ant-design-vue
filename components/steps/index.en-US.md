---
category: Components
type: Navigation
cols: 1
title: Steps
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*677sTqCpE3wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cFsBQLA0b7UAAAAAAAAAAAAADrJ8AQ/original
---

`Steps` is a navigation bar that guides users through the steps of a task.

## When To Use

When a given task is complicated or has a certain sequence in the series of subtasks, we can decompose it into several steps to make things easier.

## API

### Steps

The whole of the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic DOM class names (object or function) | `StepsClassNamesType` | - | 4.3.0 |
| current(v-model) | to set the current step, counting from 0. You can overwrite this state by using `status` of `Step`, support v-model after 1.5.0 | number | 0 |  |
| ~~direction~~ | to specify the direction of the step bar (deprecated, please use `orientation`), `horizontal` and `vertical` are supported | string | `horizontal` |  |
| ellipsis | Whether to apply text ellipsis to step title, subtitle, and description | boolean | false | 4.3.0 |
| iconRender | Custom render icon, please use `items.icon` first | `(oriNode, info: { index, active, item }) => VueNode` | - | 4.3.0 |
| initial | set the initial step, counting from 0 | number | 0 |  |
| items | StepItem content | [StepItem](#stepsstep)[] | [] |  |
| ~~labelPlacement~~ | support vertical title and description (deprecated, please use `titlePlacement`) | string | `horizontal` |  |
| maxCount | Maximum number of step items to display (`>= 3`). Hidden ranges are collapsed into disabled ellipsis steps | number | - | 4.3.0 |
| offset | Offset cells, only works when `type` is `inline` | number | 0 | 4.3.0 |
| orientation | Direction of the step bar, takes precedence over `direction` | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| percent | Progress circle percentage of current step in `process` status (only works on basic Steps) | number | - | 3.0 |
| ~~progressDot~~ | Steps with progress dot style, please use `type="dot"` instead. Customize via scoped slot. `titlePlacement` will be `vertical` | Boolean or v-slot:progressDot="{index, status, title, description, prefixCls, iconDot}" | false |  |
| responsive | change to vertical direction when screen width smaller than `532px` | boolean | true | 3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| size | to specify the size of the step bar, `medium` (`default`) and `small` are currently supported | `default` \| `medium` \| `small` | `default` | `medium`: 4.3.0 |
| status | to specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | string | `process` |  |
| styles | Semantic DOM styles (object or function) | `StepsStylesType` | - | 4.3.0 |
| titlePlacement | Label placement, takes precedence over `labelPlacement` | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| type | Type of steps, can be set to one of the following values: `default`, `dot`, `inline`, `navigation`, `panel` | string | `default` | 1.5.0 (`dot` / `panel`: 4.3.0) |
| variant | Visual variant of steps | `filled` \| `outlined` | `filled` | 4.3.0 |

### `type="inline"` (4.0+)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| current | To set the current step, counting from 0. You can overwrite this state by using `status` of `Step` | number | 0 |  |
| initial | Set the initial step, counting from 0 | number | 0 |  |
| status | To specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | string | `process` |  |
| items | StepItem content. not supported: `icon` `subtitle` | [StepItem](#stepsstep)[] | [] |  |

#### Steps Events

| Events Name | Description                  | Arguments         | Version |
| ----------- | ---------------------------- | ----------------- | ------- |
| change      | Trigger when Step is changed | (current) => void | 1.5.0   |

### Steps.Step

A single step in the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Description of the step (takes precedence over `description`), optional | string \| slot | - | 4.3.0 |
| description | description of the step (deprecated, please use `content`), optional property | string\|slot | - |  |
| disabled | Disable click | boolean | false | 1.5.0 |
| icon | icon of the step, optional property | string\|slot | - |  |
| status | to specify the status. It will be automatically set by `current` of `Steps` if not configured. Optional values are: `wait` `process` `finish` `error` | string | `wait` |  |
| subTitle | Subtitle of the step | string\|slot | - | 1.5.0 |
| title | title of the step | string\|slot | - |  |

### Semantic DOM

`classNames` and `styles` support static objects or `(info: { props }) => ...` functions with the following semantic keys:

- `root` / `item` / `itemWrapper` / `itemSection` / `itemHeader` / `itemTitle` / `itemSubtitle` / `itemContent` / `itemIcon` / `itemRail` / `icon` / `title` / `description`
