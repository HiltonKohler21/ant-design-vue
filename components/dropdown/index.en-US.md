---
category: Components
type: Navigation
title: Dropdown
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mBBcQ6goljkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5qm4S4Zgh2QAAAAAAAAAAAAADrJ8AQ/original
---

A dropdown list.

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

## API

### Dropdown

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | This value will be merged into placement's config, please refer to the settings [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrow | Whether the dropdown arrow should be visible | boolean \| { pointAtCenter: boolean } | false | 3.3.0 |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean \| { adjustX?: 0 \| 1; adjustY?: 0 \| 1 } | true | 4.3.0 |
| destroyOnHidden | Whether destroy dropdown when hidden (replaces `destroyPopupOnHide`) | boolean | false | 4.3.0 |
| ~~destroyPopupOnHide~~ | Whether destroy dropdown when hidden (deprecated, please use `destroyOnHidden` instead) | boolean | false | 3.0 |
| disabled | Whether the dropdown menu is disabled | boolean | - |  |
| ~~dropdownRender~~ | Customize dropdown content (deprecated, please use `popupRender` instead) | `(menus: VNode) => VNode` | - |  |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a `div` element in `body`, you can reset it to the scrolling area and make a relative reposition. [example](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | Function(triggerNode) | `() => document.body` |  |
| menu | The menu props | [MenuProps](/components/menu/#api) | - | 4.3.0 |
| open(v-model) | Whether the dropdown menu is open | boolean | - | 4.0 |
| overlay(v-slot) | The dropdown menu | [Menu](/components/menu) | - |  |
| overlayClassName | Class name of the dropdown root element | string | - |  |
| overlayStyle | Style of the dropdown root element | object | - |  |
| placement | Placement of pop menu: `bottomLeft` `bottom` `bottomRight` `topLeft` `top` `topRight` | String | `bottomLeft` |  |
| popupRender | Customize dropdown content (replaces `dropdownRender`) | `(menus: VNode) => VNode` | - | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| trigger | The trigger mode which executes the drop-down action, hover doesn't work on mobile device | Array&lt;`click` \| `hover` \| `contextmenu`> | `['hover']` |  |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| openChange | A callback function takes an argument: `open`, is executed when the open state is changed. Not trigger when hidden by click item | function(open) | 4.0 |

You should use [Menu](/components/menu/) as `overlay`. The menu items and dividers are also available by using `Menu.Item` and `Menu.Divider`.

> Warning: You must set a unique `key` for `Menu.Item`.
>
> Menu of Dropdown is unselectable by default, you can make it selectable via `<Menu selectable>`.

### Dropdown.Button

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| buttonsRender | Custom buttons inside Dropdown.Button | `(buttons: VNode[]) => VNode[]` | - | 4.3.0 |
| disabled | Whether the dropdown menu is disabled | boolean | - |  |
| icon | Icon (appears on the right) | VNode \| slot | - | 1.5.0 |
| loading | Set the loading status of button | boolean \| { delay: number } | false | 3.0 |
| open(v-model) | Whether the dropdown menu is open | boolean | - |  |
| overlay(v-slot) | The dropdown menu | [Menu](/components/menu) | - |  |
| placement | Placement of pop menu: `bottomLeft` `bottom` `bottomRight` `topLeft` `top` `topRight` | String | `bottomLeft` |  |
| size | Size of the button, the same as [Button](/components/button) | string | `default` |  |
| trigger | The trigger mode which executes the drop-down action | Array&lt;`click` \| `hover` \| `contextmenu`> | `['hover']` |  |
| type | Type of the button, the same as [Button](/components/button) | string | `default` |  |

### Dropdown.Button events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| click | A callback function, the same as [Button](/components/button), which will be executed when you click the button on the left | Function |  |
| openChange | A callback function takes an argument: `open`, is executed when the open state is changed. Not trigger when hidden by click item | function(open) | 4.0 |
