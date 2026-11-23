---
category: Components
type: Data Display
title: Empty
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZdiZSLzEV0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*obM7S5lIxeMAAAAAAAAAAAAADrJ8AQ/original
---

Empty state placeholder.

## When To Use

- When there is no data provided, display for friendly tips.
- User tutorial to create something in fresh new situation.

## API

```jsx
<Empty>
  <Button>Create</Button>
</Empty>
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'image' \| 'description' \| 'footer', string> \| (info: { props }) => Record<'root' \| 'image' \| 'description' \| 'footer', string>` | - | 4.3.0 |
| description | Customize description | string \| v-slot | - |  |
| image | Customize image. Will treat as image url when string provided | string \| v-slot | `Empty.PRESENTED_IMAGE_DEFAULT` |  |
| ~~imageStyle~~ | Style of image (deprecated, please use `styles.image` instead) | CSSProperties | - |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'image' \| 'description' \| 'footer', CSSProperties> \| (info: { props }) => Record<'root' \| 'image' \| 'description' \| 'footer', CSSProperties>` | - | 4.3.0 |

## Built-in images

- Empty.PRESENTED_IMAGE_SIMPLE

  <img src="https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png" height="35px" />

- Empty.PRESENTED_IMAGE_DEFAULT

  <img src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" height="100px" />
