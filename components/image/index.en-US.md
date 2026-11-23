---
category: Components
type: Data Display
title: Image
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
| fallback | Load failure fault-tolerant src | string | - | 2.0.0 |
| height | Image height | string \| number | - | 2.0.0 |
| placeholder | Load placeholder, use default placeholder when set `true` | boolean \| slot | - | 2.0.0 |
| preview | Preview config, disabled when `false` | boolean \| [previewType](#previewtype) | `true` | 2.0.0 |
| previewMask | Custom mask | false \| function \| slot | - | 3.2.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| src | Image path | string | - | 2.0.0 |
| width | Image width | string \| number | - | 2.0.0 |
| wrapperClassName | Class name of image wrapper element | string | - | 4.3.0 |
| wrapperStyle | Inline style of image wrapper element | CSSProperties | - | 4.3.0 |

### Events

| Events Name | Description          | Arguments              | Version |
| ----------- | -------------------- | ---------------------- | ------- |
| error       | Load failed callback | (event: Event) => void | 3.2.0   |

### Image.PreviewGroup

Wrap multiple `<a-image>` components to enable grouped gallery preview with left/right navigation.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| fallback | Load failure fault-tolerant src (configurable via `ConfigProvider.image.fallback` or inner `Image`) | string | - | 4.3.0 |
| icons | Custom preview operation icons | { rotateLeft?: VueNode; rotateRight?: VueNode; zoomIn?: VueNode; zoomOut?: VueNode; close?: VueNode \| boolean; left?: VueNode; right?: VueNode; flipX?: VueNode; flipY?: VueNode } | - | 4.3.0 |
| preview | Preview config, disabled when `false` | boolean \| [PreviewGroupPreview](#previewtype) | `true` | 2.0.0 |

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
  current?: number; // Current preview image index in PreviewGroup
}
```

Other attributes [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
