# 通用属性

`@hiltonkohler21/ant-design-vue@4.3.0` 在组件库层面统一了一组跨组件通用的属性与样式定制协议，涵盖根容器类名、覆盖 **61 个组件**的静态与函数式**语义化 DOM（`classNames` / `styles`）**、视觉形态变体 `variant`、弹层统一销毁策略以及 **72 项 `ConfigProvider` 组件级默认配置**。

> 以下通用属性适用于绝大多数组件；个别无 DOM 容器或特殊结构的组件请以对应组件 API 文档与交互式 `#semantic-dom` 预览器为准。

## 基础通用属性

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `class` | 自定义组件主容器类名（Vue 原生 attribute 透传） | `string \| Record<string, boolean> \| Array<any>` | - | - |
| `style` | 自定义组件主容器内联样式（Vue 原生 attribute 透传） | `CSSProperties` | - | - |
| `rootClassName` | 添加在组件最外层根节点（含弹层根容器）的类名，便于精准样式覆盖 | `string` | - | `4.2.7` |
| `classNames` | 语义化内部结构类名映射（支持静态对象或函数），用于精细定制组件各部位类名 | `Record<SemanticName, string> \| ((info: { props }) => Record<SemanticName, string>)` | - | `4.2.7` / `4.3.0` |
| `styles` | 语义化内部结构内联样式映射（支持静态对象或函数），替代 `bodyStyle` / `headStyle` 等旧属性 | `Record<SemanticName, CSSProperties> \| ((info: { props }) => Record<SemanticName, CSSProperties>)` | - | `4.2.7` / `4.3.0` |
| `variant` | 组件形态变体，替代旧版布尔值 `bordered` 或 `dashed` | 见下方 [形态变体 `variant`](#形态变体-variant) | `outlined` | `4.2.7` / `4.3.0` |
| `destroyOnHidden` | 隐藏或关闭时销毁内部子节点，替代 `destroyOnClose` / `destroyInactiveTabPane` 等旧属性 | `boolean` | `false` | `4.2.7` |
| `prefixCls` | 自定义组件样式前缀（通常通过 `ConfigProvider` 统一配置） | `string` | `ant-<component>` | - |

## `rootClassName` 与 `class` 的区别

对于包含多层包裹或挂载在 `body` 的浮层组件（如 `Drawer`、`Modal`、`Tooltip`、`Select` 等）：

- **`class`**：通常挂在核心内容容器或触发器上；
- **`rootClassName`**：始终挂在组件的最外层根节点（例如 `.ant-drawer`、`.ant-modal-root`），避免因内部 DOM 结构调整而导致自定义样式失效。

```vue
<template>
  <a-modal v-model:open="open" root-class-name="my-order-modal" title="订单详情">
    <p>使用 rootClassName 可精准命中 .ant-modal-root 根节点。</p>
  </a-modal>
</template>
```

## 语义化 DOM（`classNames` 与 `styles`）

`@hiltonkohler21/ant-design-vue` 通过成对的 `classNames` 和 `styles` 属性开放组件内部各语义部位的定制能力，替代过去分散的 `bodyStyle`、`headStyle`、`headerStyle`、`footerStyle`、`maskStyle`、`dropdownStyle`、`imageStyle`、`wrapperStyle` 与 `orientationMargin` 等属性。

> **交互式语义化 DOM 预览器**：所有支持语义化样式的组件文档页均在 `#design-tokens` 上方内置了 **`语义化 DOM`（`#semantic-dom`）** 实时预览器（例如体验 [Alert 语义化 DOM](/components/alert-cn#semantic-dom)、[Card 语义化 DOM](/components/card-cn#semantic-dom) 或 [Button 语义化 DOM](/components/button-cn#semantic-dom)）。悬停或点击右侧语义位即可高亮对应的真实 DOM 节点，并支持一键复制键名与查看示例代码。

### 静态对象写法

直接传入以语义位名称为键的普通对象即可定制任意内部结构：

```vue
<template>
  <a-card
    title="账单概览"
    :class-names="{ header: 'billing-header', body: 'billing-body' }"
    :styles="{
      header: { borderBottom: 'none', paddingBottom: '0' },
      body: { paddingTop: '12px' },
    }"
  >
    语义化 classNames 与 styles 可直接定制内部任意部位。
  </a-card>
</template>
```

### 函数式写法（`({ props }) => ...`）

在 `4.3.0` 中，`classNames` 与 `styles` 支持传入**回调函数**，通过 `{ props }` 读取组件当前属性动态计算类名与内联样式，并可与 `ConfigProvider` 全局默认语义配置自动合并：

```vue
<template>
  <a-space orientation="vertical" :size="16" style="width: 100%">
    <a-alert
      title="动态语义化样式"
      description="根据当前 props 动态调整提示框圆角与标题字重。"
      type="info"
      variant="filled"
      show-icon
      :class-names="({ props }) => ({ root: props.variant === 'filled' ? 'alert-filled-box' : '' })"
      :styles="
        ({ props }) => ({
          root: { borderRadius: '10px' },
          title: { fontWeight: props.variant === 'filled' ? 600 : 500 },
        })
      "
    />

    <a-listy
      :items="items"
      row-key="id"
      :height="200"
      :styles="({ props }) => ({ item: { fontWeight: props.rowHoverable ? 500 : 400 } })"
    >
      <template #item="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </a-listy>
  </a-space>
</template>

<script setup lang="ts">
const items = [
  { id: 1, name: '函数式 classNames' },
  { id: 2, name: '函数式 styles' },
];
</script>
```

### 全部 61 个支持语义化 DOM 的组件清单

点击下方链接可直接跳转对应组件页的 **`语义化 DOM`（`#semantic-dom`）** 交互预览器：

| 组件 | 可用语义位（`classNames` / `styles` 键名） | 交互式预览器 |
| --- | --- | --- |
| `Alert` | `root`、`icon`、`section`、`title`、`description`、`actions`、`close` | [Alert `#semantic-dom`](/components/alert-cn#semantic-dom) |
| `Anchor` | `root`、`item`、`itemTitle`、`indicator` | [Anchor `#semantic-dom`](/components/anchor-cn#semantic-dom) |
| `AutoComplete` | `root`、`prefix`、`suffix`、`popup.root` | [AutoComplete `#semantic-dom`](/components/auto-complete-cn#semantic-dom) |
| `Badge` | `root`、`indicator` | [Badge `#semantic-dom`](/components/badge-cn#semantic-dom) |
| `Breadcrumb` | `root`、`item`、`separator` | [Breadcrumb `#semantic-dom`](/components/breadcrumb-cn#semantic-dom) |
| `Button` | `root`、`icon`、`content` | [Button `#semantic-dom`](/components/button-cn#semantic-dom) |
| `Calendar` | `root`、`header`、`body`、`content`、`item`、`itemContent` | [Calendar `#semantic-dom`](/components/calendar-cn#semantic-dom) |
| `Card` | `root`、`header`、`title`、`extra`、`cover`、`body`、`actions` | [Card `#semantic-dom`](/components/card-cn#semantic-dom) |
| `Cascader` | `root`、`prefix`、`suffix`、`popup.root` | [Cascader `#semantic-dom`](/components/cascader-cn#semantic-dom) |
| `Checkbox` | `root`、`icon`、`label` | [Checkbox `#semantic-dom`](/components/checkbox-cn#semantic-dom) |
| `Collapse` | `root`、`header`、`icon`、`title`、`body` | [Collapse `#semantic-dom`](/components/collapse-cn#semantic-dom) |
| `ColorPicker` | `root`、`body`、`content`、`description`、`popup.root`、`popup.container` | [ColorPicker `#semantic-dom`](/components/color-picker-cn#semantic-dom) |
| `DatePicker` | `root`、`prefix`、`input`、`suffix`、`popup.*`（`root`/`container`/`header`/`body`/`content`/`item`/`footer`） | [DatePicker `#semantic-dom`](/components/date-picker-cn#semantic-dom) |
| `Descriptions` | `root`、`header`、`title`、`extra`、`label`、`content` | [Descriptions `#semantic-dom`](/components/descriptions-cn#semantic-dom) |
| `Divider` | `root`、`rail`、`content` | [Divider `#semantic-dom`](/components/divider-cn#semantic-dom) |
| `Drawer` | `root`、`mask`、`section`、`header`、`title`、`extra`、`body`、`footer`、`dragger`、`close` | [Drawer `#semantic-dom`](/components/drawer-cn#semantic-dom) |
| `Dropdown` | `root`、`menu`、`itemTitle`、`item`、`itemContent`、`itemIcon` | [Dropdown `#semantic-dom`](/components/dropdown-cn#semantic-dom) |
| `Empty` | `root`、`image`、`description`、`footer` | [Empty `#semantic-dom`](/components/empty-cn#semantic-dom) |
| `FloatButton` | `root`、`icon`、`content` | [FloatButton `#semantic-dom`](/components/float-button-cn#semantic-dom) |
| `Form` | `root`、`label`、`content`、`help`、`helpItem`、`extra` | [Form `#semantic-dom`](/components/form-cn#semantic-dom) |
| `Image` | `root`、`image`、`cover`、`placeholder.progress`、`popup.*` | [Image `#semantic-dom`](/components/image-cn#semantic-dom) |
| `Input` | `root`、`prefix`、`input`、`suffix`、`count`（覆盖 `Input`/`TextArea`/`Password`/`Search`/`OTP`） | [Input `#semantic-dom`](/components/input-cn#semantic-dom) |
| `InputNumber` | `root`、`prefix`、`input`、`suffix`、`actions`、`action`、`clear` | [InputNumber `#semantic-dom`](/components/input-number-cn#semantic-dom) |
| `Layout` | `root`、`body` | [Layout `#semantic-dom`](/components/layout-cn#semantic-dom) |
| `List` | `root`、`header`、`item`、`actions`、`extra`、`footer` | [List `#semantic-dom`](/components/list-cn#semantic-dom) |
| `Listy` | `root`、`holder`、`groupSection`、`groupHeader`、`item`、`scrollbar` | [Listy `#semantic-dom`](/components/listy-cn#semantic-dom) |
| `Masonry` | `root`、`item` | [Masonry `#semantic-dom`](/components/masonry-cn#semantic-dom) |
| `Mentions` | `root`、`textarea`、`suffix`、`popup` | [Mentions `#semantic-dom`](/components/mentions-cn#semantic-dom) |
| `Menu` | `root`、`item`、`itemIcon`、`itemContent`、`itemTitle`、`list`、`popup`、`subMenu.*` | [Menu `#semantic-dom`](/components/menu-cn#semantic-dom) |
| `Message` | `root`、`wrapper`、`icon`、`title`、`list`、`listContent` | [Message `#semantic-dom`](/components/message-cn#semantic-dom) |
| `Modal` | `root`、`mask`、`wrapper`、`container`、`header`、`title`、`body`、`footer`、`close` | [Modal `#semantic-dom`](/components/modal-cn#semantic-dom) |
| `Notification` | `root`、`wrapper`、`icon`、`section`、`title`、`description`、`close`、`actions`、`progress`、`list`、`listContent` | [Notification `#semantic-dom`](/components/notification-cn#semantic-dom) |
| `Pagination` | `root`、`item` | [Pagination `#semantic-dom`](/components/pagination-cn#semantic-dom) |
| `Popconfirm` | `root`、`container`（`body`）、`icon`、`title`、`content`、`arrow` | [Popconfirm `#semantic-dom`](/components/popconfirm-cn#semantic-dom) |
| `Popover` | `root`、`container`（`body`）、`title`、`content`、`arrow` | [Popover `#semantic-dom`](/components/popover-cn#semantic-dom) |
| `Progress` | `root`、`body`、`rail`、`track`、`indicator` | [Progress `#semantic-dom`](/components/progress-cn#semantic-dom) |
| `QRCode` | `root`、`cover` | [QRCode `#semantic-dom`](/components/qrcode-cn#semantic-dom) |
| `Radio` | `root`、`icon`、`label` | [Radio `#semantic-dom`](/components/radio-cn#semantic-dom) |
| `Result` | `root`、`icon`、`title`、`subTitle`、`extra`、`body` | [Result `#semantic-dom`](/components/result-cn#semantic-dom) |
| `Segmented` | `root`、`item`、`icon`、`label` | [Segmented `#semantic-dom`](/components/segmented-cn#semantic-dom) |
| `Select` | `root`、`prefix`、`suffix`、`popup.root` | [Select `#semantic-dom`](/components/select-cn#semantic-dom) |
| `Skeleton` | `root`、`header`、`section`、`avatar`、`title`、`paragraph` | [Skeleton `#semantic-dom`](/components/skeleton-cn#semantic-dom) |
| `Slider` | `root`、`rail`、`tracks`、`track`、`handle` | [Slider `#semantic-dom`](/components/slider-cn#semantic-dom) |
| `Space` | `root`、`item`、`separator` | [Space `#semantic-dom`](/components/space-cn#semantic-dom) |
| `Spin` | `root`、`section`、`indicator`、`description`（`tip`）、`container` | [Spin `#semantic-dom`](/components/spin-cn#semantic-dom) |
| `Splitter` | `root`、`panel`、`dragger` | [Splitter `#semantic-dom`](/components/splitter-cn#semantic-dom) |
| `Statistic` | `root`、`header`、`title`、`prefix`、`content`、`value`、`suffix` | [Statistic `#semantic-dom`](/components/statistic-cn#semantic-dom) |
| `Steps` | `root`、`item`、`itemWrapper`、`itemIcon`、`itemSection`、`itemTitle`、`itemSubtitle`、`itemContent`、`itemRail` | [Steps `#semantic-dom`](/components/steps-cn#semantic-dom) |
| `Switch` | `root`、`content`、`indicator` | [Switch `#semantic-dom`](/components/switch-cn#semantic-dom) |
| `Table` | `root`、`title`、`content`、`header.*`、`section`、`body.*`、`footer`、`pagination.*` | [Table `#semantic-dom`](/components/table-cn#semantic-dom) |
| `Tabs` | `root`、`header`、`item`、`remove`、`indicator`、`body`、`content`、`popup.root` | [Tabs `#semantic-dom`](/components/tabs-cn#semantic-dom) |
| `Tag` | `root`、`icon`、`content`、`close`（`CheckableTagGroup`：`root`、`item`） | [Tag `#semantic-dom`](/components/tag-cn#semantic-dom) |
| `TimePicker` | `root`、`prefix`、`input`、`suffix`、`popup.*` | [TimePicker `#semantic-dom`](/components/time-picker-cn#semantic-dom) |
| `Timeline` | `root`、`item`、`itemWrapper`、`itemIcon`、`itemSection`、`itemHeader`、`itemTitle`、`itemContent`、`itemRail` | [Timeline `#semantic-dom`](/components/timeline-cn#semantic-dom) |
| `Tooltip` | `root`、`container`（`body`）、`arrow` | [Tooltip `#semantic-dom`](/components/tooltip-cn#semantic-dom) |
| `Tour` | `root`、`mask`、`section`、`cover`、`close`、`header`、`title`、`description`、`footer`、`actions`、`indicators`、`indicator` | [Tour `#semantic-dom`](/components/tour-cn#semantic-dom) |
| `Transfer` | `root`、`section`、`header`、`title`、`body`、`list`、`item`、`itemIcon`、`itemContent`、`footer`、`actions` | [Transfer `#semantic-dom`](/components/transfer-cn#semantic-dom) |
| `Tree` | `root`、`item`、`itemIcon`、`itemTitle`、`itemSwitcher` | [Tree `#semantic-dom`](/components/tree-cn#semantic-dom) |
| `TreeSelect` | `root`、`prefix`、`suffix`、`popup.root` | [TreeSelect `#semantic-dom`](/components/tree-select-cn#semantic-dom) |
| `Typography` | `root`、`actions`、`action`、`textarea` | [Typography `#semantic-dom`](/components/typography-cn#semantic-dom) |
| `Upload` | `root`、`list`、`item`、`trigger` | [Upload `#semantic-dom`](/components/upload-cn#semantic-dom) |

## 形态变体 `variant`

`variant` 将过去分散的 `bordered` / `dashed` / `type` 等布尔或离散属性收敛为一致的视觉形态：

- **表单录入类**（`Input`、`InputNumber`、`Input.OTP`、`Select`、`Cascader`、`TreeSelect`、`Mentions`、`AutoComplete`、`DatePicker`、`TimePicker`、`RangePicker`、`Space.Addon`）：
  - `'outlined'`（默认描边）、`'filled'`（浅底填充）、`'borderless'`（无边框）、`'underlined'`（底部下划线）
- **卡片 `Card`**：`'outlined'`（默认）、`'borderless'`
- **按钮 `Button`**：`'outlined'`、`'dashed'`、`'solid'`、`'filled'`、`'text'`、`'link'`（搭配 `color` 使用）
- **分割线 `Divider`**：`'solid'`（默认）、`'dashed'`、`'dotted'`
- **警告提示 `Alert` / 步骤条 `Steps` / 时间轴 `Timeline`**：`'outlined'`（默认）、`'filled'`
- **标签 `Tag`**：`'outlined'`（默认）、`'filled'`、`'solid'`

```vue
<template>
  <a-space orientation="vertical" style="width: 320px">
    <a-input variant="outlined" placeholder="Outlined（默认）" />
    <a-input variant="filled" placeholder="Filled（填充）" />
    <a-input variant="borderless" placeholder="Borderless（无边框）" />
    <a-input variant="underlined" placeholder="Underlined（下划线）" />
  </a-space>
</template>
```

也可以在 `<a-config-provider variant="filled">` 或 `<a-form variant="filled">` 中统一设置整个页面或表单的默认形态，单个组件传入的 `variant` 优先级更高。

## 统一销毁控制 `destroyOnHidden`

`Modal`、`Drawer`、`Tabs`、`Dropdown`、`Tooltip`、`Collapse`、`Splitter.Panel` 均统一支持 `destroyOnHidden`，用于在弹层或面板隐藏后自动卸载内部 DOM 节点，替代旧版各异的命名（`destroyOnClose`、`destroyInactiveTabPane`、`destroyPopupOnHide`、`destroyTooltipOnHide`、`destroyInactivePanel`）：

```vue
<template>
  <a-modal v-model:open="open" title="表单弹窗" destroy-on-hidden>
    <OrderForm />
  </a-modal>
</template>
```

## `ConfigProvider` 全局组件默认配置（72 项组件配置）

在 `4.3.0` 中，`ConfigProvider` 支持 **72 项组件级默认配置**。配置中传入的 `className`、`style`、`classNames`、`styles`（含函数式语义位回调）会与组件实例自身传入的值**智能合并**（类名拼接、样式对象浅合并，组件自身属性优先级更高）：

```vue
<template>
  <a-config-provider
    variant="filled"
    :button="{ autoInsertSpace: false, className: 'brand-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :alert="{ variant: 'filled' }"
    :modal="{ centered: true, styles: { header: { paddingBottom: '12px' } } }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :divider="{ variant: 'dashed' }"
  >
    <App />
  </a-config-provider>
</template>
```

完整 72 项组件配置请参考 [ConfigProvider API 文档](/components/config-provider-cn)，更多 4.3.0 升级模式请查阅 [从 4.2.6 升级到 4.3.0](/docs/vue/migration-v43-cn)。
