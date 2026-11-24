---
category: Components
type: Feedback
title: Modal
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Z9vzQZAdJDQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WtgsSLPa1Z4AAAAAAAAAAAAADrJ8AQ/original
---

Display a modal dialog box, providing a title, content area, and action buttons.

## When To Use

When requiring users to interact with the application, but without jumping to a new page and interrupting the user's workflow, you can use `Modal` to create a new floating layer over the current page to get user feedback or display information. Additionally, if you need to show a simple confirmation dialog, you can use [`App.useApp`](/components/app/) hooks or `Modal.confirm()`.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | function | - |  |
| afterOpenChange | Callback when the animation ends when Modal is turned on and off | (open: boolean) => void | - | 4.3.0 |
| ~~bodyStyle~~ | Body style for modal body element. Please use `styles.body` instead | CSSProperties | {} |  |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | Text of the Cancel button | string \| slot | `Cancel` |  |
| centered | Centered Modal | boolean | `false` |  |
| classNames | Customize class for each semantic structure inside the Modal component. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | 4.3.0 |
| closable | Whether a close (x) button is visible on top right of the modal dialog or not | boolean \| [ClosableType](#closabletype) | true | 4.3.0 |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VNode \| slot | &lt;CloseOutlined /> |  |
| confirmLoading | Whether to apply loading visual effect for OK button or not | boolean | false |  |
| ~~destroyOnClose~~ | Whether to unmount child components on close. Please use `destroyOnHidden` instead | boolean | false |  |
| destroyOnHidden | Whether to unmount child components when hidden | boolean | false | 4.3.0 |
| focusable | Configuration for focus management in the Modal | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - | 4.3.0 |
| ~~focusTriggerAfterClose~~ | Whether need to focus trigger element after dialog is closed. Please use `focusable.focusTriggerAfterClose` instead | boolean | true |  |
| footer | Footer content, set as `:footer="null"` when you don't need default buttons | string \| VNode \| slot \| (originNode: VueNode, extra: { OkBtn, CancelBtn }) => VueNode | (OK and Cancel buttons) | renderFunction: 4.3.0 |
| forceRender | Force render Modal | boolean | false |  |
| getContainer | The mounted node for Modal, `false` renders in place | HTMLElement \| () => HTMLElement \| string \| false | () => document.body |  |
| keyboard | Whether support press esc to close | boolean | true |  |
| loading | Show the skeleton loading state | boolean | false | 4.3.0 |
| mask | Mask effect | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | true | 4.3.0 |
| ~~maskClosable~~ | Whether to close the modal dialog when the mask (area outside the modal) is clicked. Please use `mask.closable` instead | boolean | true |  |
| ~~maskStyle~~ | Style for modal's mask element. Please use `styles.mask` instead | CSSProperties | {} |  |
| modalRender | Custom modal content render | (arg: { originVNode: VueNode }) => VueNode \| slot | - |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  |
| okText | Text of the OK button | string \| slot | `OK` |  |
| okType | Button `type` of the OK button | string | `primary` |  |
| open(v-model) | Whether the modal dialog is visible or not | boolean | false |  |
| rootClassName | Root class name | string | - | 4.3.0 |
| rootStyle | Root inline style | CSSProperties | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the Modal component. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 4.3.0 |
| title | The modal dialog's title | string \| slot | - |  |
| width | Width of the modal dialog | string \| number \| Partial<Record<[Breakpoint](/components/grid/#col), string \| number>> | 520 | Breakpoint: 4.3.0 |
| wrapClassName | The class name of the container of the modal dialog | string | - |  |
| zIndex | The `z-index` of the Modal | number | 1000 |  |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| cancel | Specify a function that will be called when a user clicks mask, close button on top right or Cancel button | function(e) |
| ok | Specify a function that will be called when a user clicks the OK button | function(e) |

#### Note

- The state of Modal will be preserved at its component lifecycle by default. If you wish to open it with a brand new state every time, set `destroyOnHidden` on it.
- `Modal.method()` RTL mode only supports hooks.

### Modal.method()

There are five ways to display the information based on the content's nature:

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

The items listed above are all functions, expecting a settings object as parameter. The properties of the object are as follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | function | - |  |
| appContext | The context of the pop-up window, used to obtain global registered components, vuex, etc. | - | - |  |
| ~~autoFocusButton~~ | Specify which button to autofocus. Please use `focusable.autoFocusButton` instead | `null` \| `ok` \| `cancel` | `ok` |  |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | Text of the Cancel button with Modal.confirm | string | `Cancel` |  |
| centered | Centered Modal | boolean | `false` |  |
| class | Class of container | string | - |  |
| classNames | Customize class for each semantic structure. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | 4.3.0 |
| closable | Whether a close (x) button is visible on top right of the confirm dialog or not | boolean \| [ClosableType](#closabletype) | `false` | ClosableType: 4.3.0 |
| closeIcon | Custom close icon | VueNode \| () => VueNode | undefined |  |
| content | Content | string \| VNode \| () => VueNode | - |  |
| focusable.autoFocusButton | Specify which button to autofocus | `null` \| `ok` \| `cancel` | `ok` | 4.3.0 |
| footer | Footer content, set as `footer: null` when you don't need default buttons | string \| VNode \| (originNode: VueNode, extra: { OkBtn, CancelBtn }) => VueNode | - | 4.0.0, renderFunction: 4.3.0 |
| getContainer | Return the mount node for Modal, `false` renders in place | HTMLElement \| () => HTMLElement \| string \| false | document.body |  |
| icon | Custom icon (`Added in 1.14.0`) | VNode \| () => VNode | &lt;ExclamationCircleFilled /> |  |
| keyboard | Whether support press esc to close | boolean | true |  |
| mask | Mask effect | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | true | object: 4.3.0 |
| ~~maskClosable~~ | Whether to close the modal dialog when the mask (area outside the modal) is clicked. Please use `mask.closable` instead | boolean | `false` |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  |
| okText | Text of the OK button | string | `OK` |  |
| okType | Button `type` of the OK button | string | `primary` |  |
| style | Style of floating layer, typically used for adjusting the position | CSSProperties | - |  |
| styles | Customize inline style for each semantic structure. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 4.3.0 |
| title | Title | string \| VNode \| () => VueNode | - |  |
| width | Width of the modal dialog | string \| number | 416 |  |
| wrapClassName | The class name of the container of the modal dialog | string | - | 3.2.3 |
| zIndex | The `z-index` of the Modal | number | 1000 |  |
| onCancel | Click to cancel callback; parameter is the closing function. Returns a promise to delay closing | function(close) | - |  |
| onOk | Click to ok callback; parameter is the closing function. Returns a promise to delay closing | function(close) | - |  |

### ClosableType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | function | - | 4.3.0 |
| closeIcon | Custom close icon | VueNode | undefined | 4.3.0 |
| disabled | Whether disabled close icon | boolean | false | 4.3.0 |
| onClose | Trigger when modal closes | function | undefined | 4.3.0 |

All the `Modal.method`s will return a reference, and then we can update and close the modal dialog by the reference.

```jsx
const modal = Modal.info();

modal.update({
  title: 'Updated title',
  content: 'Updated content',
});

// You can also pass a function to update modal
modal.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title} (New)`,
}));

modal.destroy();
```

- `Modal.destroyAll`

`Modal.destroyAll()` could destroy all confirmation modal dialogs (`Modal.info`, `Modal.success`, `Modal.error`, `Modal.warning`, `Modal.confirm`). Usually, you can use it in router change event to destroy confirm modal dialog automatically without using modal reference to close (`modal.destroy()` is suitable for active closing rather than passive closing like routing).

```jsx
const router = createRouter({ ... });

// router change
router.beforeEach(() => {
  Modal.destroyAll();
});
```

### Modal.useModal()

When you need to use Context, you can use `contextHolder` created by `Modal.useModal` to insert into children. Modal created by hooks will get all the context where `contextHolder` is placed. Created `modal` has the same creating functions as [`Modal.method`](#modalmethod).

```html
<template>
  <contextHolder />
</template>
<script setup>
  import { Modal } from 'ant-design-vue';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

`modal.confirm` return methods:

- `destroy`: Destroy current modal
- `update`: Update current modal
- `then`: (Hooks only, `4.3.0`) Promise chain call, supports `await` operation

```jsx
// Return `true` when clicking `onOk` and `false` when clicking `onCancel`
const confirmed = await modal.confirm({ ... });
```

## Semantic DOM

| Semantic Name | Description | Version |
| --- | --- | --- |
| root | Root element with relative positioning, top position, width, max-width, margins and other basic layout styles for modal container | 4.3.0 |
| mask | Mask element with fixed positioning, z-index, background color, animation transitions and other mask layer styles | 4.3.0 |
| wrapper | Wrapper element used for motion container with animation and transition effect styles | 4.3.0 |
| container / content | Modal container element with relative positioning, background, border-radius, box-shadow, padding and other modal body styles | 4.3.0 |
| header | Header element with padding, bottom border and other header area styles | 4.3.0 |
| title | Title element with margin, color, font-weight, font-size, line-height and other title text styles | 4.3.0 |
| body | Body element with content area background color, padding and other content display styles | 4.3.0 |
| footer | Footer element with footer background color, padding, top border, border-radius and other footer area styles | 4.3.0 |
| close | Close button element, sets basic close button styles | 4.3.0 |

## FAQ

### Why can't the Modal method obtain global registered components, context, vuex, etc. and ConfigProvider `locale/prefixCls/theme` configuration, and can't update data responsively?

Call the Modal method directly, and the component will dynamically create a new Vue entity through `Vue.render`. Its context is not the same as the context where the current code is located, so the context information cannot be obtained.

When you need context information (for example, using a globally registered component or ConfigProvider theme), you can use `Modal.useModal` to get `modal` instance and `contextHolder` node, and put it in your children:

```html
<template>
  <contextHolder />
</template>
<script setup>
  import { Modal } from 'ant-design-vue';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

> [App Package Component](/components/app) can be used to simplify the problem of `useModal` and other methods that need to manually implant `contextHolder`.
