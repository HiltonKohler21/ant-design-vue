---
category: Components
type: 反馈
title: Modal
subtitle: 对话框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Z9vzQZAdJDQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WtgsSLPa1Z4AAAAAAAAAAAAADrJ8AQ/original
---

展示一个对话框，提供标题、内容区、操作区。

## 何时使用

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。

另外当需要一个简洁的确认框询问用户时，可以使用 [`App.useApp`](/components/app-cn) 封装的语法糖方法或 `Modal.confirm()`。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | function | - |  |
| afterOpenChange | 打开和关闭 Modal 时动画结束后的回调 | (open: boolean) => void | - | 4.3.0 |
| ~~bodyStyle~~ | Modal body 样式。请使用 `styles.body` 替代 | CSSProperties | {} |  |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| cancelText | 取消按钮文字 | string \| slot | `取消` |  |
| centered | 垂直居中展示 Modal | boolean | `false` |  |
| classNames | 用于自定义 Modal 组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | 4.3.0 |
| closable | 是否显示右上角的关闭按钮 | boolean \| [ClosableType](#closabletype) | true | 4.3.0 |
| closeIcon | 自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮 | VNode \| slot | &lt;CloseOutlined /> |  |
| confirmLoading | 确定按钮 loading | boolean | false |  |
| ~~destroyOnClose~~ | 关闭时销毁 Modal 里的子元素。请使用 `destroyOnHidden` 替代 | boolean | false |  |
| destroyOnHidden | 关闭时销毁 Modal 里的子元素 | boolean | false | 4.3.0 |
| focusable | 对话框内焦点管理的配置 | `{ trap?: boolean; focusTriggerAfterClose?: boolean }` | - | 4.3.0 |
| ~~focusTriggerAfterClose~~ | 对话框关闭后是否需要聚焦触发元素。请使用 `focusable.focusTriggerAfterClose` 替代 | boolean | true |  |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `:footer="null"` | string \| VNode \| slot \| (originNode: VueNode, extra: { OkBtn, CancelBtn }) => VueNode | (确定取消按钮) | renderFunction: 4.3.0 |
| forceRender | 强制渲染 Modal | boolean | false |  |
| getContainer | 指定 Modal 挂载的 HTML 节点，`false` 为挂载在当前位置 | HTMLElement \| () => HTMLElement \| string \| false | () => document.body |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| loading | 显示骨架屏加载状态 | boolean | false | 4.3.0 |
| mask | 遮罩效果 | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | true | 4.3.0 |
| ~~maskClosable~~ | 点击蒙层是否允许关闭。请使用 `mask.closable` 替代 | boolean | true |  |
| ~~maskStyle~~ | 遮罩样式。请使用 `styles.mask` 替代 | CSSProperties | {} |  |
| modalRender | 自定义渲染对话框 | (arg: { originVNode: VueNode }) => VueNode \| slot | - |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| okText | 确认按钮文字 | string \| slot | `确定` |  |
| okType | 确认按钮类型 | string | `primary` |  |
| open(v-model) | 对话框是否可见 | boolean | false |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| rootStyle | 根节点样式 | CSSProperties | - | 4.3.0 |
| styles | 用于自定义 Modal 组件内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 4.3.0 |
| title | 标题 | string \| slot | - |  |
| width | 宽度 | string \| number \| Partial<Record<[Breakpoint](/components/grid-cn/#col), string \| number>> | 520 | Breakpoint: 4.3.0 |
| wrapClassName | 对话框外层容器的类名 | string | - |  |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 |  |

### 事件

| 事件名称 | 说明                                 | 回调参数    |
| -------- | ------------------------------------ | ----------- |
| cancel   | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) |
| ok       | 点击确定回调                         | function(e) |

#### 注意

- `<a-modal />` 默认关闭后状态不会自动清空，如果希望每次打开都是新内容，请设置 `destroyOnHidden`。
- `Modal.method()` RTL 模式仅支持 hooks 用法。

### Modal.method()

包括：

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

以上均为一个函数，参数为 object，具体属性如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | function | - |  |
| appContext | 弹窗的上下文，一般用于获取全局注册组件、vuex 等内容 | - | - |  |
| ~~autoFocusButton~~ | 指定自动获得焦点的按钮。请使用 `focusable.autoFocusButton` 替代 | `null` \| `ok` \| `cancel` | `ok` |  |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| cancelText | 设置 Modal.confirm 取消按钮文字 | string | `取消` |  |
| centered | 垂直居中展示 Modal | boolean | `false` |  |
| class | 容器类名 | string | - |  |
| classNames | 用于自定义内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | 4.3.0 |
| closable | 是否显示右上角的关闭按钮 | boolean \| [ClosableType](#closabletype) | `false` | ClosableType: 4.3.0 |
| closeIcon | 自定义关闭图标 | VueNode \| () => VueNode | undefined |  |
| content | 内容 | string \| VNode \| () => VueNode | - |  |
| focusable.autoFocusButton | 指定自动获得焦点的按钮 | `null` \| `ok` \| `cancel` | `ok` | 4.3.0 |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `footer: null` | string \| VNode \| (originNode: VueNode, extra: { OkBtn, CancelBtn }) => VueNode | - | 4.0.0, renderFunction: 4.3.0 |
| getContainer | 指定 Modal 挂载的 HTML 节点，`false` 为挂载在当前 dom | HTMLElement \| () => HTMLElement \| string \| false | document.body |  |
| icon | 自定义图标（1.14.0 新增） | VNode \| () => VNode | &lt;ExclamationCircleFilled /> |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| mask | 遮罩效果 | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | true | object: 4.3.0 |
| ~~maskClosable~~ | 点击蒙层是否允许关闭。请使用 `mask.closable` 替代 | boolean | `false` |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| okText | 确认按钮文字 | string | `确定` |  |
| okType | 确认按钮类型 | string | `primary` |  |
| style | 可用于设置浮层的样式，调整浮层位置等 | CSSProperties | - |  |
| styles | 用于自定义内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 4.3.0 |
| title | 标题 | string \| VNode \| () => VueNode | - |  |
| width | 宽度 | string \| number | 416 |  |
| wrapClassName | 对话框外层容器的类名 | string | - | 3.2.3 |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 |  |
| onCancel | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function(close) | - |  |
| onOk | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function(close) | - |  |

### ClosableType

| 参数       | 说明                   | 类型     | 默认值    | 版本  |
| ---------- | ---------------------- | -------- | --------- | ----- |
| afterClose | Modal 完全关闭后的回调 | function | -         | 4.3.0 |
| closeIcon  | 自定义关闭图标         | VueNode  | undefined | 4.3.0 |
| disabled   | 关闭图标是否禁用       | boolean  | false     | 4.3.0 |
| onClose    | 弹窗关闭即时调用       | function | undefined | 4.3.0 |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```jsx
const modal = Modal.info();

modal.update({
  title: '修改的标题',
  content: '修改的内容',
});

// 支持传入函数的方式更新弹窗
modal.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title}（新）`,
}));

modal.destroy();
```

- `Modal.destroyAll`

使用 `Modal.destroyAll()` 可以销毁弹出的确认窗（即上述的 `Modal.info`、`Modal.success`、`Modal.error`、`Modal.warning`、`Modal.confirm`）。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭（`modal.destroy()` 适用于主动关闭，而不是路由这样被动关闭）。

```jsx
const router = createRouter({ ... });

// router change
router.beforeEach(() => {
  Modal.destroyAll();
});
```

### Modal.useModal()

当你需要使用 Context 时，可以通过 `Modal.useModal` 创建一个 `contextHolder` 插入子节点中。通过 hooks 创建的临时 Modal 将会得到 `contextHolder` 所在位置的所有上下文。创建的 `modal` 对象拥有与 [`Modal.method`](#modalmethod) 相同的创建通知方法。

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

`modal.confirm` 返回方法：

- `destroy`：销毁当前窗口
- `update`：更新当前窗口
- `then`：Promise 链式调用，支持 `await` 操作（`4.3.0`）。该方法为 Hooks 仅有

```jsx
// 点击 `onOk` 时返回 `true`，点击 `onCancel` 时返回 `false`
const confirmed = await modal.confirm({ ... });
```

## Semantic DOM

| 语义化名称 | 说明 | 版本 |
| --- | --- | --- |
| root | 根元素，包含相对定位、顶部位置、宽度、最大宽度、外边距等模态框容器的基础布局样式 | 4.3.0 |
| mask | 遮罩层元素，包含固定定位、层级、背景色、动画过渡等遮罩层的样式 | 4.3.0 |
| wrapper | 包裹层元素，一般用于动画容器，包含动画和过渡效果的样式 | 4.3.0 |
| container / content | Modal 容器元素，包含相对定位、背景色、圆角、阴影、内边距等模态框主体样式 | 4.3.0 |
| header | 头部元素，包含头部内边距、下边框等头部区域样式 | 4.3.0 |
| title | 标题元素，包含外边距、颜色、字体权重、字体大小、行高等标题文字样式 | 4.3.0 |
| body | 内容元素，包含内容区域的背景色、内边距等内容展示样式 | 4.3.0 |
| footer | 底部元素，包含底部的背景色、内边距、上边框、圆角等底部区域样式 | 4.3.0 |
| close | 关闭按钮元素，设置关闭按钮的样式 | 4.3.0 |

## FAQ

### 为什么 Modal 方法不能获取全局注册组件、context、vuex 等内容和 ConfigProvider `locale/prefixCls/theme` 配置，以及不能响应式更新数据？

直接调用 Modal 方法，组件会通过 `Vue.render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如使用全局注册的组件或 ConfigProvider 主题）时，可以通过 `Modal.useModal` 方法返回 `modal` 实体以及 `contextHolder` 节点，将其插入到你需要获取 context 的位置即可：

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

> 可通过 [App 包裹组件](/components/app-cn) 简化 `useModal` 等方法需要手动植入 `contextHolder` 的问题。
