---
category: Components
type: 反馈
title: Drawer
subtitle: 抽屉
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v3TvSq2E0HAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*4wzwRIBLuqEAAAAAAAAAAAAADrJ8AQ/original
---

屏幕边缘滑出的浮层面板。

## 何时使用

抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到原任务。

- 当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
- 当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。

## API

**🚨 注意：** v4 使用 `rootClassName` 与 `rootStyle` 来配置最外层元素样式。原 `class` 与 `style` 改至配置 Drawer 窗体样式以和 Modal 对齐；推荐使用 `classNames` 与 `styles` 配置各语义区域。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterOpenChange | 切换抽屉时动画结束后的回调 | (open: boolean) => void | - | 4.3.0 |
| ariaId | 用于无障碍关联的 `aria-labelledby` 标识（绑定到标题节点 `id` 与容器 `aria-labelledby`） | string | - | 4.3.0 |
| autofocus | 抽屉展开后是否将焦点切换至其 Dom 节点 | boolean | `true` | 3.0.0 |
| ~~bodyStyle~~ | 可用于设置 Drawer 内容部分的样式（已废弃，请使用 `styles.body`） | CSSProperties | - |  |
| class | Drawer 容器外层 className 设置，如果需要设置最外层，请使用 `rootClassName` | string | - |  |
| classNames | 配置抽屉内置模块的 className | { mask?: string; wrapper?: string; content?: string; header?: string; body?: string; footer?: string } | - | 4.3.0 |
| closable | 是否显示关闭按钮，或自定义关闭按钮配置 | boolean \| `{ closeIcon?: VueNode; disabled?: boolean; placement?: 'start' \| 'end'; 'aria-label'?: string }` | `true` | 4.3.0 |
| closeIcon | 自定义关闭图标 | VueNode \| slot | `<CloseOutlined />` | 3.0.0 |
| ~~contentWrapperStyle~~ | 可用于设置 Drawer 包裹内容部分的样式（已废弃，请使用 `styles.wrapper`） | CSSProperties | - | 3.0.0 |
| ~~destroyOnClose~~ | 关闭时销毁 Drawer 里的子元素（已废弃，请使用 `destroyOnHidden`） | boolean | `false` |  |
| destroyOnHidden | 关闭时销毁 Drawer 里的子元素 | boolean | `false` | 4.3.0 |
| ~~drawerStyle~~ | 可用于设置 Drawer 弹出层样式（已废弃，请使用 `styles.content`） | CSSProperties | - |  |
| extra | 抽屉右上角的操作区域 | VueNode \| slot | - | 3.0.0 |
| footer | 抽屉的页脚 | VueNode \| slot | - | 3.0.0 |
| ~~footerStyle~~ | 抽屉页脚部件的样式（已废弃，请使用 `styles.footer`） | CSSProperties | - | 3.0.0 |
| forceRender | 预渲染 Drawer 内元素 | boolean | `false` | 3.0.0 |
| getContainer | 指定 Drawer 挂载的节点，**并在容器内展现** | string \| HTMLElement \| (() => HTMLElement) \| false | `'body'` |  |
| ~~headerStyle~~ | 用于设置 Drawer 头部的样式（已废弃，请使用 `styles.header`） | CSSProperties | - | 3.0.0 |
| height | 高度，在 `placement` 为 `top` 或 `bottom` 时使用 | string \| number | `378` |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | `true` |  |
| loading | 显示骨架屏加载状态 | boolean | `false` | 4.3.0 |
| mask | 是否展示遮罩，或配置遮罩毛玻璃与点击关闭行为 | boolean \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` | 4.3.0 |
| maskClosable | 点击蒙层是否允许关闭 | boolean | `true` |  |
| ~~maskStyle~~ | 遮罩样式（已废弃，请使用 `styles.mask`） | CSSProperties | `{}` |  |
| open(v-model) | Drawer 是否可见 | boolean | - | 4.0 |
| placement | 抽屉的方向 | `top` \| `right` \| `bottom` \| `left` | `right` |  |
| push | 用于设置多层 Drawer 的推动行为 | boolean \| { distance: string \| number } | `{ distance: 180 }` | 3.0.0 |
| resizable | 是否允许通过拖拽边缘调整抽屉尺寸 | boolean \| `{ onResizeStart?: () => void; onResize?: (size: number) => void; onResizeEnd?: () => void }` | `false` | 4.3.0 |
| rootClassName | 对话框外层容器的类名 | string | - | 4.0 |
| rootStyle | 可用于设置 Drawer 最外层容器的样式，和 `style` 的区别是作用节点包括 `mask` | CSSProperties | - | 4.0 |
| size | 预设抽屉宽度（或高度），支持 `default`（378px）、`large`（736px）或自定义数值 | `default` \| `large` \| number \| string | `default` | 3.0.0 |
| style | 设计 Drawer 容器样式，如果你只需要设置内容部分请使用 `styles.body` | CSSProperties | - |  |
| styles | 配置抽屉内置模块的 style | { mask?: CSSProperties; wrapper?: CSSProperties; content?: CSSProperties; header?: CSSProperties; body?: CSSProperties; footer?: CSSProperties } | - | 4.3.0 |
| title | 标题 | string \| slot | - |  |
| width | 宽度 | string \| number | `378` |  |
| zIndex | 设置 Drawer 的 `z-index` | number | `1000` |  |

## 事件

| 事件名称        | 描述                                 | 类型           | 默认值 | 版本 |
| --------------- | ------------------------------------ | -------------- | ------ | ---- |
| afterOpenChange | 切换抽屉时动画结束后的回调           | function(open) | -      | 4.0  |
| close           | 点击遮罩层或左上角叉或取消按钮的回调 | function(e)    | -      |      |
