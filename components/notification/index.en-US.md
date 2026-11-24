---
category: Components
type: Feedback
title: Notification
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cRmqTY4nKPEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*W3RmSov-xVMAAAAAAAAAAAAADrJ8AQ/original
---

Display a notification message globally.

## When To Use

To display a notification message at any of the four corners of the viewport. Typically it can be used in the following cases:

- A notification with complex content.
- A notification providing a feedback based on the user interaction. Or it may show some details about upcoming steps the user may have to follow.
- A notification that is pushed by the application.

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

The properties of config are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Customized button group | VNode \| () => VNode | - | 4.3.0 |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom`, `bottomRight` or `bottomLeft` (unit: pixels) | string \| number | `24px` | - |
| ~~btn~~ | Customized button group, please use `actions` instead | VNode \| () => VNode | - | - |
| class | Customized CSS class | string | - | - |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| ((info: { props }) => Record<SemanticDOM, string>)` | - | 4.3.0 |
| closable | Whether to show the close button or custom close button config | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| description | The content of notification box | string \| VNode \| () => VNode | - | - |
| duration | Time in seconds before Notification is closed. When set to `0`, `null`, or `false`, it will never be closed automatically | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | Return the mount node for Notification | () => HTMLNode | () => document.body | - |
| icon | Customized icon | VNode \| () => VNode | - | - |
| key | The unique identifier of the Notification | string | - | - |
| ~~message~~ | The title of notification box (deprecated), please use `title` instead | string \| VNode \| () => VNode | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | `true` | 4.3.0 |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | string | `topRight` | `top` `bottom` 3.3.0 |
| props | An object that can contain `data-*`, `aria-*`, or `role` props, to be put on the notification `div` | Object | - | 4.3.0 |
| role | The semantics of notification content recognized by screen readers. The default value is `alert`. When set as the default value, the screen reader will promptly interrupt any ongoing content reading and prioritize the notification content for immediate attention | `'alert' \| 'status'` | `'alert'` | 4.3.0 |
| showProgress | Show progress bar for auto-closing notification | boolean | `false` | 4.3.0 |
| style | Customized inline style | CSSProperties | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| ((info: { props }) => Record<SemanticDOM, CSSProperties>)` | - | 4.3.0 |
| title | The title of notification box | string \| VNode \| () => VNode | - | 4.3.0 |
| top | Distance from the top of the viewport, when `placement` is `top`, `topRight` or `topLeft` (unit: pixels) | string \| number | `24px` | - |
| onClick | Specify a function that will be called when the notification is clicked | Function | - | - |
| onClose | Trigger when notification closed | Function | - | - |

- `notification.useNotification(config)`

The properties of config are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom`, `bottomRight` or `bottomLeft` (unit: pixels) | number \| string | `24` | - |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| ((info: { props }) => Record<SemanticDOM, string>)` | - | 4.3.0 |
| closable | Whether to show the close button or custom close button config | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| duration | Time in seconds before Notification is closed. When set to `0`, `null`, or `false`, it will never be closed automatically | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | Return the mount node for Notification | () => HTMLNode | () => document.body | - |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | 3.0 |
| pauseOnHover | Keep the timer running or not on hover | boolean | `true` | 4.3.0 |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | string | `topRight` | - |
| rtl | Whether to enable RTL mode | boolean | `false` | 3.0 |
| showProgress | Show progress bar for auto-closing notification | boolean | `false` | 4.3.0 |
| stack | Notifications will be stacked when amount reaches threshold, and expand on hover | boolean \| `{ threshold?: number }` | `{ threshold: 3 }` | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| ((info: { props }) => Record<SemanticDOM, CSSProperties>)` | - | 4.3.0 |
| top | Distance from the top of the viewport, when `placement` is `top`, `topRight` or `topLeft` (unit: pixels) | number \| string | `24` | - |

### ClosableType

| Property   | Description                           | Type                 | Default | Version |
| ---------- | ------------------------------------- | -------------------- | ------- | ------- |
| aria-label | Accessible label for the close button | string               | -       | 4.3.0   |
| closeIcon  | Custom close icon                     | VNode \| () => VNode | -       | 4.3.0   |
| disabled   | Whether to disable the close button   | boolean              | `false` | 4.3.0   |
| onClose    | Trigger when notification closes      | () => void           | -       | 4.3.0   |

### Global configuration

`notification` also provides a global `config()` method that can be used for specifying the default options. Once this method is used, all the notification boxes will take into account these globally defined options when displaying.

- `notification.config(options)`

  > When you use `ConfigProvider` for global configuration, the system will automatically start RTL mode by default.(3.0+)
  >
  > When you want to use it alone, you can start the RTL mode through the following settings.

```js
notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 3,
  rtl: true,
});
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom`, `bottomRight` or `bottomLeft` (unit: pixels) | string \| number | `24px` | - |
| closable | Whether to show the close button or custom close button config | boolean \| [ClosableType](#closabletype) | `true` | 4.3.0 |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VNode \| () => VNode \| null \| false | - | `null` / `false`: 4.3.0 |
| duration | Time in seconds before Notification is closed. When set to `0`, `null`, or `false`, it will never be closed automatically | number \| null \| false | `4.5` | `false`: 4.3.0 |
| getContainer | Return the mount node for Notification, but still display at fullScreen | () => HTMLNode | () => document.body | - |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | 3.0 |
| pauseOnHover | Keep the timer running or not on hover | boolean | `true` | 4.3.0 |
| placement | Position of Notification, can be one of `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | string | `topRight` | - |
| rtl | Whether to enable RTL mode | boolean | `false` | 3.0 |
| showProgress | Show progress bar for auto-closing notification | boolean | `false` | 4.3.0 |
| stack | Notifications will be stacked when count reaches threshold, and expand on hover | boolean \| `{ threshold?: number }` | `{ threshold: 3 }` | 4.3.0 |
| top | Distance from the top of the viewport, when `placement` is `top`, `topRight` or `topLeft` (unit: pixels) | string \| number | `24px` | - |

## Semantic DOM

`classNames` and `styles` support both static objects and `(info: { props }) => ...` functions, and automatically merge with `ConfigProvider`'s `notification.classNames` / `notification.styles`. Supported semantic keys (4.3.0+):

- `root`: Notice root element, set background color, border radius, shadow, padding and animation styles
- `wrapper`: Wrapper element for icon and content with content layout styles
- `icon`: Icon element, set positioning, font size, line height and status color styles
- `section`: Content section element that contains title and description
- `title`: Title element, set color, font size, line height and margin styles
- `description`: Description element, set font size, color and margin styles
- `actions`: Actions element, set float right, top margin and action button layout styles
- `close`: Close button element, set position, size and interaction styles
- `list`: Notification list container element (applied via `useNotification` / `ConfigProvider`)

## FAQ

### Why I can not access context, Pinia, ConfigProvider `locale/prefixCls/theme` in notification?

antdv will dynamic create Vue instance by `Vue.render` when call notification methods. Whose context is different with origin code located context.

When you need context info (like ConfigProvider context), you can use `notification.useNotification` to get `api` instance and `contextHolder` node. And put it in your children:

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { notification } from 'ant-design-vue';
  const [notificationApi, contextHolder] = notification.useNotification();
  notificationApi.open({
    // ...
  });
</script>
```

**Note:** You must insert `contextHolder` into your children with hooks. You can use origin method if you do not need context connection.

> [App Package Component](/components/app) can be used to simplify the problem of `useNotification` and other methods that need to manually implant contextHolder.

### How to set static methods prefixCls ?

You can config with [`ConfigProvider.config`](/components/config-provider#configproviderconfig-4130)

### Why doesn't `style: { width: 'max-content' }` work on Notification?

Notification uses a fixed-width layout so the stacked card style can stay consistent. Because of this, intrinsic widths such as `max-content`, `min-content`, and `fit-content(...)` are not supported on the outer notification node.

If you need to customize the notification width, use the component token `width`:

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

If you only need the content to size itself, render your own VNode in `title` or `description`, and apply `max-content` to the inner node instead of the notification root.
