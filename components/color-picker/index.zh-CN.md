---
category: Components
type: 数据录入
title: ColorPicker
subtitle: 颜色选择器
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*2k5wR4L6y5gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*eM07S6sQ0uUAAAAAAAAAAAAADrJ8AQ/original
---

提供颜色选择功能的输入组件，支持纯色、渐变色、预设色板、透明度调节及多种颜色格式输入。

## 何时使用

- 需要用户选择颜色时，如主题色定制、画布调色、标签色彩设置等场景。
- 支持单色与渐变色的自由切换，适合设计工具与多媒体编辑面板。

## API

### ColorPicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value(v-model:value) | 颜色值（受控） | string | - | 4.3.0 |
| defaultValue | 默认颜色值 | string | `#1677ff` | 4.3.0 |
| open(v-model:open) | 浮层是否展开（受控） | boolean | - | 4.3.0 |
| allowClear | 是否允许清除已选择的颜色 | boolean | false | 4.3.0 |
| arrow | 配置浮层箭头 | boolean \| { pointAtCenter: boolean } | false | 4.3.0 |
| defaultFormat | 默认颜色格式 | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | 4.3.0 |
| disabled | 是否禁用 | boolean | false | 4.3.0 |
| disabledAlpha | 是否禁用透明度选择 | boolean | false | 4.3.0 |
| disabledFormat | 是否禁用颜色格式切换 | boolean | false | 4.3.0 |
| format | 颜色格式（受控） | `'hex' \| 'rgb' \| 'hsb'` | - | 4.3.0 |
| mode | 配置单色还是渐变色模式 | `'single' \| 'gradient' \| ('single' \| 'gradient')[]` | `'single'` | 4.3.0 |
| panelRender | 自定义渲染面板内容 | `(panel: VNode) => VNode` | - | 4.3.0 |
| placement | 浮层弹出位置 | `top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom` | `bottomLeft` | 4.3.0 |
| presets | 预设颜色快捷选项 | `{ label: string; colors: string[] }[]` | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showText | 是否在触发器上显示颜色文本，或传入自定义渲染函数 | boolean \| `(color: AggregationColor) => VNode \| string` | false | 4.3.0 |
| size | 触发器尺寸大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | 4.3.0 |
| status | 校验状态 | `'error' \| 'warning'` | - | 4.3.0 |
| trigger | 浮层触发方式 | `'click' \| 'hover'` | `'click'` | 4.3.0 |

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 颜色值变化时的回调（实时拖拽同步） | `(color: string) => void` |
| changeComplete | 颜色选择完成时的回调（松手或确认后触发） | `(color: string) => void` |
| clear | 点击清除按钮时的回调 | `() => void` |
| formatChange | 颜色格式切换时的回调 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |
| modeChange | 模式切换时的回调 | `(mode: 'single' \| 'gradient') => void` |
| openChange | 浮层展开/收起状态变化时的回调 | `(open: boolean) => void` |

### 插槽

| 插槽名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义颜色选择器的触发器 | - |
