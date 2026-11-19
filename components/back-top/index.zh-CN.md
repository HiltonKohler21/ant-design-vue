---
category: Components
type: 其他
title: BackTop
subtitle: 回到顶部
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*CD4RRq9yk6UAAAAAAAAAAAAADrJ8AQ/original
---

返回页面顶部的操作按钮。

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
