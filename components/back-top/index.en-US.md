---
category: Components
type: Other
title: BackTop
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*CD4RRq9yk6UAAAAAAAAAAAAADrJ8AQ/original
---

A button to return to the top of the page.

## When To Use

- When the page content is very long.
- When you need to go back to the top of the page frequently to check the content.

## API

### BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top (ms) | number | 450 | 4.3.0 |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window | 4.3.0 |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 | 4.3.0 |
| onClick | A callback function, which can be executed when you click the button | function | - | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| click | A callback function, which can be executed when you click the button | (e: MouseEvent) => void |
