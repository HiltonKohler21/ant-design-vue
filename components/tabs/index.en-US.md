---
category: Components
type: Navigation
title: Tabs
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*72NDQqXkyOEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8HMoTZUoSGoAAAAAAAAAAAAADrJ8AQ/original
---

Tabs make it easy to switch between different views.

## When To Use

Ant Design has 3 types of Tabs for different situations.

- Card Tabs: for managing too many closeable views.
- Normal Tabs: for functional aspects of a page.
- [RadioButton](/ant-design/components/radio/): for secondary tabs.

## API

### Tabs

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey(v-model) | Current TabPane's key | string \| number | - |  |
| addIcon | Customize add icon, only works while `type="editable-card"` | VueNode | `<PlusOutlined />` | 4.3.0 |
| animated | Whether to change tabs with animation. Only works while tabPosition=`"top"` \| `"bottom"` | boolean \| { inkBar: boolean, tabPane: boolean } | `true`, `false` when `type="card"` |  |
| centered | Whether to display the labels in the center | boolean | false | 3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props: TabsProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| defaultActiveKey | Initial active TabPane's key, if `activeKey` is not set | string \| number | first panel's key | 4.3.0 |
| ~~destroyInactiveTabPane~~ | Whether destroy inactive TabPane when change tab (deprecated, please use `destroyOnHidden`) | boolean | false |  |
| destroyOnHidden | Whether destroy inactive TabPane when change tab | boolean | false | 4.3.0 |
| hideAdd | Hide plus icon or not. Only works while `type="editable-card"` | boolean | `false` |  |
| indicator | Customize indicator size and alignment | `{ size?: number \| ((origin: number) => number); align?: 'start' \| 'center' \| 'end' }` | - | 4.3.0 |
| ~~indicatorSize~~ | Customize indicator size (deprecated, please use `indicator.size`) | `number \| ((origin: number) => number) \| 'small' \| 'large'` | - | 4.3.0 |
| items | Configure tab content | [TabItemType](#tabitemtype)[] | [] | 4.3.0 |
| more | Customize the collapse menu | [MoreProps](#moreprops) | `{ icon: <EllipsisOutlined />, trigger: ['hover'] }` | 4.3.0 |
| ~~popupClassName~~ | ClassName for more dropdown (deprecated, please use `classNames.popup`) | string | - |  |
| removeIcon | Customize remove icon, only works while `type="editable-card"` | VueNode | `<CloseOutlined />` | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| size | preset tab bar size | `large` \| `middle` \| `small` | `middle` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props: TabsProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| tabBarExtraContent | Extra content in tab bar (deprecated, please use `leftExtra` / `rightExtra` slot) | VueNode \| slot | - |  |
| tabBarGutter | The gap between tabs | number | - |  |
| tabBarStyle | Tab bar style object | CSSProperties | - |  |
| tabPlacement | Placement of tabs | `top` \| `right` \| `bottom` \| `left` \| `start` \| `end` | `top` | 4.3.0 |
| ~~tabPosition~~ | Position of tabs (deprecated, please use `tabPlacement` instead) | `top` \| `right` \| `bottom` \| `left` | `top` |  |
| type | Basic style of tabs | `line` \| `card` \| `editable-card` | `line` |  |

> `SemanticDOM` slots: `root` \| `header` \| `item` \| `remove` \| `indicator` \| `body` \| `content` \| `popup.root`.

### MoreProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | The custom collapse icon | VueNode | `<EllipsisOutlined />` | 4.3.0 |
| popupRender | Customize the dropdown menu render | `(menu: VueNode, info: { restTabs: Tab[]; onClose: () => void }) => VueNode` | - | 4.3.0 |
| trigger | The trigger mode of the collapse dropdown | `Array<'click' \| 'hover' \| 'contextmenu'>` \| `'click' \| 'hover' \| 'contextmenu'` | `['hover']` | 4.3.0 |
| overlayClassName | Class name of the collapse dropdown root element | string | - | 4.3.0 |
| overlayStyle | Style of the collapse dropdown root element | CSSProperties | - | 4.3.0 |

### TabItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | TabPane's content | VueNode | - | 4.3.0 |
| closable | Whether show close icon, only works while `type="editable-card"` | boolean | true | 4.3.0 |
| closeIcon | Customize close icon, only works while `type="editable-card"` (hidden when set to `null` or `false`) | VueNode | - | 4.3.0 |
| ~~destroyInactiveTabPane~~ | Whether destroy inactive TabPane when change tab (deprecated, please use `destroyOnHidden`) | boolean | false | 4.3.0 |
| destroyOnHidden | Whether destroy inactive TabPane when change tab | boolean | false | 4.3.0 |
| disabled | Disabled a tab | boolean | false | 4.3.0 |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false | 4.3.0 |
| icon | Tab header icon element | VueNode | - | 4.3.0 |
| key | TabPane's key | string \| number | - | 4.3.0 |
| label | Show text in TabPane's head | VueNode | - | 4.3.0 |

### Tabs Slots

| Slot Name    | Description                    | Type              |
| ------------ | ------------------------------ | ----------------- |
| addIcon      | Customize add icon             | -                 |
| leftExtra    | Extra content in tab bar left  | -                 |
| moreIcon     | The custom icon of ellipsis    | -                 |
| renderTabBar | Replace the TabBar             | { DefaultTabBar } |
| rightExtra   | Extra content in tab bar right | -                 |

### Tabs Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | Callback executed when active tab is changed | Function(activeKey) {} |
| edit | Callback executed when tab is added or removed. Only works while `type="editable-card"` | (action === 'add' ? event : targetKey, action): void |
| tabClick | Callback executed when tab is clicked | Function(key, event) |
| tabScroll | Trigger when tab scroll | { direction: 'left' \| 'right' \| 'top' \| 'bottom' } |

### Tabs.TabPane

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| closable | Whether show close icon, only works while `type="editable-card"` | boolean | true |
| destroyInactiveTabPane | Whether destroy inactive TabPane when change tab | boolean | false |
| disabled | Disabled a tab | boolean | false |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false |
| key | TabPane's key | string \| number | - |
| tab | Show text in TabPane's head | string \| slot | - |

### Tabs.TabPane Slots

| Slot Name | Description                                                   | Arguments |
| --------- | ------------------------------------------------------------- | --------- |
| closeIcon | Customize close icon, Only works while `type="editable-card"` | -         |
| tab       | Show text in TabPane's head                                   | -         |
