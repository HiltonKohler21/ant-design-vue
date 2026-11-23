---
category: Components
type: Other
title: BackTop
cols: 1
tag: Deprecated
cover: /back-top-light.svg
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2224%22%20y%3D%2214%22%20width%3D%22132%22%20height%3D%2282%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2228%22%20width%3D%2268%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2242%22%20width%3D%22104%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2254%22%20width%3D%2290%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2266%22%20width%3D%2260%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Ccircle%20cx%3D%22132%22%20cy%3D%2274%22%20r%3D%2214%22%20fill%3D%22%231668dc%22%2F%3E%3Cpath%20d%3D%22M126%2076l6-6%206%206M132%2070v10%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E'
---

A button to return to the top of the page.

> **Note:** `BackTop` is deprecated. Please use [FloatButton.BackTop](/components/float-button/) instead.

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
