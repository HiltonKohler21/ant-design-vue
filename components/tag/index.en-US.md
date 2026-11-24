---
category: Components
type: Data Display
title: Tag
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
---

Tag for categorizing or markup.

## When To Use

- It can be used to tag by dimension or property.
- When categorizing.

## API

### Tag

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closable | Whether to show the close button. An object can configure `closeIcon`, `disabled`, and `aria-*` attributes | `boolean \| { closeIcon?: VueNode; disabled?: boolean; 'aria-label'?: string }` | `false` | 4.3.0 |
| closeIcon | Custom close icon, as a shorthand for `closable`. When `closable` is not set, `true` shows the default close button, while `null` or `false` hides it | VueNode \| slot | `false` | 2.0.0 |
| color | Color of the Tag | string | `default` when `variant="solid"` | `solid` default color: 4.3.0 |
| disabled | Whether the tag is disabled | boolean | `false` | 4.3.0 |
| href | The address to jump when clicking; renders Tag as an `<a>` element when set | string | - | 4.3.0 |
| icon | Set the icon of tag | VueNode \| slot | - | 2.0.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| target | Same as `target` attribute of `<a>`, works when `href` is specified | string | - | 4.3.0 |
| variant | Variant of the tag | `'filled' \| 'solid' \| 'outlined'` | `'filled'` | 4.3.0 |
| ~~bordered~~ | Whether has border style, please use `variant="filled"` instead | boolean | `true` | 4.x |

> Supported `SemanticDOM` keys: `root` \| `icon` \| `content` \| `close`.

### Tag Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| close | Callback executed when tag is closed (can be prevented via `e.preventDefault()`) | (e: MouseEvent) => void |

### Tag.CheckableTag

| Property         | Description           | Type            | Default | Version |
| ---------------- | --------------------- | --------------- | ------- | ------- |
| checked(v-model) | Checked status of Tag | boolean         | `false` |         |
| disabled         | Disable check/uncheck | boolean         | `false` | 4.3.0   |
| icon             | Set the icon of tag   | VueNode \| slot | -       | 4.3.0   |

### Tag.CheckableTag Events

| Events Name | Description                                     | Arguments                  |
| ----------- | ----------------------------------------------- | -------------------------- |
| change      | Callback executed when Tag is checked/unchecked | (checked: boolean) => void |

### Tag.CheckableTagGroup

Selectable tag group (registered globally as `<a-checkable-tag-group>`).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure (`root` \| `item`). Supports object or function | `Record<'root' \| 'item', string> \| (info: { props }) => Record<'root' \| 'item', string>` | - | 4.3.0 |
| defaultValue | Initial checked value(s) | `string \| number \| Array<string \| number> \| null` | - | 4.3.0 |
| disabled | Disable check/uncheck | boolean | `false` | 4.3.0 |
| multiple | Multiple select mode | boolean | `false` | 4.3.0 |
| options | Option list. Object options support per-item `className`, `style`, `disabled`, and `icon` | `Array<{ value: string \| number; label: VueNode; className?: string; style?: CSSProperties; disabled?: boolean; icon?: VueNode } \| string \| number>` | - | 4.3.0 |
| styles | Customize inline style for each semantic structure (`root` \| `item`). Supports object or function | `Record<'root' \| 'item', CSSProperties> \| (info: { props }) => Record<'root' \| 'item', CSSProperties>` | - | 4.3.0 |
| value(v-model) | Value of checked tag(s) | `string \| number \| Array<string \| number> \| null` | - | 4.3.0 |

### Tag.CheckableTagGroup Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Callback when Tag is checked/unchecked | `(value: string \| number \| Array<string \| number> \| null) => void` | 4.3.0 |
