---
category: Components
type: Other
cols: 1
title: ConfigProvider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

`ConfigProvider` provides uniform global configuration support for components.

## Usage

This component provides configuration to all Vue components underneath itself via Vue 3 [provide / inject](https://vuejs.org/guide/components/provide-inject.html). Wrap your root application once to apply settings globally.

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

Some components use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```html
<a-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <a-button>My Button</a-button>
</a-config-provider>
```

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ~~autoInsertSpaceInButton~~ | Deprecated, please use `button: { autoInsertSpace: false }` instead | boolean | `true` |  |
| componentDisabled | Config antd component disabled state | boolean | - | 4.0 |
| componentSize | Config antd component size | `small` \| `middle` \| `large` | - | 3.0 |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | { nonce?: string } | - |  |
| direction | Set direction of layout. See [demo](#components-config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | 3.0 |
| ~~dropdownMatchSelectWidth~~ | Deprecated, please use `popupMatchSelectWidth` instead | boolean \| number | - | 3.0 |
| getPopupContainer | Set the container of popup elements (Select, Tooltip, Menu, etc.). Defaults to `document.body` | (triggerNode?: HTMLElement, dialogContext?: any) => HTMLElement | () => document.body |  |
| getTargetContainer | Config Affix, Anchor scroll target container | () => HTMLElement \| Window | () => window | 3.0 |
| holderRender | Wrapper renderer for static method holders (such as `message`) | (children: VueNode) => VueNode | - | 4.3.0 |
| iconPrefixCls | Set icon prefix class | string | `anticon` | 4.0 |
| locale | Language package setting, available in [@hiltonkohler21/ant-design-vue/es/locale](https://unpkg.com/@hiltonkohler21/ant-design-vue/es/locale/) | Locale | - | 1.5.0 |
| pageHeader | Unify `ghost` of PageHeader, see [PageHeader](/components/page-header/) | { ghost?: boolean } | `{ ghost: true }` | 1.5.0 |
| popupMatchSelectWidth | Determine whether the popup menu and select input share the same width (`min-width`). `false` disables virtual scroll | boolean \| number | - | 4.3.0 |
| popupOverflow | Popup overflow behavior: position within viewport by default or within scroll container | `viewport` \| `scroll` | `viewport` | 4.3.0 |
| prefixCls | Set unified prefix class (handled automatically via CSS-in-JS) | string | `ant` |  |
| renderEmpty | Set empty content of components. See [Empty](/components/empty/) | slot \| ((componentName?: string) => VueNode) | - |  |
| theme | Set theme config, see [Customize Theme](/docs/vue/customize-theme) and [ThemeConfig](#themeconfig) below | [ThemeConfig](#themeconfig) | - | 4.0 |
| transformCellText | Transform Table cell data before rendering (commonly used for empty-cell defaults) | ({ text, column, record, index }) => any | - | 1.5.4 |
| variant | Set the default variant of input-like components (Input / Select / DatePicker, etc.) | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |
| virtual | Disable virtual scroll when set to `false` | boolean | - | 3.0 |
| warning | Configure warning behavior; when `strict` is `false`, deprecation warnings are aggregated | { strict?: boolean } | - | 4.3.0 |
| wave | Config wave effect | [WaveConfig](#waveconfig) | - | 4.0.7 |

### ThemeConfig

The `theme` prop configures design tokens, theme algorithms, CSS variables mode, and zero-runtime extraction:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| algorithm | Modify preset theme algorithms; composable as an array, e.g. `[theme.darkAlgorithm, theme.compactAlgorithm]` | MappingAlgorithm \| MappingAlgorithm[] | `theme.defaultAlgorithm` | 4.0 |
| components | Override per-component Component Tokens and Alias Tokens | OverrideToken | - | 4.0 |
| cssVar | Enable CSS variables mode (enabled by default in 4.3.0; styles serialize once and theme switching updates only CSS variables; pass `false` to opt out) | boolean \| { prefix?: string; key?: string } | `true` | 4.3.0 |
| hashed | Whether to enable CSS-in-JS hash class | boolean | `true` | 4.0 |
| inherit | Whether to inherit theme config from parent `ConfigProvider` | boolean | `true` | 4.0 |
| token | Modify global Design Tokens | Partial\<AliasToken\> | - | 4.0 |
| zeroRuntime | Disable runtime CSS generation (use together with pre-extracted static CSS) | boolean | `false` | 4.3.0 |

### ConfigProvider.config() `3.0.0+`

Configure global defaults for `Modal`, `Message`, and `Notification` static methods (supports reactive `ref`):

```ts
import { h, ref } from 'vue';
import { App, ConfigProvider, StyleProvider } from '@hiltonkohler21/ant-design-vue';

ConfigProvider.config({
  prefixCls: 'ant',
  iconPrefixCls: 'anticon',
  // 4.3.0+
  holderRender: children =>
    h(StyleProvider, { hashPriority: 'high' }, () =>
      h(
        ConfigProvider,
        {
          prefixCls: 'ant',
          iconPrefixCls: 'anticon',
          theme: { token: { colorPrimary: '#1677ff' } },
        },
        () => h(App, null, () => children),
      ),
    ),
});

// Reactive refs are supported — updating prefixCls.value takes effect immediately
const prefixCls = ref('ant');
ConfigProvider.config({
  prefixCls,
});
```

### ConfigProvider.useConfig() `4.3.0+`

Get values from parent `Provider`s, such as `DisabledContext` and `SizeContext` (returns reactive `Ref`s in Vue 3).

```ts
import { ConfigProvider } from '@hiltonkohler21/ant-design-vue';

const {
  componentDisabled, // 4.3.0+
  componentSize, // 4.3.0+
} = ConfigProvider.useConfig();
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | `Ref<boolean \| undefined>` | - | 4.3.0 |
| componentSize | antd component size state | `Ref<'small' \| 'middle' \| 'large' \| undefined>` | - | 4.3.0 |

### WaveConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Whether to disable wave effect | boolean | `false` | 4.0.7 |
| showEffect | Customized wave effect | (node: HTMLElement, info: { className, token, component, event, hashId }) => void | - | 4.3.0 |

### Component Config

The following properties set default options, `className`, `style`, or semantic `classNames` / `styles` per component (all 72+ component configs are wired in `4.3.0`):

| Config Prop | Component | Common Config Fields | Version |
| --- | --- | --- | --- |
| affix | [Affix](/components/affix/#api) | `className`, `style` | 4.3.0 |
| alert | [Alert](/components/alert/#api) | `className`, `style`, `closable`, `closeIcon`, `successIcon`, `infoIcon`, `warningIcon`, `errorIcon` | 4.3.0 |
| anchor | [Anchor](/components/anchor/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| app | [App](/components/app/#api) | `className`, `style` | 4.3.0 |
| autoComplete | [AutoComplete](/components/auto-complete/#api) | `className`, `style`, `classNames`, `styles`, `allowClear`, `variant` | 4.3.0 |
| avatar | [Avatar](/components/avatar/#api) | `className`, `style` | 4.3.0 |
| badge | [Badge](/components/badge/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| borderBeam | [BorderBeam](/components/border-beam/#api) | `className`, `style` | 4.3.0 |
| breadcrumb | [Breadcrumb](/components/breadcrumb/#api) | `className`, `style`, `classNames`, `styles`, `separator`, `dropdownIcon` | 4.3.0 |
| button | [Button](/components/button/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `color`, `autoInsertSpace`, `shape`, `loadingIcon` | 4.3.0 |
| calendar | [Calendar](/components/calendar/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| card | [Card](/components/card/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| cardMeta | [Card.Meta](/components/card/#cardmeta) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| carousel | [Carousel](/components/carousel/#api) | `className`, `style` | 4.3.0 |
| cascader | [Cascader](/components/cascader/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `expandIcon`, `suffixIcon` | 4.3.0 |
| checkbox | [Checkbox](/components/checkbox/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| collapse | [Collapse](/components/collapse/#api) | `className`, `style`, `classNames`, `styles`, `expandIcon` | 4.3.0 |
| colorPicker | [ColorPicker](/components/color-picker/#api) | `className`, `style`, `classNames`, `styles`, `arrow` | 4.3.0 |
| datePicker | [DatePicker](/components/date-picker/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| descriptions | [Descriptions](/components/descriptions/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| divider | [Divider](/components/divider/#api) | `className`, `style`, `variant` | 4.3.0 |
| drawer | [Drawer](/components/drawer/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon`, `closable` | 4.3.0 |
| dropdown | [Dropdown](/components/dropdown/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| empty | [Empty](/components/empty/#api) | `className`, `style`, `classNames`, `styles`, `image` | 4.3.0 |
| flex | [Flex](/components/flex/#api) | `className`, `style`, `vertical` | 4.3.0 |
| floatButton | [FloatButton](/components/float-button/#api) | `className`, `style`, `classNames`, `styles`, `backTopIcon` | 4.3.0 |
| floatButtonGroup | [FloatButton.Group](/components/float-button/#floatbuttongroup) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| form | [Form](/components/form/#api) | `className`, `style`, `validateMessages`, `requiredMark`, `colon`, `scrollToFirstError`, `variant`, `labelAlign`, `labelWrap` | 3.0 |
| image | [Image](/components/image/#api) | `className`, `style`, `fallback`, `preview` | 4.3.0 |
| input | [Input](/components/input/#input) | `className`, `style`, `classNames`, `styles`, `autocomplete`, `allowClear`, `variant` | 3.0 |
| inputNumber | [InputNumber](/components/input-number/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear` | 4.3.0 |
| inputPassword | [Input.Password](/components/input/#inputpassword) | `className`, `style`, `classNames`, `styles`, `iconRender`, `variant` | 4.3.0 |
| inputSearch | [Input.Search](/components/input/#inputsearch) | `className`, `style`, `classNames`, `styles`, `searchIcon`, `variant` | 4.3.0 |
| layout | [Layout](/components/layout/#api) | `className`, `style` | 4.3.0 |
| list | [List](/components/list/#api) | `className`, `style`, `item: { classNames, styles }` | 4.3.0 |
| listy | [Listy](/components/listy/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| masonry | [Masonry](/components/masonry/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| mentions | [Mentions](/components/mentions/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear` | 4.3.0 |
| menu | [Menu](/components/menu/#api) | `className`, `style`, `classNames`, `styles`, `expandIcon` | 4.3.0 |
| message | [Message](/components/message/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| modal | [Modal](/components/modal/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon`, `closable`, `centered`, `okButtonProps`, `cancelButtonProps` | 4.3.0 |
| notification | [Notification](/components/notification/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| otp | [Input.OTP](/components/input/#inputotp) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| pagination | [Pagination](/components/pagination/#api) | `className`, `style`, `classNames`, `styles`, `showSizeChanger`, `totalBoundaryShowSizeChanger` | 4.3.0 |
| popconfirm | [Popconfirm](/components/popconfirm/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| popover | [Popover](/components/popover/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| progress | [Progress](/components/progress/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| qrcode | [QRCode](/components/qrcode/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| radio | [Radio](/components/radio/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| rangePicker | [RangePicker](/components/date-picker/#rangepicker) | `className`, `style`, `classNames`, `styles`, `variant`, `separator` | 4.3.0 |
| rate | [Rate](/components/rate/#api) | `className`, `style` | 4.3.0 |
| result | [Result](/components/result/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| ribbon | [Badge.Ribbon](/components/badge/#badgeribbon) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| segmented | [Segmented](/components/segmented/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| select | [Select](/components/select/#api) | `className`, `style`, `classNames`, `styles`, `showSearch`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| skeleton | [Skeleton](/components/skeleton/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| slider | [Slider](/components/slider/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| space | [Space](/components/space/#api) | `className`, `style`, `classNames`, `styles`, `size` | 3.0 |
| spin | [Spin](/components/spin/#api) | `className`, `style`, `classNames`, `styles`, `indicator` | 4.3.0 |
| splitter | [Splitter](/components/splitter/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| statistic | [Statistic](/components/statistic/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| steps | [Steps](/components/steps/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| switch | [Switch](/components/switch/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| table | [Table](/components/table/#api) | `className`, `style`, `classNames`, `styles`, `expandable`, `rowKey`, `scroll` | 4.3.0 |
| tabs | [Tabs](/components/tabs/#api) | `className`, `style`, `classNames`, `styles`, `indicator`, `indicatorSize`, `moreIcon`, `addIcon`, `removeIcon` | 4.3.0 |
| tag | [Tag](/components/tag/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `closeIcon`, `closable` | 4.3.0 |
| textArea | [Input.TextArea](/components/input/#textarea) | `className`, `style`, `classNames`, `styles`, `autocomplete`, `allowClear`, `variant` | 4.3.0 |
| timePicker | [TimePicker](/components/time-picker/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `clearIcon`, `suffixIcon` | 4.3.0 |
| timeline | [Timeline](/components/timeline/#api) | `className`, `style`, `classNames`, `styles`, `variant` | 4.3.0 |
| tooltip | [Tooltip](/components/tooltip/#api) | `className`, `style`, `classNames`, `styles`, `arrow`, `trigger`, `mouseEnterDelay`, `mouseLeaveDelay` | 4.3.0 |
| tour | [Tour](/components/tour/#api) | `className`, `style`, `classNames`, `styles`, `closeIcon` | 4.3.0 |
| transfer | [Transfer](/components/transfer/#api) | `className`, `style`, `classNames`, `styles`, `selectionsIcon` | 4.3.0 |
| tree | [Tree](/components/tree/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| treeSelect | [TreeSelect](/components/tree-select/#api) | `className`, `style`, `classNames`, `styles`, `variant`, `allowClear`, `switcherIcon` | 4.3.0 |
| typography | [Typography](/components/typography/#api) | `className`, `style`, `classNames`, `styles` | 4.3.0 |
| upload | [Upload](/components/upload/#api) | `className`, `style`, `classNames`, `styles`, `customRequest`, `progress`, `accept` | 4.3.0 |
| watermark | [Watermark](/components/watermark/#api) | `className`, `style` | 4.3.0 |

## FAQ

#### Does the locale problem still exist in DatePicker even if ConfigProvider `locale` is used?

Please make sure you set dayjs locale via `dayjs.locale('zh-cn')` and that there are not two different versions of dayjs installed.

#### Modal throws an error when setting `getPopupContainer`?

When you configure `getPopupContainer` to return `triggerNode.parentNode` globally, Modal will throw because it does not pass a `triggerNode`. Always guard against `undefined`:

```ts
const getPopupContainer = (node?: HTMLElement) => {
  if (node && node.parentElement) {
    return node.parentElement;
  }
  return document.body;
};
```

#### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect VueNode inside `message.info`, `notification.open`, or `Modal.confirm`?

Static methods render outside the main Vue component tree. Prefer using [App](/components/app/) with `App.useApp()`, or wrap static method holders via `ConfigProvider.config({ holderRender })`.

#### `prefixCls` priority (the former is overridden by the latter)

1. `ConfigProvider.config({ prefixCls: 'prefix-1' })`
2. `ConfigProvider.config({ holderRender: children => h(ConfigProvider, { prefixCls: 'prefix-2' }, () => children) })`
3. `message.config({ prefixCls: 'prefix-3' })`
