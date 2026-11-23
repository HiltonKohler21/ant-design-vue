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
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| fallback | 加载失败容错地址 | string | - | 2.0.0 |
| height | 图像高度 | string \| number | - | 2.0.0 |
| placeholder | 加载占位，为 `true` 时使用默认占位 | boolean \| VueNode \| slot | - | 2.0.0 |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [PreviewType](#previewtype) | `true` | 2.0.0 |
| previewMask | 自定义缩略图悬浮层（推荐使用 `preview.cover`） | false \| function \| slot | - | 3.2.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| src | 图片地址 | string | - | 2.0.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| width | 图像宽度 | string \| number | - | 2.0.0 |
| wrapperClassName | 图片包裹容器类名 | string | - | 4.3.0 |
| ~~wrapperStyle~~ | 图片包裹容器样式（推荐使用 `styles.root`） | CSSProperties | - | 4.3.0 |

> 语义化结构 `SemanticDOM` 支持：`root` \| `image` \| `cover` \| `popup: { root, mask, body, footer, actions, close }`。

### 事件

| 事件名称 | 说明         | 回调参数               | 版本  |
| -------- | ------------ | ---------------------- | ----- |
| error    | 加载错误回调 | (event: Event) => void | 3.2.0 |

### PreviewType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionsRender | 自定义工具栏渲染 | `(originalNode: VNode, info: ToolbarRenderInfoType) => VueNode` | - | 4.3.0 |
| closeIcon | 自定义关闭图标 | VueNode \| boolean | - | 4.3.0 |
| cover | 自定义缩略图悬浮层 | `VueNode \| { coverNode?: VueNode; placement?: 'top' \| 'bottom' \| 'center' } \| false` | - | 4.3.0 |
| getContainer | 指定预览挂载的节点，为 `false` 时挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | - | 2.0.0 |
| icons | 自定义预览操作图标 | `{ rotateLeft?, rotateRight?, zoomIn?, zoomOut?, close?, left?, right?, flipX?, flipY? }` | - | 4.3.0 |
| imageRender | 自定义预览内容 | `(originalNode: VNode, info: { transform: TransformType; image: ImgInfo }) => VueNode` | - | 4.3.0 |
| mask | 预览背景遮罩配置 | `boolean \| { enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` | 4.3.0 |
| ~~maskClassName~~ | 缩略图遮罩类名，请使用 `classNames.cover` 替代 | string | - | 2.0.0 |
| maxScale | 最大缩放比例 | number | `50` | 4.3.0 |
| minScale | 最小缩放比例 | number | `1` | 4.3.0 |
| movable | 是否允许拖拽移动预览图片 | boolean | `true` | 4.3.0 |
| open | 是否显示预览 | boolean | - | 4.3.0 |
| rootClassName | 预览浮层根节点类名 | string | - | 4.3.0 |
| scaleStep | 缩放步长，每次缩放倍数为 `1 + scaleStep` | number | `0.5` | 4.3.0 |
| src | 自定义预览地址 | string | - | 2.0.0 |
| ~~toolbarRender~~ | 自定义工具栏，请使用 `actionsRender` 替代 | `(originalNode: VNode, info: ToolbarRenderInfoType) => VueNode` | - | 4.3.0 |
| ~~visible~~ | 是否显示预览，请使用 `open` 替代 | boolean | - | 2.0.0 |
| wheel | 是否开启鼠标滚轮缩放 | boolean | `true` | 4.3.0 |
| onOpenChange | 预览显示状态改变时的回调 | `(open: boolean) => void` | - | 4.3.0 |
| onTransform | 预览图片变换（缩放/旋转/翻转/移动/重置）时的回调 | `(info: { transform: TransformType; action: TransformAction }) => void` | - | 4.3.0 |
| ~~onVisibleChange~~ | 预览显示状态改变时的回调，请使用 `onOpenChange` 替代 | `(visible: boolean, prevVisible: boolean) => void` | - | 2.0.0 |

### Image.PreviewGroup

用于多张图片组合预览，支持包裹多个 `<a-image>` 或直接传入 `items` 数组。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| countRender | 自定义预览计数渲染（亦可在 `preview.countRender` 中配置） | `(current: number, total: number) => VueNode` | - | 4.3.0 |
| fallback | 加载失败容错地址 | string | - | 4.3.0 |
| icons | 自定义预览操作图标 | `{ rotateLeft?, rotateRight?, zoomIn?, zoomOut?, close?, left?, right?, flipX?, flipY? }` | - | 4.3.0 |
| items | 预览图片列表 | `Array<string \| { src: string; alt?: string; width?: string \| number; height?: string \| number; crossOrigin?: string }>` | - | 4.3.0 |
| preview | 预览参数，为 `false` 时禁用 | `boolean \| [PreviewGroupType](#previewgrouptype)` | `true` | 2.0.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| onChange | 切换预览图片时的回调（亦可在 `preview.onChange` 中配置） | `(current: number, prevCurrent: number) => void` | - | 4.3.0 |

### PreviewGroupType

继承 [PreviewType](#previewtype) 的全部配置，并额外支持：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| countRender | 自定义预览计数渲染 | `(current: number, total: number) => VueNode` | - | 4.3.0 |
| current | 当前展示图片的索引 | number | `0` | 3.2.0 |
| imageRender | 自定义预览内容（包含 `current` 索引） | `(originalNode: VNode, info: { transform: TransformType; image: ImgInfo; current: number }) => VueNode` | - | 4.3.0 |
| onChange | 切换预览图片时的回调 | `(current: number, prevCurrent: number) => void` | - | 4.3.0 |
| onOpenChange | 预览显示状态改变时的回调 | `(open: boolean, info: { current: number }) => void` | - | 4.3.0 |
| ~~onVisibleChange~~ | 预览显示状态改变时的回调，请使用 `onOpenChange` 替代 | `(visible: boolean, prevVisible: boolean, current?: number) => void` | - | 2.0.0 |

其他属性见 [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
