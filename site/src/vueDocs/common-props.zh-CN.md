# 通用属性

`ant-design-vue@4.3.0` 在组件库层面统一了一组跨组件通用的属性与样式定制协议，涵盖根容器类名、语义化 DOM 定制、视觉形态变体、弹层销毁策略以及 `ConfigProvider` 全局组件默认配置。

> 以下通用属性适用于绝大多数组件；个别无 DOM 容器或特殊结构的组件请以对应组件 API 文档为准。

## 基础通用属性

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `class` | 自定义组件主容器类名（Vue 原生 attribute 透传） | `string \| Record<string, boolean> \| Array<any>` | - | - |
| `style` | 自定义组件主容器内联样式（Vue 原生 attribute 透传） | `CSSProperties` | - | - |
| `rootClassName` | 添加在组件最外层根节点（含弹层根容器）的类名，便于精准样式覆盖 | `string` | - | `4.2.7` |
| `classNames` | 语义化内部结构类名映射，用于精细定制组件各部位类名 | `Record<SemanticName, string>` 或函数 | - | `4.2.7` / `4.3.0` |
| `styles` | 语义化内部结构内联样式映射，替代零散的 `bodyStyle` / `headStyle` 等旧属性 | `Record<SemanticName, CSSProperties>` 或函数 | - | `4.2.7` / `4.3.0` |
| `variant` | 组件形态变体，替代旧版布尔值 `bordered` 或 `dashed` | 见下方 [形态变体 `variant`](#形态变体-variant) | `outlined` | `4.2.7` |
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

## 语义化 `classNames` 与 `styles`

`ant-design-vue` 通过成对的 `classNames` 和 `styles` 属性开放组件内部各语义部位的定制能力，替代过去分散的 `bodyStyle`、`headStyle`、`maskStyle`、`dropdownStyle`、`imageStyle` 等属性。

### 常见组件的语义位参考

| 组件 | 可用语义位（`classNames` / `styles` 键名） |
| --- | --- |
| `Modal` / `Drawer` | `mask`、`wrapper`、`content`、`header`、`body`、`footer` |
| `Card` | `header`、`body`、`extra`、`actions`、`title`、`cover` |
| `Descriptions` | `root`、`header`、`title`、`extra`、`label`、`content` |
| `Input` / `Input.TextArea` | `prefix`、`suffix`、`input`、`count` |
| `Select` / `TreeSelect` / `Cascader` / `AutoComplete` | `root`、`popup: { root }` |
| `Slider` | `root`、`tracks`、`track`、`rail`、`handle` |
| `Button` | `icon` |
| `Listy` | `root`、`item`、`groupHeader`、`groupSection`、`holder`、`scrollbar`（同时支持函数式 `({ props }) => ...`） |
| `Masonry` | `root`、`item` |
| `Empty` / `Badge` / `Space` / `Tooltip` / `List` | 详见各自组件 API 文档 |

### 使用示例

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

在 `Listy` 等支持函数式语义位的组件中，还可以根据当前 `props` 动态返回样式：

```vue
<template>
  <a-listy
    :items="items"
    row-key="id"
    :height="240"
    :styles="({ props }) => ({ item: { fontWeight: props.rowHoverable ? 500 : 400 } })"
  />
</template>
```

## 形态变体 `variant`

`variant` 将过去分散的 `bordered` / `dashed` / `type` 等布尔或离散属性收敛为一致的视觉形态：

- **表单录入类**（`Input`、`InputNumber`、`Input.OTP`、`Select`、`Cascader`、`TreeSelect`、`Mentions`、`AutoComplete`、`DatePicker`、`TimePicker`、`RangePicker`）：
  - `'outlined'`（默认描边）、`'filled'`（浅底填充）、`'borderless'`（无边框）、`'underlined'`（底部下划线）
- **卡片 `Card`**：`'outlined'`（默认）、`'borderless'`
- **按钮 `Button`**：`'outlined'`、`'dashed'`、`'solid'`、`'filled'`、`'text'`、`'link'`（搭配 `color` 使用）
- **分割线 `Divider`**：`'solid'`（默认）、`'dashed'`、`'dotted'`

```vue
<template>
  <a-space direction="vertical" style="width: 320px">
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

## `ConfigProvider` 全局组件默认配置

在 `4.3.0` 中，`ConfigProvider` 支持 **72 项组件级默认配置**。配置中传入的 `className`、`style`、`classNames`、`styles` 会与组件实例自身传入的值**智能合并**（类名拼接、样式对象浅合并，组件自身属性优先级更高）：

```vue
<template>
  <a-config-provider
    variant="filled"
    :button="{ autoInsertSpace: false, className: 'brand-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :modal="{ centered: true, styles: { header: { paddingBottom: '12px' } } }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :divider="{ variant: 'dashed' }"
  >
    <App />
  </a-config-provider>
</template>
```

完整 72 项组件配置及其支持字段请参考 [ConfigProvider API 文档](/components/config-provider-cn)。
