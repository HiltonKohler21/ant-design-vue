---
category: Components
type: Feedback
title: Spin
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
---

A spinner for displaying loading state of a page or a section.

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## API

| Property | Description | Type | Default Value | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| delay | specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |  |
| description | Customize description content (takes priority over `tip`) | VueNode \| slot | - | 4.3.0 |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | 4.3.0 |
| indicator | vue node of the spinning indicator | vNode \| slot | - |  |
| percent | Progress percentage (mutually exclusive with `indicator`); when set to `'auto'`, automatically advances progress | number \| `'auto'` | - | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| size | size of Spin, options: `small`, `default` and `large` | string | `default` |  |
| spinning | whether Spin is visible | boolean | true |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| ~~tip~~ | customize description content when Spin has children, please use `description` instead | string \| slot | - | slot 3.0 |
| wrapperClassName | className of wrapper when Spin has children | string | - |  |

> Supported `SemanticDOM` keys: `root` \| `wrapper` \| `mask` \| `section` \| `indicator` \| `description` \| `tip` \| `container`.

### Static Method

- `Spin.setDefaultIndicator({indicator})` As `indicator`, you can define the global default spin element

```jsx
import { h } from 'vue';
Spin.setDefaultIndicator({
  indicator: h('i', { class: 'anticon anticon-loading anticon-spin ant-spin-dot' }),
});
```
