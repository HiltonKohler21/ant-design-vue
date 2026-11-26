---
category: Components
type: 反馈
title: Notification
subtitle: 通知提醒框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cRmqTY4nKPEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*W3RmSov-xVMAAAAAAAAAAAAADrJ8AQ/original
---

全局展示通知提醒信息。

## 何时使用

在系统四个角显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

## API

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.warn(config)`
- `notification.open(config)`
- `notification.close(key: String)`
- `notification.destroy()`
- `notification.useNotification(config)`

config 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 自定义操作按钮组 | VNode \| () => VNode | - | 4.3.0 |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | string \| number | `24px` | - |
| ~~btn~~ | 自定义操作按钮组，请使用 `actions` 替换 | VNode \| () => VNode | - | - |
| class | 自定义 CSS class | string | - | - |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| ((info: { props }) => Record<SemanticDOM, string>)` | - | 4.3.0 |
| closable | 是否显示右上角的关闭按钮，或自定义关闭按钮配置 | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| description | 通知提醒内容 | string \| VNode \| () => VNode | - | - |
| duration | 默认 4.5 秒后自动关闭，配置为 `0`、`null` 或 `false` 则不会自动关闭 | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | 配置渲染节点的输出位置 | () => HTMLNode | () => document.body | - |
| icon | 自定义图标 | VNode \| () => VNode | - | - |
| key | 当前通知唯一标志 | string | - | - |
| ~~message~~ | 通知提醒标题，请使用 `title` 替换 | string \| VNode \| () => VNode | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | `true` | 4.3.0 |
| placement | 弹出位置，可选 `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | string | `topRight` | `top` `bottom` 3.3.0 |
| props | 透传至通知 `div` 上的 props 对象，支持传入 `data-*`、`aria-*` 或 `role` | Object | - | 4.3.0 |
| role | 供屏幕阅读器识别的通知内容语义，默认为 `alert`。此情况下屏幕阅读器会立即打断当前正在阅读的其他内容，转而阅读通知内容 | `'alert' \| 'status'` | `'alert'` | 4.3.0 |
| showProgress | 显示自动关闭通知框的进度条 | boolean | `false` | 4.3.0 |
| style | 自定义内联样式 | CSSProperties | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| ((info: { props }) => Record<SemanticDOM, CSSProperties>)` | - | 4.3.0 |
| title | 通知提醒标题 | string \| VNode \| () => VNode | - | 4.3.0 |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | string \| number | `24px` | - |
| onClick | 点击通知时触发的回调函数 | Function | - | - |
| onClose | 当通知关闭时触发 | Function | - | - |

- `notification.useNotification(config)`

config 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | number \| string | `24` | - |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| ((info: { props }) => Record<SemanticDOM, string>)` | - | 4.3.0 |
| closable | 是否显示右上角的关闭按钮，或自定义关闭按钮配置 | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| duration | 默认自动关闭延时，单位秒，配置为 `0`、`null` 或 `false` 则不自动关闭 | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | 配置渲染节点的输出位置 | () => HTMLNode | () => document.body | - |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - | 3.0 |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | `true` | 4.3.0 |
| placement | 弹出位置，可选 `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | string | `topRight` | - |
| rtl | 是否开启 RTL 模式 | boolean | `false` | 3.0 |
| showProgress | 显示自动关闭通知框的进度条 | boolean | `false` | 4.3.0 |
| stack | 堆叠模式，超过阈值时会将所有消息收起，鼠标移入展开 | boolean \| `{ threshold?: number }` | `{ threshold: 3 }` | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| ((info: { props }) => Record<SemanticDOM, CSSProperties>)` | - | 4.3.0 |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | number \| string | `24` | - |

### ClosableType

| 参数       | 说明                 | 类型                 | 默认值  | 版本  |
| ---------- | -------------------- | -------------------- | ------- | ----- |
| aria-label | 关闭按钮的无障碍标签 | string               | -       | 4.3.0 |
| closeIcon  | 自定义关闭图标       | VNode \| () => VNode | -       | 4.3.0 |
| disabled   | 是否禁用关闭按钮     | boolean              | `false` | 4.3.0 |
| onClose    | 当通知关闭时触发     | () => void           | -       | 4.3.0 |

### 全局配置

还提供了一个全局配置方法，在调用前提前配置，全局一次生效。

- `notification.config(options)`

  > 当你使用 `ConfigProvider` 进行全局化配置时，系统会默认自动开启 RTL 模式。(3.0+)
  >
  > 当你想单独使用，可通过如下设置开启 RTL 模式。

```js
notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 3,
  rtl: true,
});
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | string \| number | `24px` | - |
| closable | 是否显示关闭按钮，或自定义关闭按钮配置 | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| duration | 默认自动关闭延时，单位秒 | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | 配置渲染节点的输出位置，但依旧为全屏展示 | () => HTMLNode | () => document.body | - |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - | 3.0 |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | `true` | 4.3.0 |
| placement | 弹出位置，可选 `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | string | `topRight` | - |
| rtl | 是否开启 RTL 模式 | boolean | `false` | 3.0 |
| showProgress | 显示自动关闭通知框的进度条 | boolean | `false` | 4.3.0 |
| stack | 堆叠模式，通知数量达到阈值时折叠堆叠，鼠标移入展开 | boolean \| `{ threshold?: number }` | `{ threshold: 3 }` | 4.3.0 |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | string \| number | `24px` | - |

## Semantic DOM

`classNames` 与 `styles` 支持静态对象或 `(info: { props }) => ...` 函数形式，并会自动与 `ConfigProvider` 的 `notification.classNames` / `notification.styles` 合并，支持以下语义化键名（4.3.0+）：

- `root`：通知项根元素，设置背景色、圆角、阴影、内边距和动画样式
- `wrapper`：图标与内容的包裹元素，设置内容布局样式
- `icon`：图标元素，设置定位、字体大小、行高和状态颜色样式
- `section`：内容区域元素，包含标题和描述内容
- `title`：标题元素，设置颜色、字体大小、行高和外边距样式
- `description`：描述元素，设置字体大小、颜色和外边距样式
- `actions`：操作组元素，设置右浮动、上边距和操作按钮布局样式
- `close`：关闭按钮元素，设置位置、尺寸和交互样式
- `list`：通知列表容器元素（`useNotification` / `ConfigProvider` 配置生效）

## FAQ

### 为什么 notification 不能获取 context、Pinia 的内容和 ConfigProvider 的 `locale/prefixCls/theme` 等配置？

直接调用 notification 方法，antdv 会通过 `Vue.render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `notification.useNotification` 方法会返回 `api` 实体以及 `contextHolder` 节点。将其插入到你需要获取 context 位置即可：

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { notification } from '@hiltonkohler21/ant-design-vue';
  const [notificationApi, contextHolder] = notification.useNotification();
  notificationApi.open({
    // ...
  });
</script>
```

**异同**：通过 hooks 创建的 `contextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用。

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useNotification` 等方法需要手动植入 contextHolder 的问题。

### 静态方法如何设置 prefixCls ？

你可以通过 [`ConfigProvider.config`](/components/config-provider-cn#configproviderconfig-4130) 进行设置。

### 为什么 `style: { width: 'max-content' }` 在 Notification 上不生效？

Notification 使用固定宽度布局，以保证堆叠卡片样式的一致性。因此不支持在通知外层节点上使用 `max-content`、`min-content`、`fit-content(...)` 这类 intrinsic width。

如果你需要调整 Notification 的整体宽度，建议通过组件 token `width` 来配置：

```html
<a-config-provider
  :theme="{
    components: {
      Notification: {
        width: 480,
      },
    },
  }"
>
  <a-app>...</a-app>
</a-config-provider>
```

如果你只是希望通知内容本身按内容宽度排布，可以在 `title` 或 `description` 里自行渲染 VNode，并把 `max-content` 放在内部节点上，而不是放在 Notification 根节点上。
