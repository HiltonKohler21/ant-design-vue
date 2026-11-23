---
category: Components
type: 反馈
title: Spin
subtitle: 加载中
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
---

用于页面和区块的加载中状态。

## 何时使用

页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| delay | 延迟显示加载效果的时间（防止闪烁） | number (毫秒) | - |  |
| description | 自定义描述文案（优先级高于 `tip`） | VueNode \| slot | - | 4.3.0 |
| fullscreen | 显示带有 `Spin` 组件的背景 | boolean | false | 4.3.0 |
| indicator | 加载指示符 | vNode \| slot | - |  |
| percent | 展示进度（与 `indicator` 互斥），设置为 `'auto'` 时会自动平滑推进进度 | number \| `'auto'` | - | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| size | 组件大小，可选值为 `small` `default` `large` | string | `default` |  |
| spinning | 是否为加载中状态 | boolean | true |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| ~~tip~~ | 当作为包裹元素时，可以自定义描述文案，请使用 `description` 替代 | string \| slot | - | slot 3.0 |
| wrapperClassName | 包装器的类属性 | string | - |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `wrapper` \| `mask` \| `section` \| `indicator` \| `description` \| `tip` \| `container`。

### 静态方法

- `Spin.setDefaultIndicator({indicator})` 同上 `indicator`，你可以自定义全局默认元素

  ```jsx
  import { h } from 'vue';
  Spin.setDefaultIndicator({
    indicator: h('i', { class: 'anticon anticon-loading anticon-spin ant-spin-dot' }),
  });
  ```
