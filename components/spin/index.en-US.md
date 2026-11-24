---
category: Components
type: Feedback
title: Spin
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
---

Used for the loading status of a page or a block.

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## API

| Property | Description | Type | Default Value | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |  |
| description | Customize description content | VueNode \| slot | - | 4.3.0 |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | 4.3.0 |
| indicator | Vue node of the spinning indicator | vNode \| slot | - |  |
| percent | The progress percentage, when set to `'auto'`, it will be an indeterminate progress | number \| `'auto'` | - | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| size | The size of Spin, options: `small`, `medium` and `large` | string | `medium` |  |
| spinning | Whether Spin is visible | boolean | true |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| ~~tip~~ | Customize description content when Spin has children. Deprecated, use `description` instead | VueNode \| slot | - | slot 3.0 |
| ~~wrapperClassName~~ | The className of wrapper when Spin has children. Deprecated, use `classNames.root` instead | string | - |  |

> Supported `SemanticDOM` keys: `root` \| `section` \| `indicator` \| `description` \| `container` (also supports legacy aliases `tip` / `mask` / `wrapper`).

### Static Method

- `Spin.setDefaultIndicator(indicator)` / `Spin.setDefaultIndicator({ indicator })`

  You can define the default spin element globally.

  ```jsx
  import { h } from 'vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';

  Spin.setDefaultIndicator(h(LoadingOutlined, { spin: true }));
  ```
