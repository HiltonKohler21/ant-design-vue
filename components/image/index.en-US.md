---
category: Components
type: Data Display
title: Image
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FbOCS6aFMeUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LVQ3R5JjjJEAAAAAAAAAAAAADrJ8AQ/original
---

Previewable image.

## When To Use

- When you need to display pictures.
- Display when loading a large image or fault tolerant handling when loading fails.

## API

### Image

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| alt | Image description | string | - | 2.0.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| fallback | Load failure fault-tolerant src | string | - | 2.0.0 |
| height | Image height | string \| number | - | 2.0.0 |
| placeholder | Load placeholder, use default placeholder when set `true` | boolean \| VueNode \| slot | - | 2.0.0 |
| preview | Preview config, disabled when `false` | boolean \| [PreviewType](#previewtype) | `true` | 2.0.0 |
| previewMask | Custom thumbnail cover (prefer `preview.cover`) | false \| function \| slot | - | 3.2.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| src | Image path | string | - | 2.0.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| width | Image width | string \| number | - | 2.0.0 |
| wrapperClassName | Class name of image wrapper element | string | - | 4.3.0 |
| ~~wrapperStyle~~ | Inline style of image wrapper element (prefer `styles.root`) | CSSProperties | - | 4.3.0 |

> Supported `SemanticDOM` keys: `root` \| `image` \| `cover` \| `popup: { root, mask, body, footer, actions, close }`.

### Events

| Events Name | Description          | Arguments              | Version |
| ----------- | -------------------- | ---------------------- | ------- |
| error       | Load failed callback | (event: Event) => void | 3.2.0   |

### PreviewType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Custom toolbar render | `(originalNode: VNode, info: ToolbarRenderInfoType) => VueNode` | - | 4.3.0 |
| closeIcon | Custom close icon | VueNode \| boolean | - | 4.3.0 |
| cover | Custom thumbnail hover cover | `VueNode \| { coverNode?: VueNode; placement?: 'top' \| 'bottom' \| 'center' } \| false` | - | 4.3.0 |
| getContainer | Specify container for preview mounting; `false` mounts in place | `string \| HTMLElement \| (() => HTMLElement) \| false` | - | 2.0.0 |
| icons | Custom preview operation icons | `{ rotateLeft?, rotateRight?, zoomIn?, zoomOut?, close?, left?, right?, flipX?, flipY? }` | - | 4.3.0 |
| imageRender | Custom preview content | `(originalNode: VNode, info: { transform: TransformType; image: ImgInfo }) => VueNode` | - | 4.3.0 |
| mask | Preview backdrop mask config | `boolean \| { enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` | 4.3.0 |
| ~~maskClassName~~ | Thumbnail mask class name, please use `classNames.cover` instead | string | - | 2.0.0 |
| maxScale | Maximum zoom scale | number | `50` | 4.3.0 |
| minScale | Minimum zoom scale | number | `1` | 4.3.0 |
| movable | Whether the preview image can be dragged | boolean | `true` | 4.3.0 |
| open | Whether to display preview | boolean | - | 4.3.0 |
| rootClassName | Root DOM class name for preview | string | - | 4.3.0 |
| scaleStep | Zoom step multiplier (`1 + scaleStep`) | number | `0.5` | 4.3.0 |
| src | Custom preview src | string | - | 2.0.0 |
| ~~toolbarRender~~ | Custom toolbar, please use `actionsRender` instead | `(originalNode: VNode, info: ToolbarRenderInfoType) => VueNode` | - | 4.3.0 |
| ~~visible~~ | Whether to show preview, please use `open` instead | boolean | - | 2.0.0 |
| wheel | Whether to enable mouse wheel zoom | boolean | `true` | 4.3.0 |
| onOpenChange | Callback when preview open state changes | `(open: boolean) => void` | - | 4.3.0 |
| onTransform | Callback when preview transform changes | `(info: { transform: TransformType; action: TransformAction }) => void` | - | 4.3.0 |
| ~~onVisibleChange~~ | Callback when `visible` changes, please use `onOpenChange` instead | `(visible: boolean, prevVisible: boolean) => void` | - | 2.0.0 |

### Image.PreviewGroup

Wrap multiple `<a-image>` components or provide an `items` array for grouped gallery preview.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| countRender | Custom preview count render (also configurable in `preview.countRender`) | `(current: number, total: number) => VueNode` | - | 4.3.0 |
| fallback | Fallback URL on load error | string | - | 4.3.0 |
| icons | Custom preview operation icons | `{ rotateLeft?, rotateRight?, zoomIn?, zoomOut?, close?, left?, right?, flipX?, flipY? }` | - | 4.3.0 |
| items | Array of preview items | `Array<string \| { src: string; alt?: string; width?: string \| number; height?: string \| number; crossOrigin?: string }>` | - | 4.3.0 |
| preview | Preview configuration, disabled when `false` | `boolean \| [PreviewGroupType](#previewgrouptype)` | `true` | 2.0.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| onChange | Callback when switching preview image (also configurable in `preview.onChange`) | `(current: number, prevCurrent: number) => void` | - | 4.3.0 |

### PreviewGroupType

Extends [PreviewType](#previewtype) with additional group preview properties:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| countRender | Custom preview count render | `(current: number, total: number) => VueNode` | - | 4.3.0 |
| current | Index of current preview image | number | `0` | 3.2.0 |
| imageRender | Custom preview content (includes `current` index) | `(originalNode: VNode, info: { transform: TransformType; image: ImgInfo; current: number }) => VueNode` | - | 4.3.0 |
| onChange | Callback when changing preview image | `(current: number, prevCurrent: number) => void` | - | 4.3.0 |
| onOpenChange | Callback when preview open state changes | `(open: boolean, info: { current: number }) => void` | - | 4.3.0 |
| ~~onVisibleChange~~ | Callback when `visible` changes, please use `onOpenChange` instead | `(visible: boolean, prevVisible: boolean, current?: number) => void` | - | 2.0.0 |

Other attributes [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
