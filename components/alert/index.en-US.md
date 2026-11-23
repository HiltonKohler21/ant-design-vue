---
category: Components
type: Feedback
title: Alert
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Ct7bT7rrTTAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-U3XQqYN7VsAAAAAAAAAAAAADrJ8AQ/original
---

Alert component for feedback.

## When To Use

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| action | The action of Alert | VueNode \| slot | - | 4.0.0 (prop: 4.3.0) |
| ~~afterClose~~ | Called when close animation is finished, please use `closable.afterClose` instead | () => void | - |  |
| banner | Whether to show as banner | boolean | `false` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closable | The config of closable | boolean \| [ClosableType](#closabletype) | `false` | 4.3.0 |
| ~~closeIcon~~ | Custom close icon, please use `closable.closeIcon` instead | VueNode \| slot | `<CloseOutlined />` | 3.0 |
| ~~closeText~~ | Close text to show, please use `closable.closeIcon` instead | string \| slot | - |  |
| description | Additional content of Alert | VueNode \| slot | - |  |
| icon | Custom icon, effective when `showIcon` is `true` | VueNode \| slot | - |  |
| ~~message~~ | Content of Alert, please use `title` instead | VueNode \| slot | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| showIcon | Whether to show icon | boolean | `false`, in `banner` mode default is `true` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| title | Content of Alert | VueNode \| slot | - | 4.3.0 |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | `success` \| `info` \| `warning` \| `error` | `info`, in `banner` mode default is `warning` |  |
| variant | Variant of Alert style | `outlined` \| `filled` | `outlined` | 4.3.0 |

> Supported `SemanticDOM` keys: `root` \| `icon` \| `section` \| `title` \| `description` \| `actions` \| `close`.

### ClosableType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Called when close animation is finished | () => void | - | 4.3.0 |
| closeIcon | Custom close icon | VueNode | - | 4.3.0 |
| disabled | Whether the close button is disabled | boolean | `false` | 4.3.0 |
| onClose | Callback when Alert is closed | (e: MouseEvent) => void | - | 4.3.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| close | Callback when Alert is closed (prefer `closable.onClose`) | (e: MouseEvent) => void | - |

### Alert.ErrorBoundary

Catches errors thrown by descendant components and displays an error Alert (registered globally as `<a-alert-error-boundary>`).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| description | Custom error description to show | VueNode \| slot | `error.stack` | 4.3.0 |
| ~~message~~ | Custom error title to show, please use `title` instead | VueNode \| slot | `error` | 4.3.0 |
| title | Custom error title to show | VueNode \| slot | `error` | 4.3.0 |
