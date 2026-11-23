---
category: Components
type: 其他
title: BackTop
cols: 1
subtitle: 回到顶部
tag: Deprecated
cover: /back-top-light.svg
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2224%22%20y%3D%2214%22%20width%3D%22132%22%20height%3D%2282%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2228%22%20width%3D%2268%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2242%22%20width%3D%22104%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2254%22%20width%3D%2290%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2266%22%20width%3D%2260%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3Ccircle%20cx%3D%22132%22%20cy%3D%2274%22%20r%3D%2214%22%20fill%3D%22%231668dc%22%2F%3E%3Cpath%20d%3D%22M126%2076l6-6%206%206M132%2070v10%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E'
---

返回页面顶部的操作按钮。

> **注意：** `BackTop` 已废弃，推荐使用 [FloatButton.BackTop](/components/float-button-cn/) 替代。

## 何时使用

- 当页面内容区域比较长时；
- 当用户需要频繁返回顶部查看相关内容时。

## API

### BackTop

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| duration | 滚动回顶部动画时长，单位 ms | number | 450 | 4.3.0 |
| target | 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | () => HTMLElement | () => window | 4.3.0 |
| visibilityHeight | 滚动高度达到此参数值才出现 BackTop | number | 400 | 4.3.0 |
| onClick | 点击按钮的回调函数 | function | - | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |

### BackTop 事件

| 事件名称 | 说明               | 回调参数                |
| -------- | ------------------ | ----------------------- |
| click    | 点击按钮的回调函数 | (e: MouseEvent) => void |
