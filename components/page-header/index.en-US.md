---
category: Components
type: Navigation
title: PageHeader
cols: 1
subtitle:
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2216%22%20y%3D%2216%22%20width%3D%22148%22%20height%3D%2278%22%20rx%3D%228%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221.5%22%2F%3E%3Cpath%20d%3D%22M32%2034h-8m0%200l3.5-3.5M24%2034l3.5%203.5%22%20stroke%3D%22%23bfbfbf%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2230%22%20width%3D%2238%22%20height%3D%228%22%20rx%3D%223%22%20fill%3D%22%23bfbfbf%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2231%22%20width%3D%2222%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Crect%20x%3D%22124%22%20y%3D%2228%22%20width%3D%2228%22%20height%3D%2212%22%20rx%3D%224%22%20fill%3D%22%231677ff%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2250%22%20x2%3D%22156%22%20y2%3D%2250%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23d9d9d9%22%2F%3E%3Crect%20x%3D%2292%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23d9d9d9%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2274%22%20width%3D%2284%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2216%22%20y%3D%2216%22%20width%3D%22148%22%20height%3D%2278%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Cpath%20d%3D%22M32%2034h-8m0%200l3.5-3.5M24%2034l3.5%203.5%22%20stroke%3D%22%23595959%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2230%22%20width%3D%2238%22%20height%3D%228%22%20rx%3D%223%22%20fill%3D%22%23595959%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2231%22%20width%3D%2222%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%2315325b%22%2F%3E%3Crect%20x%3D%22124%22%20y%3D%2228%22%20width%3D%2228%22%20height%3D%2212%22%20rx%3D%224%22%20fill%3D%22%231668dc%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2250%22%20x2%3D%22156%22%20y2%3D%2250%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2292%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2274%22%20width%3D%2284%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3C%2Fsvg%3E'
---

A header with common actions and design elements built in.

## When To Use

PageHeader can be used to highlight the page topic, display important information about the page, and carry the action items related to the current page (including page-level operations, inter-page navigation, etc.) It can also be used as inter-page navigation.

## API

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| avatar | Avatar next to the title bar | [avatar props](/components/avatar/) | - |
| backIcon | custom back icon, if false the back icon will not be displayed | string\|slot | `<ArrowLeft />` |
| breadcrumb | Breadcrumb configuration | [breadcrumb](/components/breadcrumb/) | - |
| extra | Operating area, at the end of the line of the title line | string\|slot | - |
| footer | PageHeader's footer, generally used to render TabBar | string\|slot | - |
| ghost | PageHeader type, will change background color | boolean | true |
| subTitle | custom subTitle text | string\|slot | - |
| tags | Tag list next to title | [Tag](/components/tag/)\[] \| [Tag](/components/tag/) | - |
| title | custom title text | string\|slot | - |

### Events

| Events Name | Description           | Arguments   |
| ----------- | --------------------- | ----------- |
| back        | back icon click event | function(e) |
