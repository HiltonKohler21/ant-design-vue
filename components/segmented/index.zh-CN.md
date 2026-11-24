---
category: Components
subtitle: 分段控制器
type: 数据展示
title: Segmented
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XJR2TbS1aaQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-9tSSoO_MkIAAAAAAAAAAAAADrJ8AQ/original
---

分段控制器。

## 何时使用

- 用于展示多个选项并允许用户选择其中单个选项；
- 当切换选中选项时，关联区域的内容会发生变化。

## API

### Segmented

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将宽度调整为父元素宽度的选项 | boolean | false |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultValue | 默认选中的值 | string \| number | `options` 首项的值 | 4.3.0 |
| disabled | 是否禁用 | boolean | false |  |
| name | Segmented 下所有 `input[type="radio"]` 的 `name` 属性。若未设置，则将回退到自动生成的唯一名称 | string | - | 4.3.0 |
| options | 数据化配置选项内容 | string[] \| number[] \| SegmentedOption[] | [] |  |
| orientation | 排列方向（与 `vertical` 同时存在时以 `orientation` 为准） | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| shape | 形状 | `default` \| `round` | `default` | 4.3.0 |
| size | 控件尺寸 | `large` \| `middle` \| `medium` \| `small` | `middle` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| value | 当前选中的值 | string \| number | - |  |
| vertical | 方向是否垂直（与 `orientation` 同时存在时以 `orientation` 为准） | boolean | false | 4.3.0 |
| label | 使用插槽自定义 label | v-slot:label="SegmentedBaseOption" | - |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `icon` \| `label` \| `item`。

### 事件

| 事件名称 | 说明                 | 回调参数                          |
| -------- | -------------------- | --------------------------------- |
| change   | 选项变化时的回调函数 | function(value: string \| number) |

#### SegmentedBaseOption、SegmentedOption

```ts
interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any; // payload more data
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
  icon?: VueNode;
  tooltip?: string | TooltipProps;
}
interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}
```
