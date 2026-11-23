---
category: Components
type: 数据展示
title: Image
subtitle: 图片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FbOCS6aFMeUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LVQ3R5JjjJEAAAAAAAAAAAAADrJ8AQ/original
---

可预览的图片。

## 何时使用

- 需要展示图片时使用。
- 加载大图时显示 loading 或加载失败时容错处理。

## API

### Image

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图像描述 | string | - | 2.0.0 |
| fallback | 加载失败容错地址 | string | - | 2.0.0 |
| height | 图像高度 | string \| number | - | 2.0.0 |
| placeholder | 加载占位，为 `true` 时使用默认占位 | boolean \| slot | - | 2.0.0 |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [previewType](#previewtype) | `true` | 2.0.0 |
| previewMask | 自定义 mask | false \| function \| slot | - | 3.2.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| src | 图片地址 | string | - | 2.0.0 |
| width | 图像宽度 | string \| number | - | 2.0.0 |
| wrapperClassName | 图片包裹容器类名 | string | - | 4.3.0 |
| wrapperStyle | 图片包裹容器样式 | CSSProperties | - | 4.3.0 |

### 事件

| 事件名称 | 说明         | 回调参数               | 版本  |
| -------- | ------------ | ---------------------- | ----- |
| error    | 加载错误回调 | (event: Event) => void | 3.2.0 |

### Image.PreviewGroup

用于多张图片组合预览，包裹多个 `<a-image>` 组件即可自动开启左右切换。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| fallback | 加载失败容错地址（可通过 `ConfigProvider.image.fallback` 或内部 `Image` 设置） | string | - | 4.3.0 |
| icons | 自定义预览操作图标 | { rotateLeft?: VueNode; rotateRight?: VueNode; zoomIn?: VueNode; zoomOut?: VueNode; close?: VueNode \| boolean; left?: VueNode; right?: VueNode; flipX?: VueNode; flipY?: VueNode } | - | 4.3.0 |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [PreviewGroupPreview](#previewtype) | `true` | 2.0.0 |

### previewType

```ts
{
  visible?: boolean;
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  src?: string;
  maskClassName?: string;
  rootClassName?: string;
  closeIcon?: VueNode | boolean;
  icons?: {
    rotateLeft?: VueNode;
    rotateRight?: VueNode;
    zoomIn?: VueNode;
    zoomOut?: VueNode;
    close?: VueNode | boolean;
    left?: VueNode;
    right?: VueNode;
    flipX?: VueNode;
    flipY?: VueNode;
  };
  current?: number; // PreviewGroup 预览时当前展示图片的索引
}
```

其他属性见 [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
