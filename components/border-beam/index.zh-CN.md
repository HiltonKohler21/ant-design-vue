---
category: Components
type: 其他
title: BorderBeam
cols: 2
subtitle: 边框流光
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

为容器边框提供持续流动的装饰性高亮效果。

## 何时使用

- 需要强化某个容器的视觉关注度，但又不希望引入业务状态语义时。
- 适合登录面板、推荐卡片、AI 模块、重点 CTA 区域等场景。
- 它是装饰性效果，不应替代焦点态、校验态或业务状态边框。

## API

### BorderBeam

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 流光颜色配置，支持单色字符串、颜色数组或渐变停靠点数组。`percent` 使用 `0 ~ 100` 的输入区间，组件会在内部为尾部透明过渡预留空间 | `string \| string[] \| { color: string; percent: number }[]` | - | 4.3.0 |
| count | 均匀分布的流光数量，应为正整数 | number | 1 | 4.3.0 |
| duration | 流光完成一圈动画的时间，单位秒 | number | 6 | 4.3.0 |
| items | 每条流光的配置。数组长度决定流光数量，并且优先于 `count`。数组项未设置的属性会继承顶层的 `color`、`lineWidth`、`outset` 和 `size` | `BorderBeamItem[]` | - | 4.3.0 |
| lineWidth | 流光线宽，数字类型按像素处理 | `number \| string` | `lineWidth` token (`1px`) | 4.3.0 |
| outset | 流光层相对容器边缘的外扩距离，遇到裁剪容器时可设为 `0` | `number \| string` | 宿主元素边框宽度 | 4.3.0 |
| rootClassName | 光束节点类名 | string | - | 4.3.0 |
| size | 流光可见段的尺寸，数字类型按像素处理 | `number \| string` | `100` | 4.3.0 |

### BorderBeamItem

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 当前流光的颜色配置 | `string \| string[] \| { color: string; percent: number }[]` | - | 4.3.0 |
| lineWidth | 当前流光的线宽，数字类型按像素处理 | `number \| string` | - | 4.3.0 |
| outset | 当前流光相对容器边缘的外扩距离 | `number \| string` | - | 4.3.0 |
| size | 当前流光可见段的尺寸，数字类型按像素处理 | `number \| string` | - | 4.3.0 |

## FAQ

### 开启减少动态效果后会怎样？

`BorderBeam` 会将流光视为装饰效果。当命中 `prefers-reduced-motion: reduce` 或主题 `token.motion` 为 `false` 时，组件会隐藏流光效果。

### `color` 中的 `percent` 表示什么？

`percent` 表示渐变停靠点的输入位置，取值范围为 `0 ~ 100`。组件会将这些停靠点映射到可见 beam 段内，并为尾部透明过渡保留空间，以保持流光尾迹连续可见。

### `size` 的取值限制

流光由一个边长为 `size` 的方形渐变层生成。使用时应让 `size` 明显小于遮罩覆盖层短边的两倍：`size < 2 × min(width, height)`。

### 如何让流光边框跟随容器圆角？

`BorderBeam` 会将流光层渲染为实际容器的子节点，并通过 `border-radius: inherit` 直接继承容器圆角，支持多值不规则圆角。
