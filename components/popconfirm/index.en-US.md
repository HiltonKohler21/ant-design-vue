---
category: Components
type: Feedback
title: Popconfirm
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a7tqQ6wrdeAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iwYsQpeFcB0AAAAAAAAAAAAADrJ8AQ/original
---

Pop up a bubble confirmation box for an action.

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## API

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| cancelButton | Custom render cancel button | slot | - | 3.0 |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | The text of the Cancel button | string \| slot | `Cancel` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultOpen | Whether the popconfirm is open by default | boolean | `false` | 4.3.0 |
| description | The description of the confirmation box title | string \| slot \| () => VueNode | - | 4.0 |
| disabled | Whether show popconfirm when click its childrenNode | boolean | `false` |  |
| icon | Customize icon of confirmation | VueNode \| slot \| null | `<ExclamationCircleFilled />` |  |
| okButton | Custom render confirm button | slot | - | 3.0 |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  |
| okText | The text of the Confirm button | string \| slot | `OK` |  |
| okType | Button `type` of the Confirm button | string | `primary` |  |
| open (v-model) | Whether the popconfirm is open | boolean | `false` | 4.0 |
| rootClassName | Root class name | string | - | 4.3.0 |
| showCancel | Show cancel button | boolean | `true` | 3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| title | The title of the confirmation box | string \| slot \| () => VueNode | - |  |

> Supported `SemanticDOM` keys: `root` \| `container` \| `body` (alias of `container`) \| `title` \| `content` \| `arrow` \| `icon` (`4.3.0`).

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| cancel | A callback of cancel | function(e) |  |
| confirm | A callback of confirmation | function(e) |  |
| openChange | Callback executed when visibility of the tooltip card is changed | function(open) | 4.0 |
| popupClick | A callback of popup click | function(e) |  |

Consult [Tooltip's documentation](/components/tooltip/#api) to find more APIs.

## Design Token

| Token Name  | Description           | Type   | Default Value          |
| ----------- | --------------------- | ------ | ---------------------- |
| zIndexPopup | z-index of Popconfirm | number | `zIndexPopupBase + 60` |

## Note

Please ensure that the child node of `Popconfirm` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.
