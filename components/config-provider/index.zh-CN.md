---
category: Components
subtitle: 全局化配置
cols: 1
type: 其他
title: ConfigProvider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

为组件提供统一的全局化配置。

## 使用

ConfigProvider 使用 Vue 3 的 [provide / inject](https://cn.vuejs.org/guide/components/provide-inject.html) 特性，只需在应用外围包裹一次即可全局生效。

```html
<template>
  <a-config-provider :get-popup-container="getPopupContainer">
    <app />
  </a-config-provider>
</template>

<script lang="ts" setup>
  const getPopupContainer = (el?: HTMLElement, dialogContext?: any) => {
    if (dialogContext) {
      return dialogContext.getDialogWrap();
    }
    return document.body;
  };
</script>
```

### Content Security Policy

部分组件为了支持波纹效果，使用了动态样式。如果开启了 Content Security Policy (CSP)，你可以通过 `csp` 属性来进行配置：

```html
<a-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <a-button>My Button</a-button>
</a-config-provider>
```

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ~~autoInsertSpaceInButton~~ | 已废弃，请使用 `button: { autoInsertSpace: false }` 替代 | boolean | `true` |  |
| componentDisabled | 设置 antd 组件禁用状态 | boolean | - | 4.0 |
| componentSize | 设置 antd 组件大小 | `small` \| `middle` \| `large` | - | 3.0 |
| csp | 设置 [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 配置 | { nonce?: string } | - |  |
| direction | 设置文本展示方向。[示例](#components-config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | 3.0 |
| ~~dropdownMatchSelectWidth~~ | 已废弃，请使用 `popupMatchSelectWidth` 替代 | boolean \| number | - |  |
| getPopupContainer | 弹出框（Select、Tooltip、Menu 等等）渲染父节点，默认渲染到 body 上 | (triggerNode?: HTMLElement, dialogContext?: any) => HTMLElement | () => document.body |  |
| getTargetContainer | 配置 Affix、Anchor 滚动监听容器 | () => HTMLElement \| Window | () => window | 3.0 |
| holderRender | 配置静态方法（如 `message`）渲染时的外层包裹容器 | (children: VueNode) => VueNode | - | 4.3.0 |
| iconPrefixCls | 设置图标统一样式前缀 | string | `anticon` | 4.0 |
| locale | 语言包配置，语言包可到 [ant-design-vue/es/locale](https://unpkg.com/ant-design-vue/es/locale/) 目录下寻找 | Locale | - | 1.5.0 |
| pageHeader | 统一设置 PageHeader 的 `ghost`，参考 [PageHeader](/components/page-header-cn/) | { ghost?: boolean } | `{ ghost: true }` | 1.5.0 |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动 | boolean \| number | - | 4.3.0 |
| popupOverflow | 弹层类组件展示逻辑，默认随可视区域定位，可配置为随滚动容器定位 | `viewport` \| `scroll` | `viewport` | 4.3.0 |
| prefixCls | 设置统一样式前缀（CSS-in-JS 自动生效，无需 Less 配置） | string | `ant` |  |
| renderEmpty | 自定义组件空状态，参考 [空状态](/components/empty-cn/) | slot \| ((componentName?: string) => VueNode) | - |  |
| theme | 设置主题，参考 [定制主题](/docs/vue/customize-theme-cn) 与下方 [ThemeConfig](#themeconfig) | [ThemeConfig](#themeconfig) | - | 4.0 |
| transformCellText | Table 数据渲染前可以再次改变，一般用于空数据的默认配置 | ({ text, column, record, index }) => any | - | 1.5.4 |
| variant | 设置输入类组件（Input / Select / DatePicker 等）的默认形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |
| virtual | 设置 `false` 时关闭虚拟滚动 | boolean | - | 3.0 |
| warning | 设置警告配置，`strict` 为 `false` 时会将废弃相关信息聚合处理 | { strict?: boolean } | - | 4.3.0 |
| wave | 设置水波纹特效 | { disabled?: boolean } | - | 4.0.7 |

### ThemeConfig

`theme` 属性用于配置设计变量、主题算法、CSS 变量模式与零运行时模式：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| algorithm | 用于修改预设算法，可组合使用，如 `[theme.darkAlgorithm, theme.compactAlgorithm]` | MappingAlgorithm \| MappingAlgorithm[] | `theme.defaultAlgorithm` | 4.0 |
| components | 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token | OverrideToken | - | 4.0 |
| cssVar | 开启 CSS 变量模式（4.3.0 起默认开启，样式仅生成一次，主题切换零重算；传 `false` 可回退到旧版 hash 模式） | boolean \| { prefix?: string; key?: string } | `true` | 4.3.0 |
| hashed | 是否开启样式 hash 值 | boolean | `true` | 4.0 |
| inherit | 是否继承上层 `ConfigProvider` 中的主题配置 | boolean | `true` | 4.0 |
| token | 用于修改 Design Token | Partial\<AliasToken\> | - | 4.0 |
| zeroRuntime | 关闭运行时样式生成（需配合预先提取的静态 CSS 使用） | boolean | `false` | 4.3.0 |

### ConfigProvider.config() `3.0.0+`

设置 `Modal`、`Message`、`Notification` 静态方法的全局配置（支持响应式 `ref`）：

```ts
import { ref } from 'vue';
import { ConfigProvider } from 'ant-design-vue';

ConfigProvider.config({
  prefixCls: 'ant',
  iconPrefixCls: 'anticon',
  holderRender: children => children,
});

// 也支持响应式数据，直接修改 prefixCls.value 即可生效
const prefixCls = ref('ant');
ConfigProvider.config({
  prefixCls,
});
```

### 组件配置

以下配置项用于统一设置对应组件的默认属性、`className`、`style` 或语义化 `classNames` / `styles`（自 `4.3.0` 起已全量接入 72+ 组件配置）：

| 配置项 | 对应组件 | 常用配置字段 | 版本 |
| --- | --- | --- | --- |
| affix | [Affix](/components/affix-cn/#api) | `className`, `style` | 4.3.0 |
| alert | [Alert](/components/alert-cn/#api) | `className`, `style`, `closable`, `closeIcon`, `successIcon`, `infoIcon`, `warningIcon`, `errorIcon` | 4.3.0 |
| anchor | [Anchor](/components/anchor-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| app | [App](/components/app-cn/#api) | `className`, `style` | 4.3.0 |
| autoComplete | [AutoComplete](/components/auto-complete-cn/#api) | `className`, `style`, `classNames`, `styles`, `allowClear`, `variant` | 4.3.0 |
| avatar | [Avatar](/components/avatar-cn/#api) | `className`, `style` | 4.3.0 |
| badge | [Badge](/components/badge-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| borderBeam | [BorderBeam](/components/border-beam-cn/#api) | `className`, `style` | 4.3.0 |
| breadcrumb | [Breadcrumb](/components/breadcrumb-cn/#api) | `className`, `style`, `classNames`, `styles`, `separator`, `dropdownIcon` | 4.3.0 |
| button | [Button](/components/button-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `color`, `autoInsertSpace`, `shape`, `loadingIcon` | 4.3.0 |
| calendar | [Calendar](/components/calendar-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| card | [Card](/components/card-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| cardMeta | [Card.Meta](/components/card-cn/#cardmeta) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| carousel | [Carousel](/components/carousel-cn/#api) | `className`, `style` | 4.3.0 |
| cascader | [Cascader](/components/cascader-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `expandIcon`, `suffixIcon` | 4.3.0 |
| checkbox | [Checkbox](/components/checkbox-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| collapse | [Collapse](/components/collapse-cn/#api) | `className`, `style`, `classNames`, `styles`, `expandIcon` | 4.3.0 |
| colorPicker | [ColorPicker](/components/color-picker-cn/#api) | `className`, `style`, `classNames`, `styles`, `arrow` | 4.3.0 |
| datePicker | [DatePicker](/components/date-picker-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| descriptions | [Descriptions](/components/descriptions-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| divider | [Divider](/components/divider-cn/#api) | `className`, `style`, `variant` | 4.3.0 |
| drawer | [Drawer](/components/drawer-cn/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon`, `closable` | 4.3.0 |
| dropdown | [Dropdown](/components/dropdown-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| empty | [Empty](/components/empty-cn/#api) | `className`, `style`, `classNames`, `styles`, `image` | 4.3.0 |
| flex | [Flex](/components/flex-cn/#api) | `className`, `style`, `vertical` | 4.3.0 |
| floatButton | [FloatButton](/components/float-button-cn/#api) | `className`, `style`, `classNames`, `styles`, `backTopIcon` | 4.3.0 |
| floatButtonGroup | [FloatButton.Group](/components/float-button-cn/#floatbuttongroup) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| form | [Form](/components/form-cn/#api) | `className`, `style`, `validateMessages`, `requiredMark`, `colon`, `scrollToFirstError`, `variant`, `labelAlign`, `labelWrap` | 3.0 |
| image | [Image](/components/image-cn/#api) | `className`, `style`, `fallback`, `preview` | 4.3.0 |
| input | [Input](/components/input-cn/#input) | `className`, `style`, `classNames`, `styles`, `autocomplete`, `allowClear`, `variant` | 3.0 |
| inputNumber | [InputNumber](/components/input-number-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear` | 4.3.0 |
| inputPassword | [Input.Password](/components/input-cn/#inputpassword) | `className`, `style`, `classNames`, `styles`, `iconRender`, `variant` | 4.3.0 |
| inputSearch | [Input.Search](/components/input-cn/#inputsearch) | `className`, `style`, `classNames`, `styles`, `searchIcon`, `variant` | 4.3.0 |
| layout | [Layout](/components/layout-cn/#api) | `className`, `style` | 4.3.0 |
| list | [List](/components/list-cn/#api) | `className`, `style`, `item: { classNames, styles }` | 4.3.0 |
| listy | [Listy](/components/listy-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| masonry | [Masonry](/components/masonry-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| mentions | [Mentions](/components/mentions-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear` | 4.3.0 |
| menu | [Menu](/components/menu-cn/#api) | `className`, `style`, `classNames`, `styles`, `expandIcon` | 4.3.0 |
| message | [Message](/components/message-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| modal | [Modal](/components/modal-cn/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon`, `closable`, `centered`, `okButtonProps`, `cancelButtonProps` | 4.3.0 |
| notification | [Notification](/components/notification-cn/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| otp | [Input.OTP](/components/input-cn/#inputotp) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| pagination | [Pagination](/components/pagination-cn/#api) | `className`, `style`, `classNames`, `styles`, `showSizeChanger`, `totalBoundaryShowSizeChanger` | 4.3.0 |
| popconfirm | [Popconfirm](/components/popconfirm-cn/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| popover | [Popover](/components/popover-cn/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| progress | [Progress](/components/progress-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| qrcode | [QRCode](/components/qrcode-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| radio | [Radio](/components/radio-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| rangePicker | [RangePicker](/components/date-picker-cn/#rangepicker) | `className`, `style`, `classNames`, `styles`, `variant`, `separator` | 4.3.0 |
| rate | [Rate](/components/rate-cn/#api) | `className`, `style` | 4.3.0 |
| result | [Result](/components/result-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| ribbon | [Badge.Ribbon](/components/badge-cn/#badgeribbon) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| segmented | [Segmented](/components/segmented-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| select | [Select](/components/select-cn/#api) | `className`, `style`, `classNames`, `styles`, `showSearch`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| skeleton | [Skeleton](/components/skeleton-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| slider | [Slider](/components/slider-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| space | [Space](/components/space-cn/#api) | `className`, `style`, `classNames`, `styles`, `size` | 3.0 |
| spin | [Spin](/components/spin-cn/#api) | `className`, `style`, `classNames`, `styles`, `indicator` | 4.3.0 |
| splitter | [Splitter](/components/splitter-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| statistic | [Statistic](/components/statistic-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| steps | [Steps](/components/steps-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| switch | [Switch](/components/switch-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| table | [Table](/components/table-cn/#api) | `className`, `style`, `classNames`, `styles`, `expandable`, `rowKey`, `scroll` | 4.3.0 |
| tabs | [Tabs](/components/tabs-cn/#api) | `className`, `style`, `classNames`, `styles`, `indicator`, `indicatorSize`, `moreIcon`, `addIcon`, `removeIcon` | 4.3.0 |
| tag | [Tag](/components/tag-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `closeIcon`, `closable` | 4.3.0 |
| textArea | [Input.TextArea](/components/input-cn/#textarea) | `className`, `style`, `classNames`, `styles`, `autocomplete`, `allowClear`, `variant` | 4.3.0 |
| timePicker | [TimePicker](/components/time-picker-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| timeline | [Timeline](/components/timeline-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| tooltip | [Tooltip](/components/tooltip-cn/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| tour | [Tour](/components/tour-cn/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| transfer | [Transfer](/components/transfer-cn/#api) | `className`, `style`, `classNames`, `styles`, `selectionsIcon` | 4.3.0 |
| tree | [Tree](/components/tree-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| treeSelect | [TreeSelect](/components/tree-select-cn/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `switcherIcon` | 4.3.0 |
| typography | [Typography](/components/typography-cn/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| upload | [Upload](/components/upload-cn/#api) | `className`, `style`, `classNames`, `styles`, `customRequest`, `progress`, `accept` | 4.3.0 |
| watermark | [Watermark](/components/watermark-cn/#api) | `className`, `style` | 4.3.0 |

## FAQ

#### 为什么我使用了 ConfigProvider `locale`，时间类组件的国际化还有问题？

请检查是否设置了 `dayjs.locale('zh-cn')`，或者是否有两个版本的 dayjs 共存。

#### 配置 `getPopupContainer` 导致 Modal 报错？

当如下全局设置 `getPopupContainer` 为触发节点的 `parentNode` 时，由于 Modal 的用法不存在 `triggerNode`，这样会导致 `triggerNode is undefined` 的报错，需要增加一个判断条件：

```ts
const getPopupContainer = (node?: HTMLElement) => {
  if (node && node.parentElement) {
    return node.parentElement;
  }
  return document.body;
};
```

#### 为什么 `message.info`、`notification.open` 或 `Modal.confirm` 等静态方法内的 VueNode 无法继承 ConfigProvider 的属性（如 `prefixCls` 和 `theme`）？

静态方法会脱离主应用组件树独立挂载。建议使用 [App](/components/app-cn/) 组件的 `App.useApp()`，或通过 `ConfigProvider.config({ holderRender })` 包装静态方法渲染容器。
