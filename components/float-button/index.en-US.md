---
category: Components
type: Other
title: FloatButton
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HS-wTIIwu0kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a0hwTY_rOSUAAAAAAAAAAAAADrJ8AQ/original
---

FloatButton. Available since `4.0.0`.

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## API

> This component is available since `ant-design-vue@4.0.0`.

### common API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| backTop | Whether to scroll back to top when clicked | boolean | false | 4.3.0 |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](/components/badge#api) | - |  |
| content | Text and other (replaces `description`) | string \| slot | - | 4.3.0 |
| ~~description~~ | Text and other (deprecated, please use `content` instead) | string \| slot | - |  |
| disabled | Disabled state of button | boolean | false | 4.3.0 |
| href | The target of hyperlink | string | - |  |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | `'submit'` \| `'reset'` \| `'button'` | `'button'` | 4.3.0 |
| icon | Set the icon component of button | slot | - |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| shape | Setting button shape | `circle` \| `square` | `circle` |  |
| target | Specifies where to display the linked URL | string | - |  |
| tooltip | The text shown in the tooltip | string \| slot | - |  |
| type | Setting button type | `default` \| `primary` | `default` |  |

### common events

| Events Name | Description                             | Arguments         | Version |
| ----------- | --------------------------------------- | ----------------- | ------- |
| click       | Set the handler to handle `click` event | `(event) => void` |         |

### FloatButton.Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closeIcon | Customize close button icon | slot | `<CloseOutlined />` |  |
| items | Config-based list of child FloatButtons | [FloatButtonProps](#common-api)\[] | - | 4.3.0 |
| open(v-model) | Whether the menu is visible or not | boolean | - |  |
| placement | Customize menu animation placement | `top` \| `right` \| `bottom` \| `left` | `top` | 4.3.0 |
| shape | Setting button shape of children | `circle` \| `square` | `circle` |  |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - |  |

### FloatButton.Group Events

| Events Name | Description                                   | Arguments               | Version |
| ----------- | --------------------------------------------- | ----------------------- | ------- |
| openChange  | Callback executed when active menu is changed | (open: boolean) => void |         |

### FloatButton.BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top (ms) | number | 450 |  |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window |  |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 |  |

### FloatButton.BackTop Events

| Events Name | Description                                | Arguments         | Version |
| ----------- | ------------------------------------------ | ----------------- | ------- |
| click       | Callback function when clicking the button | `(event) => void` |         |
