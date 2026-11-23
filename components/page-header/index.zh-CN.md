---
category: Components
type: 导航
title: PageHeader
cols: 1
subtitle: 页头
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2216%22%20y%3D%2216%22%20width%3D%22148%22%20height%3D%2278%22%20rx%3D%228%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221.5%22%2F%3E%3Cpath%20d%3D%22M32%2034h-8m0%200l3.5-3.5M24%2034l3.5%203.5%22%20stroke%3D%22%23bfbfbf%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2230%22%20width%3D%2238%22%20height%3D%228%22%20rx%3D%223%22%20fill%3D%22%23bfbfbf%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2231%22%20width%3D%2222%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Crect%20x%3D%22124%22%20y%3D%2228%22%20width%3D%2228%22%20height%3D%2212%22%20rx%3D%224%22%20fill%3D%22%231677ff%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2250%22%20x2%3D%22156%22%20y2%3D%2250%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23d9d9d9%22%2F%3E%3Crect%20x%3D%2292%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23d9d9d9%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2274%22%20width%3D%2284%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2216%22%20y%3D%2216%22%20width%3D%22148%22%20height%3D%2278%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Cpath%20d%3D%22M32%2034h-8m0%200l3.5-3.5M24%2034l3.5%203.5%22%20stroke%3D%22%23595959%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2230%22%20width%3D%2238%22%20height%3D%228%22%20rx%3D%223%22%20fill%3D%22%23595959%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2231%22%20width%3D%2222%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%2315325b%22%2F%3E%3Crect%20x%3D%22124%22%20y%3D%2228%22%20width%3D%2228%22%20height%3D%2212%22%20rx%3D%224%22%20fill%3D%22%231668dc%22%2F%3E%3Cline%20x1%3D%2224%22%20y1%3D%2250%22%20x2%3D%22156%22%20y2%3D%2250%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2292%22%20y%3D%2260%22%20width%3D%2254%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23434343%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2274%22%20width%3D%2284%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23303030%22%2F%3E%3C%2Fsvg%3E'
---

页头位于页容器中，页容器顶部，起到了内容概览和引导页级操作的作用。包括由面包屑、标题、页面内容简介、页面级操作等、页面级导航组成。

## 何时使用

当需要使用户快速理解当前页是什么以及方便用户使用页面功能时使用，通常也可被用作页面间导航。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 标题栏旁的头像 | [avatar props](/components/avatar-cn/) | - |
| backIcon | 自定义 back icon ，如果为 false 不渲染 back icon | string\|slot | `<ArrowLeft />` |
| breadcrumb | 面包屑的配置 | [breadcrumb](/components/breadcrumb-cn/) | - |
| extra | 操作区，位于 title 行的行尾 | string\|slot | - |
| footer | PageHeader 的页脚，一般用于渲染 TabBar | string\|slot | - |
| ghost | pageHeader 的类型，将会改变背景颜色 | boolean | true |
| subTitle | 自定义的二级标题文字 | string\|slot | - |
| tags | title 旁的 tag 列表 | [Tag](/components/tag-cn/)\[] \| [Tag](/components/tag-cn/) | - |
| title | 自定义标题文字 | string\|slot | - |

### 事件

| 事件名称 | 说明               | 回调参数    |
| -------- | ------------------ | ----------- |
| back     | 返回按钮的点击事件 | function(e) |
