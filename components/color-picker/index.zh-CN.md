---
category: Components
type: 数据录入
title: ColorPicker
subtitle: 颜色选择器
---

用于颜色选择。

## 何时使用

- 需要用户选择颜色时。

## API

### ColorPicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value(v-model) | 颜色值 | string | - | 4.3.0 |
| defaultValue | 默认颜色值 | string | `#1677ff` | 4.3.0 |
| disabled | 禁用 | boolean | false | 4.3.0 |
| disabledAlpha | 禁用透明度选择 | boolean | false | 4.3.0 |
| showText | 显示颜色文本 | boolean | false | 4.3.0 |
| presets | 预设颜色 | { label: string; colors: string[] }[] | - | 4.3.0 |
| allowClear | 允许清除 | boolean | false | 4.3.0 |
| open(v-model:open) | 受控展开 | boolean | - | 4.3.0 |
| size | 尺寸 | `large` \| `middle` \| `small` | `middle` | 4.3.0 |
| status | 校验状态 | `error` \| `warning` | - | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |

### 事件

| 事件名称   | 说明             | 回调参数                |
| ---------- | ---------------- | ----------------------- |
| change     | 颜色值变化时回调 | (color: string) => void |
| openChange | 弹层显隐回调     | (open: boolean) => void |

> 注：当前版本支持纯色（hex/rgb/hsb）选择，渐变色暂不支持。
