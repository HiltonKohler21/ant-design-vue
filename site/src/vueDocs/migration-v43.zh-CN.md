# 从 4.2.6 升级到 4.3.0

本文档将帮助你从 `ant-design-vue@4.2.6` 平滑升级到 `ant-design-vue@4.3.0`（包含 `4.2.7` 与 `4.3.0` 的全部能力演进）。`4.3.0` 引入了对齐 Ant Design v6 性能层的**原生 CSS Variables 默认模式**与**零运行时静态样式提取**，补齐了 `Masonry`、`BorderBeam`、`Listy`、`Splitter`、`ColorPicker`、`Input.OTP` 等 6 个高频组件，并完成了 72 项 `ConfigProvider` 组件级默认配置与大量现代化 API 升级。

> 如果你是从 `3.x` 升级，请先阅读 [从 V3 到 V4 升级指南](/docs/vue/migration-v4-cn)。

## 1. 升级准备与依赖安装

### 环境要求

- **Vue**：`>= 3.2.0`（推荐 `3.4+` 或 `3.5+`）
- **TypeScript**：`>= 4.9`（推荐 `5.x`）
- **Node.js**：`>= 18`
- **浏览器**：最近 2 个版本的现代浏览器（默认启用原生 CSS Variables 与 `calc()`；如需兼容旧版浏览器，请参考 [样式兼容](/docs/vue/compatible-style-cn)）

### 升级命令

使用你偏好的包管理器将 `ant-design-vue` 升级至 `4.3.0`：

```bash
# npm
npm install ant-design-vue@4.3.0

# yarn
yarn add ant-design-vue@4.3.0

# pnpm
pnpm add ant-design-vue@4.3.0
```

如项目中使用了图标库，建议同步更新 `@ant-design/icons-vue` 至最新 7.x 版本：

```bash
npm install @ant-design/icons-vue@latest
```

---

## 2. 默认开启 CSS 变量模式（`cssVar: true`）

### 核心变化与实测收益

自 `4.3.0` 起，`<a-config-provider>` **默认开启 CSS 变量模式**（`theme.cssVar` 默认为 `true`）。

- **样式只生成一份**：组件 CSS 规则不再绑定具体主题色值，而是引用 `--ant-*` CSS 变量；多主题共存或运行时切换（亮色 / 暗黑 / 紧凑 / 品牌色）时仅更新变量声明块，无需重新编译和插入整套组件样式。
- **实测体积对比**（14 个代表性组件，1 → 3 套主题基准）：
  - **3 套主题总 CSS 体积**：降低 **50.5%**（hash 模式 `469.0 KB` → cssVar 模式 `231.9 KB`）
  - **多主题增量体积（1 → 3 套）**：降低 **86.8%**（hash 模式 `+312.1 KB` → cssVar 模式 `+41.3 KB`）
  - **单主题首次生成体积**：约 `+21.5%`（包含 `:root` 变量声明与 `calc()` 表达式，换取零开销运行时换肤能力）

### 关键破坏性避坑：`token` 与 `realToken` 的区别

> **升级必查项**：这是 `4.2.6 → 4.3.0` 最容易踩坑的行为变化！

在 `4.2.6` 的 hash 模式下，`theme.useToken()` 返回的 `token.value.borderRadius` 是数字 `6`、`token.value.padding` 是数字 `16`、`token.value.colorPrimary` 是色值 `'#1677ff'`。

在 `4.3.0` 默认开启 `cssVar: true` 后：

- **`token.value.*` 变为 CSS 变量引用字符串**，例如：
  - `token.value.borderRadius` → `'var(--ant-border-radius)'`（变量声明本身已包含 `px` 单位：`--ant-border-radius: 6px;`）
  - `token.value.padding` → `'var(--ant-padding)'`
  - `token.value.colorPrimary` → `'var(--ant-color-primary)'`
- 若你的业务代码对 `token.value.*` 进行了**字符串拼接 `px`、JS 算术运算、TinyColor 颜色解析、Canvas / SVG / ECharts 绘制**，将会产出非法 CSS（如 `var(--ant-border-radius)px`、`NaNpx`）或解析失败变黑！

#### ❌ 错误写法（在 4.3.0 默认 `cssVar: true` 下会失效）

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();

const cardStyle = computed(() => ({
  // ❌ 产出非法 CSS: "var(--ant-border-radius)px"
  borderRadius: `${token.value.borderRadius}px`,
  // ❌ 产出非法 CSS: "NaNpx"（字符串不能做乘法）
  padding: `${token.value.padding * 2}px`,
  // ❌ Canvas / ECharts / TinyColor 无法解析 "var(--ant-color-primary)"
  '--chart-color': token.value.colorPrimary,
}));
</script>
```

#### ✅ 正确写法（直接赋 CSS 属性，或解构 `realToken`）

`4.3.0` 的 `theme.useToken()` 新增返回 **`realToken`**（未做 CSS 变量替换的原始真实数值与色值对象）：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token, realToken } = theme.useToken();

// 方式 A：CSS 样式中直接使用 token（已含单位，并支持 CSS calc() 动态响应换肤）
const cardStyle = computed(() => ({
  color: token.value.colorText,
  backgroundColor: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius, // "var(--ant-border-radius)"
  padding: `calc(${token.value.padding} * 2)`, // "calc(var(--ant-padding) * 2)"
}));

// 方式 B：JS 数值计算、拼接 px、颜色运算、Canvas / SVG / ECharts 使用 realToken
const canvasConfig = computed(() => ({
  radiusPx: `${realToken.value.borderRadius}px`, // "6px"
  doublePadding: realToken.value.padding * 2, // 32
  strokeColor: realToken.value.colorPrimary, // "#1677ff"
}));
</script>
```

> **快速排查技巧**：在项目中全局搜索 `${token.` 或 `token.value.` 参与 `*` / `+` / `-` / `/` 运算的位置，按上述两种方式改造即可。

### 回退到旧版 hash 模式（临时兼容方案）

如果你的应用是单主题、暂不换肤，或需要渐进式排查旧代码中的 `token` 数值拼接，可在根节点显式关闭 CSS 变量模式：

```vue
<template>
  <a-config-provider :theme="{ cssVar: false }">
    <App />
  </a-config-provider>
</template>
```

### 零运行时静态样式提取（`zeroRuntime: true`）

对于主题固定、追求极致运行时性能与首屏渲染速度的应用，可以结合预提取静态 CSS 开启 `zeroRuntime: true`，运行时将彻底跳过 `<style>` 动态注入：

**第一步：预提取静态样式文件**

```bash
npm run static-style-extract
# 默认产出：dist/static-style/antdv.css（包含 :root CSS 变量声明与组件样式）
```

**第二步：在应用入口引入 CSS 并开启 `zeroRuntime`**

```ts
// main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '../dist/static-style/antdv.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

```vue
<!-- App.vue -->
<template>
  <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
    <RouterView />
  </a-config-provider>
</template>
```

> 若业务需要运行时动态切换暗黑模式或主题色，请保持 `zeroRuntime: false`（默认），此时 CSS 变量模式依然保证组件样式仅生成一次。更多服务端渲染与自定义提取细节请参阅 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

---

## 3. 新增组件与 `List` → `Listy` 升级指引

从 `4.2.6` 到 `4.3.0` 共新增了 **6 个组件**：

| 组件 | 引入版本 | 核心能力 | 文档链接 |
| --- | --- | --- | --- |
| `Masonry` | `4.3.0` | 瀑布流布局，支持响应式 `columns`/`gutter`、最短列分配、`ResizeObserver` 自动重排 | [Masonry](/components/masonry-cn) |
| `BorderBeam` | `4.3.0` | 基于 `offset-path` 的圆角边框流光动效，支持多光束、渐变色标、时长与偏移量配置 | [BorderBeam](/components/border-beam-cn) |
| `Listy` | `4.3.0` | 高性能虚拟列表组件，支持 `height`、自动/自定义 `itemHeight`、分组 `group`、吸顶 `sticky`、`scrollTo` | [Listy](/components/listy-cn) |
| `Splitter` | `4.2.7` / `4.3.0` | 可拖拽分隔面板，支持水平/垂直、`lazy` 拖拽、`collapsible` 折叠、`min`/`max` 约束 | [Splitter](/components/splitter-cn) |
| `ColorPicker` | `4.2.7` / `4.3.0` | 颜色选择器，支持纯色与渐变双模式、HEX/RGB/HSB 切换、透明度、预设色板与清空 | [ColorPicker](/components/color-picker-cn) |
| `Input.OTP` | `4.2.7` | 一次性验证码输入（`<a-input-otp>`），支持位数、掩码、分隔符、格式化与自动焦点跳转 | [Input](/components/input-cn) |

### 快速使用示例

#### Masonry 瀑布流

```vue
<template>
  <a-masonry :columns="{ xs: 1, sm: 2, lg: 3 }" :gutter="16" :items="items">
    <template #item="{ item }">
      <a-card :title="item.data.title">{{ item.data.desc }}</a-card>
    </template>
  </a-masonry>
</template>

<script setup lang="ts">
const items = [
  { key: '1', data: { title: '卡片 1', desc: '按最短列自动填充' } },
  { key: '2', data: { title: '卡片 2', desc: '支持响应式断点与动态重排' } },
  { key: '3', data: { title: '卡片 3', desc: '零配置即可自适应高度' } },
];
</script>
```

#### BorderBeam 边框流光

```vue
<template>
  <a-border-beam :duration="5" :color="['#1677ff', '#722ed1']">
    <a-card title="AI 推荐方案">支持多条光束与自定义圆角轨迹</a-card>
  </a-border-beam>
</template>
```

#### Splitter 分隔面板

```vue
<template>
  <a-splitter style="height: 240px">
    <a-splitter-panel default-size="40%" min="20%" max="70%" collapsible>
      <div style="padding: 16px">左侧面板</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">右侧面板</div>
    </a-splitter-panel>
  </a-splitter>
</template>
```

#### ColorPicker 颜色选择器（纯色 + 渐变）

```vue
<template>
  <a-color-picker
    v-model:value="color"
    :mode="['single', 'gradient']"
    show-text
    allow-clear
    @change-complete="val => console.log('完成选择:', val)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const color = ref('#1677ff');
</script>
```

#### Input.OTP 验证码输入

```vue
<template>
  <a-input-otp v-model:value="code" :length="6" :formatter="str => str.toUpperCase()" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const code = ref('');
</script>
```

### 从 `List` 迁移到 `Listy`

`List` 在上游已进入废弃阶段，`4.3.0` 推出全新虚拟列表组件 **`Listy`**，面向大数据量、分组列表、吸顶标题和语义化样式定制场景。

#### 核心 API 映射

| 能力 | 旧 `List` | 新 `Listy` | 说明 |
| --- | --- | --- | --- |
| 数据源 | `dataSource` | `items` | 旧别名 `data` 已废弃（仍兼容并触发开发告警） |
| 唯一标识 | `rowKey` | `rowKey` | 旧别名 `itemKey` 已废弃（仍兼容并触发开发告警） |
| 项渲染 | `#renderItem="{ item, index }"` | `#item="{ item, index }"` 或 `:item-render` | 更简洁的作用域插槽 |
| 虚拟滚动 | 需自行集成三方库 | `:height="360"` + `virtual`（`itemHeight` 可选自动计算） | 原生内置虚拟滚动与 `scrollWidth` 横向滚动 |
| 分组与吸顶 | 不支持 | `:group="{ key, title }"` + `sticky` | 支持 `#groupTitle="{ groupKey, items }"` |
| 命令式滚动 | 不支持 | `ref.scrollTo(number \| { top, left } \| { index, align, offset } \| { key, align, offset } \| { groupKey, align, offset })` | 同时提供 `ref.scrollToIndex(index)` |
| 语义化样式 | 有限支持 | `classNames` / `styles`（支持对象与函数） | 支持 `root`、`item`、`groupHeader`、`groupSection`、`holder`、`scrollbar` |

#### Before（`List`）→ After（`Listy`）

```vue
<!-- ❌ Before: 旧 List -->
<template>
  <a-list :data-source="users" row-key="id">
    <template #renderItem="{ item }">
      <a-list-item>{{ item.name }}（{{ item.role }}）</a-list-item>
    </template>
  </a-list>
</template>
```

```vue
<!-- ✅ After: 4.3.0 Listy（支持虚拟滚动、分组吸顶与精确 scrollTo） -->
<template>
  <a-space direction="vertical" style="width: 100%">
    <a-button @click="listyRef?.scrollTo({ index: 50, align: 'top' })">滚动到第 51 项</a-button>
    <a-listy
      ref="listyRef"
      :items="users"
      row-key="id"
      :height="320"
      virtual
      sticky
      :group="{ key: 'role', title: role => `角色：${role}` }"
    >
      <template #item="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </a-listy>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ListyRef } from 'ant-design-vue';

const listyRef = ref<ListyRef>();
const users = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  role: i % 2 === 0 ? '研发' : '设计',
}));
</script>
```

---

## 4. `ConfigProvider` 统一组件默认配置（72 项组件配置）

`4.3.0` 将 `ConfigProvider` 的组件级默认配置扩展至全量 **72 项组件配置**（涵盖 `button`、`card`、`empty`、`space`、`pagination`、`input`、`select`、`table`、`modal`、`drawer`、`tabs`、`divider`、`listy`、`masonry`、`splitter`、`colorPicker`、`borderBeam` 等），并新增全局 `variant`、`popupMatchSelectWidth`、`popupOverflow`、`holderRender`、`componentDisabled` 与 `warning` 配置。

```vue
<template>
  <a-config-provider
    variant="filled"
    :popup-match-select-width="false"
    popup-overflow="viewport"
    :button="{ autoInsertSpace: false, className: 'app-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :empty="{ image: Empty.PRESENTED_IMAGE_SIMPLE }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :holder-render="holderRender"
  >
    <a-app>
      <RouterView />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { ConfigProvider, Empty } from 'ant-design-vue';

// 为 message / notification / Modal 静态方法自定义上下文包裹
const holderRender = (children: any) => h(ConfigProvider, { prefixCls: 'ant' }, () => children);
</script>
```

完整 72 项组件配置清单请查阅 [ConfigProvider 文档](/components/config-provider-cn) 与 [通用属性](/docs/vue/common-props-cn)。

---

## 5. API 升级与废弃属性映射表

下列旧属性在 `4.3.0` 中均保留向下兼容（部分会在开发环境打印弃用提示），建议按对照表逐步迁移至现代 API：

| 涉及组件 | 旧属性 / 用法（Deprecated） | 新属性 / 推荐用法（4.3.0） | 说明 |
| --- | --- | --- | --- |
| Modal / Drawer / Tooltip / Popover / Dropdown / Popconfirm / Image | `v-model:visible` / `:visible` | `v-model:open` / `:open` | 全站弹层可见性统一为 `open` |
| Input / InputNumber / Select / Cascader / TreeSelect / Mentions / AutoComplete / DatePicker / TimePicker / Card | `:bordered="false"` | `variant="borderless"`（输入框类支持 `outlined` / `filled` / `borderless` / `underlined`；Card 支持 `outlined` / `borderless`） | 支持在 `ConfigProvider` 全局配置 `variant` |
| Select / TreeSelect / Cascader / AutoComplete / Dropdown | `dropdownRender` | `popupRender` | **参数变更**：`popupRender` 直接接收 `menuNode`（`(menuNode) => VNode`），不再包裹对象 `{ menuNode }` |
| Select / TreeSelect / Cascader / AutoComplete / DatePicker / Mentions | `dropdownClassName` | `popupClassName`（或 `classNames.popup.root`） | 语义化样式推荐优先使用 `classNames.popup.root` |
| Select / TreeSelect / Cascader / AutoComplete / ConfigProvider | `dropdownMatchSelectWidth` | `popupMatchSelectWidth` | 下拉菜单宽度匹配配置 |
| Modal / Drawer / Tabs / Dropdown / Tooltip / Collapse | `destroyOnClose` / `destroyInactiveTabPane` / `destroyPopupOnHide` / `destroyTooltipOnHide` / `destroyInactivePanel` | `destroyOnHidden` | 统一隐藏后销毁属性 |
| Modal / Drawer / Card / Descriptions / Empty / Slider / Tooltip | `bodyStyle` / `headStyle` / `headerStyle` / `footerStyle` / `maskStyle` / `imageStyle` | `styles`（如 `styles.body` / `styles.header` / `styles.mask`） | 配合 `classNames` 构成统一语义化定制接口 |
| Slider | `@after-change` / `onAfterChange` | `@change-complete` / `onChangeComplete` | 拖拽或键盘结束时触发 |
| Button | `type` + `danger` / `ghost` | `variant`（`outlined`/`dashed`/`solid`/`filled`/`text`/`link`）+ `color`（`default`/`primary`/`danger` 及 **13 种预设色**）+ `iconPosition` | 13 种预设色：`blue`/`purple`/`cyan`/`green`/`magenta`/`pink`/`red`/`orange`/`yellow`/`volcano`/`geekblue`/`lime`/`gold` |
| Divider | `dashed` | `variant`（`solid` / `dashed` / `dotted`）+ `size`（`small` / `middle` / `medium` / `large`）+ `orientation`（支持 `start` / `end`） | 兼容 RTL 方向与点线样式 |
| Avatar.Group | `maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger` | `:max="{ count, style, popover }"` | 聚合配置，兼容旧 `number` 写法 |
| Progress | `strokeLinecap="round"` / 百分比位置定制 | `rounding` + `:percent-position="{ align: 'start' \| 'center' \| 'end', type: 'inner' \| 'outer' }"` | 支持进度条内显百分比文本 |
| Tabs | `<a-tab-pane>` / `indicatorSize` | `:items="tabItems"` + `:indicator="{ size, align }"` + `destroyOnHidden` | 数据驱动配置与自定义指示条对齐/宽度 |
| Table | 大数据量普通渲染 / 筛选控制 | `virtual`（配合 `:scroll="{ y: 360 }"`) + `Column.sortIcon` + `filterOnClose` + `filterDropdownProps` | 内置虚拟滚动与细粒度排序/筛选定制 |
| Notification | `btn` | `actions` + `showProgress` + `pauseOnHover` | 支持倒计时进度条与悬停暂停 |
| Alert | 自定义右侧按钮区域 | `action` 属性 / `#action` 插槽 | 标准化操作区布局 |
| BackTop | 独立 `<a-back-top>` | `<a-float-button-back-top>`（`FloatButton.BackTop`） | 独立 `BackTop` 标记为废弃，推荐使用 `FloatButton.BackTop` |

### 常见 API 迁移前后对比示例

#### 1. 表单 `variant`、`popupRender` 与 `popupMatchSelectWidth`

```vue
<!-- ❌ Before -->
<template>
  <a-input :bordered="false" placeholder="无边框" />
  <a-select
    :bordered="false"
    dropdown-class-name="custom-dropdown"
    :dropdown-match-select-width="false"
    :dropdown-render="({ menuNode }) => h('div', { class: 'wrap' }, [menuNode])"
    :options="options"
  />
</template>
```

```vue
<!-- ✅ After -->
<template>
  <a-input variant="borderless" placeholder="无边框" />
  <a-input variant="filled" placeholder="填充形态" />
  <a-input variant="underlined" placeholder="下划线形态" />

  <a-select
    variant="filled"
    popup-class-name="custom-dropdown"
    :popup-match-select-width="false"
    :popup-render="menuNode => h('div', { class: 'wrap' }, [menuNode])"
    :options="options"
  />
</template>
```

#### 2. `Modal` / `Card` 语义化 `styles` 与 `destroyOnHidden`

```vue
<!-- ❌ Before -->
<template>
  <a-card :bordered="false" :head-style="{ color: '#1677ff' }" :body-style="{ padding: '16px' }" />
  <a-modal v-model:visible="open" destroy-on-close :body-style="{ padding: '24px' }" />
</template>
```

```vue
<!-- ✅ After -->
<template>
  <a-card
    variant="borderless"
    :styles="{ header: { color: '#1677ff' }, body: { padding: '16px' } }"
  />
  <a-modal v-model:open="open" destroy-on-hidden :styles="{ body: { padding: '24px' } }" />
</template>
```

#### 3. `Button` 颜色与形态组合、`Divider`、`Avatar.Group`、`Progress`、`Tabs`、`Notification`

```vue
<template>
  <!-- Button: color（含 13 预设色）+ variant -->
  <a-space wrap>
    <a-button color="purple" variant="solid">Purple Solid</a-button>
    <a-button color="cyan" variant="filled">Cyan Filled</a-button>
    <a-button color="danger" variant="outlined">Danger Outlined</a-button>
  </a-space>

  <!-- Divider: variant + size + start/end -->
  <a-divider variant="dotted" size="small" orientation="start">分组标题</a-divider>

  <!-- Avatar.Group: max 对象 -->
  <a-avatar-group
    :max="{
      count: 2,
      style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      popover: { trigger: 'click' },
    }"
  >
    <a-avatar>A</a-avatar>
    <a-avatar>B</a-avatar>
    <a-avatar>C</a-avatar>
  </a-avatar-group>

  <!-- Progress: percentPosition 对象 -->
  <a-progress
    :percent="68"
    :size="['100%', 20]"
    :percent-position="{ align: 'center', type: 'inner' }"
  />

  <!-- Tabs: items + indicator -->
  <a-tabs
    :items="tabItems"
    :indicator="{ size: origin => origin - 20, align: 'center' }"
    destroy-on-hidden
  />

  <!-- Slider: onChangeComplete -->
  <a-slider v-model:value="sliderVal" @change-complete="onDone" />

  <!-- Table: virtual 虚拟滚动 + filterOnClose -->
  <a-table
    virtual
    :scroll="{ y: 360 }"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
  />

  <!-- Alert: action 插槽 -->
  <a-alert message="检测到新版本 4.3.0" type="info" show-icon>
    <template #action>
      <a-button size="small" type="primary">立即查看</a-button>
    </template>
  </a-alert>

  <!-- FloatButton.BackTop 替代废弃的 BackTop -->
  <a-float-button-back-top :visibility-height="300" />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { App, Button } from 'ant-design-vue';

const sliderVal = ref(30);
const onDone = (val: number) => console.log('Slider complete:', val);

const tabItems = [
  { key: '1', label: '概览', children: '概览内容' },
  { key: '2', label: '配置', children: '配置内容' },
];

// Notification: showProgress + pauseOnHover + actions
const { notification } = App.useApp();
const openNotice = () => {
  notification.open({
    message: '构建完成',
    description: '已启用 4.3.0 CSS 变量模式。',
    showProgress: true,
    pauseOnHover: true,
    actions: h(Button, { type: 'primary', size: 'small' }, () => '查看报告'),
  });
};
</script>
```

---

## 6. 升级验证清单与常见问题

### 升级后自检清单

1. **检查 `theme.useToken()` 用法**：全局搜索 `${token.` 或对 `token.value.*` 做数学运算 / 传给 Canvas / ECharts 的代码，改为直接传 `token.value.*` 给 CSS，或改用 `realToken.value.*`。
2. **检查 `popupRender` 参数**：从 `dropdownRender` 迁移至 `popupRender` 时，确认回调函数第一个参数已改为直接接收 `menuNode`。
3. **检查弹层控制属性**：确认 `Modal`/`Drawer`/`Tooltip`/`Popover`/`Dropdown` 已使用 `v-model:open`，不再遗留 `v-model:visible`。
4. **检查控制台警告**：在开发模式打开核心页面，清理 `Listy`（`data`→`items`、`itemKey`→`rowKey`）、`Select`（`dropdownClassName`→`popupClassName`）等废弃提示。
5. **检查样式优先级与 SSR**：若接入了 TailwindCSS v4 或 Nuxt 3 / Vite SSR，请按下方常见问题完成校验。

### 升级常见问题

#### 1. TailwindCSS v4 样式冲突怎么处理？

TailwindCSS v4 使用原生 CSS `@layer`（`theme`, `base`, `components`, `utilities`），而 `ant-design-vue` 默认使用 `:where(.css-xxx)` 降权选择器。如果你引入了 `ant-design-vue/dist/reset.css` 或预提取的 `antdv.css`，请显式声明 `@layer` 顺序，避免 Tailwind Preflight 与 Ant Design Vue 互相覆盖：

```css
/* src/assets/main.css */
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
@import 'ant-design-vue/dist/reset.css' layer(base);
/* 若使用 zeroRuntime 预提取静态样式，可将其放入 antd 层： */
/* @import './antdv.css' layer(antd); */
```

若发现 Tailwind 的原子类覆盖了组件基础样式（例如按钮背景透明），还可在根组件包裹 `<a-style-provider hash-priority="high">` 提升组件选择器权重。详情见 [样式兼容](/docs/vue/compatible-style-cn)。

#### 2. Nuxt 3 / Vite SSR 如何避免首屏闪烁（FOUC）？

在 `4.3.0` 默认开启 `cssVar: true` 后，服务端渲染除了调用 `extractStyle(cache)` 提取组件规则外，还需一并调用 `extractCSSVarStyle()` 提取 `:root` CSS 变量声明，确保首屏 HTML 立即拥有完整主题变量：

```ts
import { createCache, extractStyle, extractCSSVarStyle, clearCSSVarRegistry } from 'ant-design-vue';

// 每次 SSR 请求或预构建提取后：
const componentCss = extractStyle(cache);
const cssVarCss = `<style data-antdv-cssvar>${extractCSSVarStyle()}</style>`;
// 一起注入到 HTML <head> 中
```

完整 Nuxt 3 与 Vite SSR 实战代码请查阅 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

#### 3. 嵌套 `ConfigProvider` 局部主题会不会污染全局 `:root`？

**不会。** 在 `4.3.0` 中，顶层 `<a-config-provider>` 使用 `:root` CSS 变量模式以获得最佳全局换肤性能；当你在页面内部嵌套子级 `<a-config-provider>` 并设置了局部 `token`、`components` 或 `algorithm` 时，`ant-design-vue` 会**自动为该子树降级隔离为作用域 hash 模式**，防止子主题的变量声明覆盖外层 `:root`。

> 注意：如果嵌套 `<a-config-provider :theme="{ inherit: false }">` 想重置为默认主题而不传 `token`/`algorithm`，建议显式加上 `cssVar: false`（即 `:theme="{ inherit: false, cssVar: false }"`），确保其样式作用域完全隔离。
