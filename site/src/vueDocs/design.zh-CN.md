# Ant Design Vue 设计规范 (DESIGN.md)

> 本文档定义了 Ant Design Vue 的核心视觉设计语言、Token 层级结构与 UI 架构规范。可作为 AI 编码智能体（Cursor, Claude Code, Windsurf, Copilot, Antigravity）、设计工具与工程师在构建基于 `ant-design-vue` 的界面时的权威规范。

---

## 1. 设计价值观

Ant Design 秉承四大设计价值观：

- **自然 (Natural)**：遵循自然界的视觉规律与物理反馈，降低用户的认知负担，带来流畅舒适的交互体验。
- **确定 (Certain)**：具有高可预期的状态反馈与一致的操作范式，保持系统运行的秩序与稳定。
- **意义 (Meaningful)**：克制且精准的界面表达，引导用户的注意力聚焦于最重要的核心任务。
- **生长 (Growing)**：通过高度结构化、模块化的底层架构，适应多元复杂的企业级业务场景并持续自我演进。

---

## 2. Design Token 系统

Ant Design Vue 4.x（4.3.0 起默认开启原生 `--ant-*` CSS Variables 与可选零运行时模式）采用基于 CSS-in-JS 的四层 Token 架构：

```
Seed Token  --->  Map Token  --->  Alias Token  --->  Component Token
 (基础种子)       (梯度梯度)        (语义别名)         (组件定制)
```

### 2.1 种子 Token (Seed Token)

种子 Token 是设计系统的最小原子变量，决定整体风格基调：

| Token 变量 | 默认值 | 说明 |
| :-- | :-- | :-- |
| `colorPrimary` | `#1677ff` | 全局品牌主色 |
| `colorSuccess` | `#52c41a` | 成功状态色 |
| `colorWarning` | `#faad14` | 警示状态色 |
| `colorError` | `#ff4d4f` | 错误 / 危险状态色 |
| `colorInfo` | `#1677ff` | 信息状态色 |
| `colorTextBase` | `#000000` | 基础文本色 |
| `colorBgBase` | `#ffffff` | 基础背景色 |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | 系统字体栈 |
| `fontSize` | `14` | 基准字号 (px) |
| `lineWidth` | `1` | 基准边框线宽 (px) |
| `borderRadius` | `6` | 基准圆角半径 (px) |
| `sizeUnit` | `4` | 基础布局单元 (px) |
| `sizeStep` | `4` | 尺寸阶梯步长 |
| `motionUnit` | `0.1` | 动画基础时长单位 (s) |

### 2.2 色彩体系

#### 功能与语义色彩

- **主色 (`#1677ff`)**：核心交互动作、焦点状态、选中状态。
- **成功色 (`#52c41a`)**：正向操作成功提示、运行良好状态。
- **警示色 (`#faad14`)**：注意提醒、非阻塞警告、等待处理状态。
- **错误色 (`#ff4d4f`)**：破坏性操作、表单校验失败、异常阻断提示。

#### 中性色阶与层级

- `colorText`: `#000000e0` (88% 不透明度) - 一级文本、正文内容、标题。
- `colorTextSecondary`: `#000000a6` (65% 不透明度) - 二级文本、辅助说明、标签描述。
- `colorTextTertiary`: `#00000073` (45% 不透明度) - 弱提示、输入框占位符 (Placeholder)。
- `colorTextQuaternary`: `#00000040` (25% 不透明度) - 禁用状态、分割装饰线。
- `colorBgContainer`: `#ffffff` - 组件容器背景（Card、Modal、Popover 等）。
- `colorBgElevated`: `#ffffff` - 浮层提升背景（下拉菜单、浮层提示等）。
- `colorBgLayout`: `#f5f5f5` - 整个页面的底色背景。
- `colorBorder`: `#d9d9d9` - 默认边框线条。
- `colorBorderSecondary`: `#f0f0f0` - 浅色分割线、表格内部分隔线。

### 2.3 预设色板

Ant Design Vue 提供 13 种内置调色板：

- `blue`: `#1677ff` (蔚蓝)
- `purple`: `#722ed1` (极客紫)
- `cyan`: `#13c2c2` (明青)
- `green`: `#52c41a` (极光绿)
- `magenta`: `#eb2f96` (法式洋红)
- `pink`: `#eb2f96` (洋红)
- `red`: `#f5222d` (薄暮红)
- `orange`: `#fa8c16` (日暮橙)
- `yellow`: `#fadb14` (日出黄)
- `volcano`: `#fa541c` (火山红)
- `geekblue`: `#2f54eb` (极客蓝)
- `gold`: `#faad14` (金盏黄)
- `lime`: `#a0d911` (青柠)

---

## 3. 布局与间距规范

### 3.1 4px 基础网格间距

所有外边距、内边距和间距均基于 **4px 网格**：

| Token 名称    | 数值   | 典型应用场景                                      |
| :------------ | :----- | :------------------------------------------------ |
| `sizeXXS`     | `4px`  | 图标内边距、微型标签                              |
| `sizeXS`      | `8px`  | 紧凑按钮间距、紧密文字与控件间距                  |
| `sizeSM`      | `12px` | 表单项内水平间距、小型卡片内边距                  |
| `size` (base) | `16px` | 标准间距 (`<a-space :size="16">`)、卡片内容外边距 |
| `sizeMD`      | `20px` | 中型模块区隔                                      |
| `sizeLG`      | `24px` | 页面容器标准内边距、弹窗内容区边距                |
| `sizeXL`      | `32px` | 模块分割大间距                                    |
| `sizeXXL`     | `48px` | 页面主区域空状态、首屏留白                        |

### 3.2 24 栅格系统 (`<a-row>`, `<a-col>`)

- 每行栅格总数为 `24`。
- 间隔支持水平与垂直方向：`:gutter="[16, 16]"`。
- 响应式断点：
  - `xs`: `< 576px` (移动屏幕)
  - `sm`: `>= 576px` (大屏手机 / 小平板)
  - `md`: `>= 768px` (平板屏幕)
  - `lg`: `>= 992px` (标准桌面)
  - `xl`: `>= 1200px` (宽屏桌面)
  - `xxl`: `>= 1600px` (超大宽屏)

### 3.3 弹性布局 (`<a-flex>`)

使用 `<a-flex>` 快捷构建现代 Flexbox 布局：

- `gap`: `'small' | 'middle' | 'large'` 或像素数值。
- `justify`: `'start' | 'end' | 'center' | 'space-between' | 'space-around'`。
- `align`: `'start' | 'end' | 'center' | 'baseline' | 'stretch'`。

---

## 4. 字体与排版规范

| Token              | 字号   | 行高   | 应用范围                              |
| :----------------- | :----- | :----- | :------------------------------------ |
| `fontSizeSM`       | `12px` | `20px` | 辅助说明文字、角标、标签提示          |
| `fontSize` (base)  | `14px` | `22px` | 标准正文、表单输入、表格数据          |
| `fontSizeLG`       | `16px` | `24px` | 子标题、卡片头部标题                  |
| `fontSizeXL`       | `20px` | `28px` | 四级标题 (`<h4>`)、弹窗标题           |
| `fontSizeHeading3` | `24px` | `32px` | 三级标题 (`<h3>`)                     |
| `fontSizeHeading2` | `30px` | `38px` | 二级标题 (`<h2>`)、抽屉主标题         |
| `fontSizeHeading1` | `38px` | `46px` | 一级标题 (`<h1>`)、仪表盘重点数据看板 |

字重规范：

- 常规体：`400` (`fontWeightNormal`)
- 中粗体：`500`
- 粗体：`600` (`fontWeightStrong`)

---

## 5. 形状、阴影与动效

### 5.1 圆角系统

- `borderRadiusXS`: `2px` (微小标记)
- `borderRadiusSM`: `4px` (标签、小型按钮、Tooltip)
- `borderRadius`: `6px` (标准按钮、输入框、卡片)
- `borderRadiusLG`: `8px` (对话框、抽屉、通知面板)

### 5.2 投影层级

- `boxShadow`: 下拉菜单、气泡卡片等浅层浮起元素。
- `boxShadowSecondary`: 卡片悬浮卡片高亮阴影。
- `boxShadowTertiary`: Modal 弹窗、Notification 通知卡片等顶层覆盖层。

### 5.3 贝塞尔缓动曲线

- 进入缓动: `motionEaseOutCirc = cubic-bezier(0.08, 0.82, 0.17, 1)`
- 退出缓动: `motionEaseInOutCirc = cubic-bezier(0.78, 0.14, 0.15, 0.86)`
- 回弹微动: `motionEaseOutBack = cubic-bezier(0.12, 0.4, 0.29, 1.46)`

---

## 6. AI 编码与组件落地指引

### 6.1 按钮使用准则

- **主要按钮 (`type="primary"`)**：一个界面主区域或弹窗底部仅允许存在一个主操作。
- **默认按钮 (`type="default"`)**：次级操作、取消、常规功能。
- **危险按钮 (`danger`)**：删除、销毁数据等不可逆操作，必须配合 `<a-popconfirm>` 提示。

### 6.2 表单设计规范

- 默认推荐 `layout="vertical"`，适配移动端和紧凑侧边面板。
- 数据绑定必须使用 `v-model:value`。
- 校验规则统一配置于 `<a-form-item :rules="[...]">`。

### 6.3 反馈浮层准则

- 弹窗使用 `<a-modal v-model:open="isOpen">`。
- 全局反馈优先使用 `<a-app>` 下的 `App.useApp()` 获取上下文响应的 `message`、`modal`、`notification`。

---

## 7. 在 Vue 3 中动态应用与消费 Token

### 7.1 全局配置主题

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
      },
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <a-app>
      <router-view />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { theme } from 'ant-design-vue';
</script>
```

### 7.2 在自定义组件中获取 Token

智能体或开发者可在自定义组件中响应式获取当前主题的 Token：

```html
<template>
  <div :style="boxStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { theme } from 'ant-design-vue';

  const { useToken } = theme;
  const { token } = useToken();

  const boxStyle = computed(() => ({
    backgroundColor: token.value.colorBgContainer,
    color: token.value.colorText,
    borderRadius: `${token.value.borderRadius}px`,
    border: `1px solid ${token.value.colorBorder}`,
    padding: `${token.value.padding}px`,
    boxShadow: token.value.boxShadowSecondary,
  }));
</script>
```
