---
category: Components
subtitle: 水印
type: 其他
title: Watermark
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wr1ISY50SyYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*duAQQbjHlHQAAAAAAAAAAAAADrJ8AQ/original
---

给页面的某个区域加上水印。

## 何时使用

- 页面需要添加水印标识版权时使用。
- 适用于防止信息盗用。

## API

### Watermark

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| width | 水印的宽度，`content` 的默认值为自身的宽度 | number | 120 |  |
| height | 水印的高度，`content` 的默认值为自身的高度 | number | 64 |  |
| inherit | 是否将水印透传到弹出层组件（如 Modal、Drawer 等） | boolean | true | 4.3.0 |
| rotate | 水印绘制时，旋转的角度，单位 `°` | number | -22 |  |
| zIndex | 追加的水印元素的 z-index | number | 9 |  |
| image | 图片源，建议导出 2 倍或 3 倍图，优先级高 | string | - |  |
| content | 水印文字内容（支持多行数组及每行独立字体配置） | `string` \| [WatermarkText](#watermarktext) \| `(string \| WatermarkText)[]` | - | 4.3.0 |
| font | 文字样式 | [Font](#font) | [Font](#font) |  |
| gap | 水印之间的间距 | \[number, number\] | \[100, 100\] |  |
| offset | 水印距离容器左上角的偏移量，默认为 `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] |  |
| onRemove | 水印被篡改或移除时触发的回调 | `() => void` | - | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |

### WatermarkText

| 参数 | 说明                                        | 类型          | 默认值 | 版本  |
| ---- | ------------------------------------------- | ------------- | ------ | ----- |
| text | 当前行水印文字                              | string        | -      | 4.3.0 |
| font | 当前行文字样式（未配置字段继承外层 `font`） | [Font](#font) | -      | 4.3.0 |

### Font

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 字体颜色 | string | rgba(0,0,0,.15) |  |
| fontSize | 字体大小 | number | 16 |  |
| fontWeight | 字体粗细 | `normal` \| `light` \| `lighter` \| `weight` \| `bold` \| `bolder` \| number | normal |  |
| fontFamily | 字体类型 | string | sans-serif |  |
| fontStyle | 字体样式 | `none` \| `normal` \| `italic` \| `oblique` | normal |  |
| textAlign | 文本对齐方式 | `left` \| `right` \| `center` \| `start` \| `end` | center | 4.3.0 |
