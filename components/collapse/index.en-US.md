---
category: Components
type: Data Display
title: Collapse
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*B7HKR5OBe8gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sir-TK0HkWcAAAAAAAAAAAAADrJ8AQ/original
---

A content area which can be collapsed and expanded.

## When To Use

- Can be used to group or hide complex regions to keep the page clean.
- 'Accordion' is a special kind of 'Collapse', which allows only one panel to be expanded at a time.

## API

### Collapse

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| accordion | If `true`, `Collapse` renders as `Accordion` | boolean | `false` |  |
| activeKey(v-model) | Key of the active panel | string\[] \| string <br> number\[] \| number | No default value. In [accordion mode](#components-collapse-demo-accordion), it's the key of the first panel. |  |
| bordered | Toggles rendering of the border around the collapse block | boolean | `true` |  |
| collapsible | Specify whether the panels of children be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - | 4.0 |
| defaultActiveKey | Key of the initial active panel | string\[] \| string <br> number\[] \| number | - |  |
| ~~destroyInactivePanel~~ | Destroy Inactive Panel (deprecated, please use `destroyOnHidden` instead) | boolean | `false` |  |
| destroyOnHidden | Destroy inactive panel when collapsed | boolean | `false` | 4.3.0 |
| expandIcon | Allow to customize collapse icon | Function(props):VNode \| v-slot:expandIcon="props" | - |  |
| expandIconPosition | Set expand icon position | `start` \| `end` | - | 4.0 |
| ghost | Make the collapse borderless and its background transparent | boolean | false | 3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | Set the size of collapse | `large` \| `middle` \| `small` | `middle` | 4.3.0 |

### events

| Events Name | Description                                             | Arguments     | Version |
| ----------- | ------------------------------------------------------- | ------------- | ------- |
| change      | Callback function executed when active panel is changed | function(key) |         |

### Collapse.Panel

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `disabled` | - | 3.0 |
| ~~disabled~~ | If `true`, panel cannot be opened or closed (deprecated, please use `collapsible="disabled"` instead) | boolean | `false` |  |
| extra | Extra element in the corner | VNode \| slot | - | 1.5.0 |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | `false` |  |
| header | Title of the panel | string \| slot | - |  |
| key | Unique key identifying the panel from among its siblings | string \| number | - |  |
| showArrow | If `false`, panel will not show arrow icon | boolean | `true` |  |
