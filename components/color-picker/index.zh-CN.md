---
category: Components
type: 数据录入
title: ColorPicker
subtitle: 颜色选择器
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
tag: 4.3.0
---

提供颜色选择功能的输入组件，支持纯色、渐变色、预设色板、透明度调节及多种颜色格式输入。

## 何时使用

- 需要用户选择颜色时，如主题色定制、画布调色、标签色彩设置等场景。
- 支持单色与渐变色的自由切换，适合设计工具与多媒体编辑面板。

## API

### ColorPicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否允许清除已选择的颜色 | boolean | false | 4.3.0 |
| arrow | 配置浮层箭头 | boolean \| { pointAtCenter?: boolean } | true | 4.3.0 |
| autoAdjustOverflow | 浮层被遮挡时自动调整位置 | boolean | true | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| `(info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultFormat | 默认颜色格式 | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | 4.3.0 |
| defaultValue | 默认颜色值 | [ColorType](#colortype) | `#1677ff` | 4.3.0 |
| destroyOnHidden | 关闭后是否销毁弹窗 | boolean | false | 4.3.0 |
| ~~destroyTooltipOnHide~~ | 关闭后是否销毁弹窗，请使用 `destroyOnHidden` 替代 | boolean | false | 4.3.0 |
| disabled | 是否禁用 | boolean | false | 4.3.0 |
| disabledAlpha | 是否禁用透明度选择 | boolean | false | 4.3.0 |
| disabledFormat | 是否禁用颜色格式切换 | boolean | false | 4.3.0 |
| format | 颜色格式（受控） | `'hex' \| 'rgb' \| 'hsb'` | - | 4.3.0 |
| formatter | 自定义输出颜色字符串的格式化函数 | `(color: string) => string` | - | 4.3.0 |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | `(triggerNode: HTMLElement) => HTMLElement` | `() => document.body` | 4.3.0 |
| mode | 配置单色还是渐变色模式 | `'single' \| 'gradient' \| ('single' \| 'gradient')[]` | `'single'` | 4.3.0 |
| open(v-model:open) | 浮层是否展开（受控） | boolean | - | 4.3.0 |
| panelRender | 自定义渲染面板内容 | `(panel: VNode, extra?: { components: { Picker: any; Presets: any } }) => VNode` | - | 4.3.0 |
| placement | 浮层弹出位置 | `top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom` | `bottomLeft` | 4.3.0 |
| prefix | 触发器前缀内容 | VNode | - | 4.3.0 |
| presets | 预设颜色快捷选项 | [PresetColorType](#presetcolortype)[] | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showText | 是否在触发器上显示颜色文本，或传入自定义渲染函数 | boolean \| `(color: AggregationColor) => VNode \| string` | false | 4.3.0 |
| size | 触发器尺寸大小 | `'large' \| 'middle' \| 'medium' \| 'small'` | `'middle'` | 4.3.0 |
| status | 校验状态 | `'error' \| 'warning'` | - | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| `(info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| trigger | 浮层触发方式 | `'click' \| 'hover'` | `'click'` | 4.3.0 |
| value(v-model:value) | 颜色值（受控） | [ColorType](#colortype) | - | 4.3.0 |

#### ColorType

```typescript
type ColorType =
  | string
  | AggregationColor
  | {
      color: string;
      percent: number;
    }[];
```

#### PresetColorType

```typescript
type PresetColorType = {
  label: VNode | string;
  defaultOpen?: boolean;
  key?: string | number;
  colors: ColorType[];
};
```

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

| 插槽名称 | 说明                     | 参数 |
| -------- | ------------------------ | ---- |
| default  | 自定义颜色选择器的触发器 | -    |

## Semantic DOM

| 插槽            | 说明                 | 版本  |
| --------------- | -------------------- | ----- |
| root            | 根元素容器           | 4.3.0 |
| body            | 色块容器元素         | 4.3.0 |
| content         | 色块颜色元素         | 4.3.0 |
| description     | 触发器描述文本元素   | 4.3.0 |
| popup.root      | 弹出层根元素         | 4.3.0 |
| popup.container | 弹出面板内容容器元素 | 4.3.0 |
