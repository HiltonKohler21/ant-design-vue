# 从 4.2.6 升级到 4.3.0

本手册将帮助你从 `ant-design-vue@4.2.6` 平滑升级到 `@hiltonkohler21/ant-design-vue@4.3.0`（覆盖 `4.2.7` 与 `4.3.0` 全部演进，全面对齐 `antd@6.7.2`）。`4.3.0` 完整落地了 Ant Design v6 性能层（**默认开启原生 CSS Variables** 与**零运行时静态样式提取**），新增 **6 个顶级组件** 与 **6 个高频子组件**，在 **61 个组件**上统一了**函数式语义化 DOM（`classNames`/`styles`）**，接入全部 **72 项 `ConfigProvider` 组件默认配置**，同步 **74 套国际化语言包**，将 **Component Design Tokens 扩展至 317+ 项**，并全面完成向下兼容的 v6 API 升级。

> 如果你是从 `3.x` 升级，请先阅读 [从 V3 到 V4 升级指南](/docs/vue/migration-v4-cn)。

## 兼容性保障

从 `4.2.6` 升级到 `4.3.0` 坚持**渐进迁移、低风险上线**原则：

- **组件 API 100% 向下兼容**：所有已标记废弃的旧属性（`visible`、`bordered`、`dropdownRender`、`dropdownClassName`、`dropdownMatchSelectWidth`、`destroyOnClose`、`bodyStyle`/`headStyle`/`maskStyle`、`Divider.type`、`Alert.message`/`closeText`/`closeIcon`、`Tag.bordered`、`Image.preview.visible`、`Slider.tooltipOpen`/`tipFormatter`/`onAfterChange`、`Space.direction`/`split`、`Steps.direction`/`labelPlacement`、`Tabs.tabPosition`、`Carousel.dotPosition`、`Collapse.expandIconPosition`、`Spin.tip`、`Transfer.operations`、`Listy.data`/`itemKey` 等）在 `4.3.0` 中均**完整保留并正常运行**（部分仅在开发环境输出弃用提示），你可以先升级依赖、再分模块逐步迁移至新 API。
- **唯一需要关注的行为变化 —— 默认开启 `cssVar: true`**：`4.3.0` 默认启用 CSS 变量模式后，`theme.useToken()` 返回的 `token` 值由原始数字/色值变为 CSS 变量引用（`var(--ant-*)`）。JS 数值计算、Canvas、SVG 或图表场景请解构使用 `realToken`；若需零改造平滑过渡，只需在根 `<a-config-provider>` 上添加 `:theme="{ cssVar: false }"` 即可**一行回退**至旧版 hash 模式。

---

## 1. 升级准备与依赖安装

### 环境要求

- **Vue**：`>= 3.2.0`（推荐 `3.4+` 或 `3.5+`）
- **TypeScript**：`>= 4.9`（推荐 `5.x`）
- **Node.js**：`>= 18`
- **浏览器**：最近 2 个版本的现代浏览器（默认启用原生 CSS Variables 与 `calc()`；如需兼容旧版浏览器，请参考 [样式兼容](/docs/vue/compatible-style-cn)）

### 升级命令

使用你偏好的包管理器将 `@hiltonkohler21/ant-design-vue` 升级至 `4.3.0`：

```bash
# npm
npm install @hiltonkohler21/ant-design-vue@4.3.0

# yarn
yarn add @hiltonkohler21/ant-design-vue@4.3.0

# pnpm
pnpm add @hiltonkohler21/ant-design-vue@4.3.0
```

如项目中使用了图标库，建议同步更新 `@ant-design/icons-vue` 至最新 7.x 版本：

```bash
npm install @ant-design/icons-vue@latest
```

使用 Vite 构建？请参阅 [在 Vite 中使用](/docs/vue/use-with-vite-cn) 获取推荐配置与样式优化建议。

---

## 2. 默认开启 CSS 变量模式（`cssVar: true`）

### 核心变化与实测收益

自 `4.3.0` 起，`<a-config-provider>` **默认开启 CSS 变量模式**（`theme.cssVar` 默认为 `true`）。

- **样式只生成一份**：组件 CSS 规则不再绑定具体主题色值，而是引用 `--ant-*` CSS 变量；多主题共存或运行时切换（亮色 / 暗黑 / 紧凑 / 品牌色）时仅更新变量声明块，无需重新编译和插入整套组件样式。
- **实测体积对比**（14 个代表性组件，1 → 3 套主题基准）：
  - **3 套主题总 CSS 体积**：降低 **50.5%**（hash 模式 `469.0 KB` → cssVar 模式 `231.9 KB`）
  - **多主题增量体积（1 → 3 套）**：降低 **86.8%**（hash 模式 `+312.1 KB` → cssVar 模式 `+41.3 KB`）
  - **单主题首次生成体积**：约 `+21.5%`（包含 `:root` 变量声明与 `calc()` 表达式，换取零开销运行时换肤能力）

### 关键避坑项：`token` 与 `realToken` 的区别

> **上线前必查**：这是 `4.2.6 → 4.3.0` 最需要重点排查的行为变化。

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
import { theme } from '@hiltonkohler21/ant-design-vue';

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
import { theme } from '@hiltonkohler21/ant-design-vue';

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

### 一键回退到旧版 hash 模式（即时兼容方案）

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
import Antd from '@hiltonkohler21/ant-design-vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
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

## 3. 新增组件、新增子组件与 `List` → `Listy` 升级指引

### 6 个新增顶级组件

| 组件 | 引入版本 | 核心能力 | 文档链接 |
| --- | --- | --- | --- |
| `Masonry` | `4.3.0` | 瀑布流布局，支持响应式 `columns`/`gutter`、最短列分配、图片加载重排、`fresh`、`MasonryRef` 与函数式 `classNames`/`styles` | [Masonry](/components/masonry-cn) |
| `BorderBeam` | `4.3.0` | 基于 `offset-path` 的圆角边框流光动效，支持多光束 `items`、渐变 `color`、`duration`、`lineWidth`、`outset`、`size` | [BorderBeam](/components/border-beam-cn) |
| `Listy` | `4.3.0` | 高性能虚拟列表，支持 `items`、`rowKey`、分组 `group`、吸顶 `sticky`、`scrollWidth`、自动 `itemHeight`、多维 `scrollTo` 与函数式语义样式 | [Listy](/components/listy-cn) |
| `Splitter` | `4.2.7` / `4.3.0` | 可拖拽分隔面板，支持 `orientation`（水平/垂直）、`lazy`、`collapsible`/`collapsibleIcon`、`draggerIcon`、`onDraggerDoubleClick`、`min`/`max` | [Splitter](/components/splitter-cn) |
| `ColorPicker` | `4.2.7` / `4.3.0` | 颜色选择器，支持纯色与渐变双模式、HEX/RGB/HSB 切换、透明度、预设色板、`allowClear` 与 `onChangeComplete` | [ColorPicker](/components/color-picker-cn) |
| `Input.OTP` | `4.2.7` | 一次性验证码输入（`<a-input-otp>`），支持位数、掩码、分隔符、格式化与自动焦点跳转 | [Input](/components/input-cn) |

### 6 个新增子组件 + `Image.PreviewGroup.items`

| 子组件 | 全局注册标签 | 核心能力 | 文档链接 |
| --- | --- | --- | --- |
| `Alert.ErrorBoundary` | `<a-alert-error-boundary>` | 基于 Vue 3 `onErrorCaptured` 的错误边界组件，自动捕获子树异常并渲染错误 `Alert`（支持 `title`/`description` 属性与插槽） | [Alert](/components/alert-cn) |
| `Tag.CheckableTagGroup` | `<a-checkable-tag-group>` | 可选标签组，支持 `options`、`multiple` 单选/多选、`v-model:value`、`disabled` 与语义化 `classNames`/`styles` | [Tag](/components/tag-cn) |
| `Cascader.Panel` | `<a-cascader-panel>` | 内联级联选择面板（无下拉弹层），支持单选/多选、`changeOnSelect`、`loadData`、`v-model:value` | [Cascader](/components/cascader-cn) |
| `Statistic.Timer` | `<a-statistic-timer>` | 统一计时器组件，支持 `type: 'countdown' \| 'countup'`（倒计时 / 正计时）、`value`、`format`、`onFinish`、`onChange` | [Statistic](/components/statistic-cn) |
| `Space.Addon` | `<a-space-addon>` | 紧凑布局前后置装饰容器（配合 `<a-space-compact>`），支持 `variant`、`status`、`disabled`、`size` | [Space](/components/space-cn) |
| `Tooltip.UniqueProvider` | `<a-tooltip-unique-provider>` | 共享平滑过渡上下文，让同组多个 `<a-tooltip>` 切换时实现无缝位置过渡 | [Tooltip](/components/tooltip-cn) |
| `Image.PreviewGroup.items` | `<a-image-preview-group>` | 配置式图库数组（`string \| { src, alt?, ... }`），支持 `countRender`、`actionsRender`、`imageRender` 与 `mask` 模糊遮罩 | [Image](/components/image-cn) |

### 快速使用示例（新增顶级组件）

#### Masonry 瀑布流

```vue
<template>
  <a-masonry ref="masonryRef" :columns="{ xs: 1, sm: 2, lg: 3 }" :gutter="16" :items="items">
    <template #item="{ item }">
      <a-card :title="item.data.title">{{ item.data.desc }}</a-card>
    </template>
  </a-masonry>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MasonryRef } from '@hiltonkohler21/ant-design-vue';

const masonryRef = ref<MasonryRef>();
const items = [
  { key: '1', data: { title: '卡片 1', desc: '按最短列自动填充' } },
  { key: '2', data: { title: '卡片 2', desc: '支持响应式断点与图片加载自动重排' } },
  { key: '3', data: { title: '卡片 3', desc: '支持函数式语义 classNames 与 styles' } },
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
  <a-splitter orientation="horizontal" style="height: 240px" @dragger-double-click="resetSizes">
    <a-splitter-panel v-model:size="sizes[0]" min="20%" max="70%" collapsible>
      <div style="padding: 16px">左侧面板</div>
    </a-splitter-panel>
    <a-splitter-panel v-model:size="sizes[1]">
      <div style="padding: 16px">右侧面板</div>
    </a-splitter-panel>
  </a-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sizes = ref<(number | string)[]>(['40%', '60%']);
const resetSizes = () => {
  sizes.value = ['50%', '50%'];
};
</script>
```

#### ColorPicker 颜色选择器 & Input.OTP 验证码输入

```vue
<template>
  <a-space orientation="vertical" :size="16">
    <a-color-picker
      v-model:value="color"
      :mode="['single', 'gradient']"
      show-text
      allow-clear
      @change-complete="val => console.log('完成选择:', val)"
    />
    <a-input-otp v-model:value="code" :length="6" :formatter="str => str.toUpperCase()" />
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const color = ref('#1677ff');
const code = ref('');
</script>
```

### 快速使用示例（6 个新增子组件 & `Image.PreviewGroup.items`）

```vue
<template>
  <a-space orientation="vertical" :size="20" style="width: 100%">
    <!-- 1. Alert.ErrorBoundary -->
    <a-alert-error-boundary title="组件渲染异常">
      <RiskyChildComponent />
    </a-alert-error-boundary>

    <!-- 2. Tag.CheckableTagGroup -->
    <a-checkable-tag-group v-model:value="selectedTags" multiple :options="tagOptions" />

    <!-- 3. Cascader.Panel -->
    <a-cascader-panel v-model:value="regionPath" :options="regionOptions" />

    <!-- 4. Statistic.Timer（倒计时与正计时） -->
    <a-space :size="32">
      <a-statistic-timer type="countdown" title="距离发布" :value="deadline" />
      <a-statistic-timer type="countup" title="已运行时长" :value="startTime" />
    </a-space>

    <!-- 5. Space.Addon -->
    <a-space-compact>
      <a-space-addon>https://</a-space-addon>
      <a-input v-model:value="domain" placeholder="hiltonkohler21.github.io/ant-design-vue" />
      <a-space-addon>.com</a-space-addon>
    </a-space-compact>

    <!-- 6. Tooltip.UniqueProvider -->
    <a-tooltip-unique-provider>
      <a-space>
        <a-tooltip title="快捷操作 A"><a-button>操作 A</a-button></a-tooltip>
        <a-tooltip title="快捷操作 B"><a-button>操作 B</a-button></a-tooltip>
      </a-space>
    </a-tooltip-unique-provider>

    <!-- 7. Image.PreviewGroup.items -->
    <a-image-preview-group
      :items="[
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
      ]"
      :preview="{ mask: { blur: true } }"
    >
      <a-image
        :width="120"
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
    </a-image-preview-group>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTags = ref<string[]>(['Vue 3']);
const tagOptions = ['Vue 3', 'TypeScript', 'CSS 变量', '零运行时'];

const regionPath = ref<(string | number)[]>(['zhejiang', 'hangzhou']);
const regionOptions = [
  { value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州' }] },
];

const deadline = Date.now() + 1000 * 60 * 60;
const startTime = Date.now() - 1000 * 60 * 5;
const domain = ref('');
</script>
```

### 从 `List` 迁移到 `Listy`

`List` 在上游已进入废弃阶段，`4.3.0` 推出全新虚拟列表组件 **`Listy`**，内置分组吸顶、横向滚动（`scrollWidth`）、像素/索引/键值/分组命令式 `scrollTo` 与函数式语义化样式定制。

#### 核心 API 映射

| 能力 | 旧 `List` | 新 `Listy` | 说明 |
| --- | --- | --- | --- |
| 数据源 | `dataSource` | `items` | 旧别名 `data` 已废弃（仍兼容并触发开发告警） |
| 唯一标识 | `rowKey` | `rowKey` | 旧别名 `itemKey` 已废弃（仍兼容并触发开发告警） |
| 项渲染 | `#renderItem="{ item, index }"` | `#item="{ item, index }"` 或 `:item-render` | 更简洁的作用域插槽 |
| 虚拟滚动与横向滚动 | 需自行集成三方库 | `:height="360"` + `virtual`（`itemHeight` 可选自动计算）+ `scrollWidth` | 原生内置虚拟滚动与横向溢出滚动 |
| 分组与吸顶 | 不支持 | `:group="{ key, title }"` + `sticky` | 支持 `#groupTitle="{ groupKey, items }"` |
| 命令式滚动 | 不支持 | `ref.scrollTo(number \| { top, left } \| { index, align, offset } \| { key, align, offset } \| { groupKey, align, offset })` | 同时提供 `ref.scrollToIndex(index)` |
| 语义化样式 | 有限支持 | `classNames` / `styles`（支持静态对象与函数） | 支持 `root`、`item`、`groupHeader`、`groupSection`、`holder`、`scrollbar` |

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
<!-- ✅ After: 4.3.0 Listy（虚拟滚动、分组吸顶、横向滚动与精确 scrollTo） -->
<template>
  <a-space orientation="vertical" style="width: 100%">
    <a-space>
      <a-button @click="listyRef?.scrollTo({ index: 50, align: 'top' })">滚动到第 51 项</a-button>
      <a-button @click="listyRef?.scrollTo({ top: 0, left: 0 })">返回顶部</a-button>
    </a-space>
    <a-listy
      ref="listyRef"
      :items="users"
      row-key="id"
      :height="320"
      :scroll-width="640"
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
import type { ListyRef } from '@hiltonkohler21/ant-design-vue';

const listyRef = ref<ListyRef>();
const users = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  role: i % 2 === 0 ? '研发' : '设计',
}));
</script>
```

---

## 4. 语义化 DOM、72 项 `ConfigProvider` 配置与 317+ 组件 Design Token

### 函数式语义化 DOM（`classNames` / `styles`）

`4.3.0` 在全库 **61 个组件**上统一提供语义化 `classNames` 与 `styles`（覆盖表单录入、浮层弹框、数据展示、导航布局与反馈提示全品类），既支持**静态对象**，也支持根据组件属性动态计算的**函数式写法** `({ props }) => ({ ... })`；同时在全部 61 个对应组件文档页上线了交互式 **`语义化 DOM`（`#semantic-dom`）可视化预览器**：

```vue
<template>
  <a-alert
    title="4.3.0 已就绪"
    description="语义化 styles 支持根据当前 props 动态返回内联样式。"
    type="info"
    variant="filled"
    show-icon
    :styles="
      ({ props }) => ({
        root: { borderRadius: '10px' },
        title: { fontWeight: props.variant === 'filled' ? 600 : 500 },
      })
    "
  />
</template>
```

全部 61 个组件的语义位清单请参阅 [通用属性](/docs/vue/common-props-cn)。

### `ConfigProvider` 统一组件默认配置（72 项组件配置）

`4.3.0` 将 `ConfigProvider` 的组件级默认配置扩展至全量 **72 项组件配置**（涵盖 `alert`、`button`、`card`、`divider`、`drawer`、`empty`、`form`、`image`、`input`、`listy`、`masonry`、`modal`、`pagination`、`select`、`space`、`splitter`、`table`、`tabs`、`tag`、`timeline`、`colorPicker`、`borderBeam` 等），并新增全局 `variant`、`popupMatchSelectWidth`、`popupOverflow`、`holderRender`、`componentDisabled` 与 `warning` 配置：

```vue
<template>
  <a-config-provider
    variant="filled"
    :popup-match-select-width="false"
    popup-overflow="viewport"
    :button="{ autoInsertSpace: false, className: 'app-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :alert="{ variant: 'filled' }"
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
import { ConfigProvider, Empty } from '@hiltonkohler21/ant-design-vue';

// 为 message / notification / Modal 静态方法自定义上下文包裹
const holderRender = (children: any) => h(ConfigProvider, { prefixCls: 'ant' }, () => children);
</script>
```

### 317+ 组件 Design Token

`4.3.0` 将运行时组件 Design Token 从 `112` 项大幅扩展至 **317+ 项**（`token-meta.json` 共收录 **61 个组件、341 项**带完整中英文注释的组件 Token，且 `ComponentTokenMap` 全部补齐强类型定义）。各组件文档页的 `#design-tokens` 表格现已支持中英文说明、实时搜索过滤、一键复制 Token 名称与 `@since` 版本标签：

```vue
<template>
  <a-config-provider
    :theme="{
      components: {
        Button: { fontWeight: 600, primaryShadow: '0 4px 12px rgba(22, 119, 255, 0.25)' },
        Alert: { defaultPadding: '10px 14px' },
        Tag: { defaultBg: '#f5f7fa', solidTextColor: '#ffffff' },
        Form: { itemMarginBottom: 18, labelFontSize: 14 },
        Table: { headerBg: '#fafafa', rowHoverBg: '#f0f7ff' },
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
```

---

## 5. 向下兼容的 v6 API 升级与属性映射表

下列旧属性在 `4.3.0` 中**100% 保持向下兼容**，可按业务节奏分批迁移至推荐的现代 API：

| 涉及组件 | `4.2.6` 旧属性（仍兼容） | `4.3.0` 推荐 API | 说明 |
| --- | --- | --- | --- |
| Modal / Drawer / Tooltip / Popover / Dropdown / Popconfirm / Image | `v-model:visible` / `:visible` | `v-model:open` / `:open` | 全站弹层可见性统一为 `open`（`Image` 为 `preview.open` / `onOpenChange`） |
| Modal / Drawer / Tabs / Dropdown / Tooltip / Collapse / Splitter.Panel | `destroyOnClose` / `destroyInactiveTabPane` / `destroyPopupOnHide` / `destroyTooltipOnHide` / `destroyInactivePanel` | `destroyOnHidden` | 统一隐藏后卸载子节点属性 |
| Modal / Drawer / Card / Descriptions / Empty / Slider / Tooltip / Alert / Tag / Image / Divider | `bodyStyle` / `headStyle` / `headerStyle` / `footerStyle` / `maskStyle` / `imageStyle` / `wrapperStyle` / `orientationMargin` | `styles` + `classNames`（静态对象或 `({ props }) => ...`） | 统一语义化 DOM 定制能力 |
| Input / InputNumber / Select / Cascader / TreeSelect / Mentions / AutoComplete / DatePicker / TimePicker / Card / Form | `:bordered="false"` | `variant="borderless"`（输入框支持 `outlined` / `filled` / `borderless` / `underlined`；`Card` 支持 `outlined` / `borderless`） | 支持由 `<a-form variant="...">` 或 `<a-config-provider variant="...">` 向下继承 |
| Select / TreeSelect / Cascader / AutoComplete / Dropdown | `dropdownRender` / `dropdownClassName` / `dropdownMatchSelectWidth` | `popupRender` / `popupClassName`（或 `classNames.popup.root`） / `popupMatchSelectWidth` | **参数变更**：`popupRender` 直接接收 `menuNode`（`(menuNode) => VNode`）；新增 `suffix` 别名与 `Select.loadingIcon` |
| Divider | `type="vertical"` / `orientation="left"` / `dashed` | `orientation="vertical"`（或 `vertical`） / `titlePlacement="start"` / `variant="solid" \| "dashed" \| "dotted"` + `size` | 兼容 RTL 方向与语义位 `rail`/`content` |
| Alert | `message` / `closeText` / `closeIcon` / `afterClose` | `title` / `:closable="{ closeIcon, disabled, afterClose, onClose }"` + `variant="filled"` + `action` + `Alert.ErrorBoundary` | `message` 保留自动兜底 |
| Tag | `:bordered="false"` / `closeIcon` | `variant="filled" \| "solid" \| "outlined"` / `:closable="{ closeIcon, disabled }"` + `disabled` + `href`/`target` + `Tag.CheckableTagGroup` | `CheckableTag` 同步新增 `icon` 与 `disabled` |
| Image | `preview.visible` / `onVisibleChange` / `toolbarRender` / `previewMask` | `preview.open` / `onOpenChange` / `actionsRender` / `imageRender` / `mask`（`{ enabled, blur, closable }`） / `cover` / `placeholder.progress` / `rootStyle` / `Image.PreviewGroup.items` | 新增占位加载进度条、缩放范围、`movable`、`wheel`、`onTransform`、`countRender` |
| List | `<a-list :data-source="..." />` | `<a-listy :items="..." row-key="..." :group="..." sticky virtual :scroll-width="..." />` | 内置虚拟滚动、分组吸顶、横向滚动与多维 `scrollTo` |
| Drawer | `afterVisibleChange` / `maskClosable` | `afterOpenChange` + `resizable`（`boolean \| { onResizeStart, onResize, onResizeEnd }`） + `loading` + `focusable` + `closable`/`mask` 对象 | 支持边缘拖拽改宽/高、关闭后焦点恢复、`closable.placement`、`mask.blur`、自定义尺寸 |
| Modal | `maskClosable` / `closeIcon` | `loading`（骨架屏） + `scrollLock` + `afterOpenChange` + `closable`/`mask` 对象 | 支持关闭背景滚动锁与 `mask: { enabled, blur, closable }` |
| Notification | `btn` | `actions` + `stack`（`boolean \| { threshold }`） + `showProgress` + `pauseOnHover` + `closable` 对象 | 支持堆叠折叠与悬停展开、倒计时进度条 |
| Timeline | `<a-timeline-item>` | `:items="timelineItems"`（`content`、`title`、`icon`、`placement`） + `orientation="horizontal" \| "vertical"` + `variant="filled" \| "outlined"` + `titleSpan` | 数据驱动配置与水平时间轴 |
| Breadcrumb / Descriptions | `routes` / `<a-descriptions-item>` | 配置式 `:items="..."`（`Breadcrumb` 新增 `dropdownIcon`；`Descriptions.items` 支持数值、`'filled'` 及响应式 `span`） | 兼容原有插槽子元素写法 |
| DatePicker / TimePicker | 单选 / 即点即选 | `variant`、`multiple`（`DatePicker` 多日期选择与 `maxTagCount`）、`needConfirm` | 自动继承 `Form.variant` |
| InputNumber / Radio / Rate | 手写后缀 / 手动撑满 / 固定星级尺寸 | `InputNumber`：`suffix` + `changeOnWheel`；`Radio.Group`：`block` + `orientation`/`vertical`；`Rate`：`size`（`small`/`middle`/`medium`/`large`） | 原生属性与组件级 Token 支持 |
| Slider | `tooltipOpen` / `tipFormatter` / `tooltipPlacement` / `onAfterChange` | `:tooltip="{ open, formatter, placement, getPopupContainer, autoAdjustOverflow }"` + `startPoint` + `orientation` + `@change-complete` + `handleRender` + `ariaDescribedByForHandle` | 支持自定义轨道起点与聚合 `tooltip` 配置对象 |
| Table | 大数据全量渲染 / 手动过滤列 | `virtual`（支持纵横双向虚拟滚动、固定列与 `ellipsis`） + `column.hidden`（支持分组列） + `column.sortIcon` + `filterOnClose` + `filterDropdownProps` | 内置虚拟滚动、高性能无重渲染列宽拖拽与声明式隐藏列 |
| Space / Tooltip | `Space`：`direction` / `split` | `Space`：`orientation` / `vertical` / `separator` + `Space.Addon`；`Tooltip`：`Tooltip.UniqueProvider` + `defaultOpen` + `afterOpenChange` | 平滑过渡提示与紧凑装饰块 |
| Steps / Splitter / Tabs | `Steps.direction` / `labelPlacement`；`Splitter.layout`；`Tabs.tabPosition` / `moreIcon` | `Steps`：`orientation` / `titlePlacement` / `variant` / `ellipsis` / `items[].content`；`Splitter`：`orientation` / `collapsibleIcon` / `draggerIcon` / `onDraggerDoubleClick`；`Tabs`：`items` / `tabPlacement`（`start`/`end`） / `more` / `indicator` | 布局与导航组件全面统一 v6 命名 |
| Carousel / Progress / Button / Collapse | `Carousel.dotPosition`；`Progress.gapPosition` / `trailColor`；`Button.iconPosition`；`Collapse.expandIconPosition` | `Carousel`：`dotPlacement` + `:autoplay="{ dotDuration: true }"`；`Progress`：`gapPlacement` / `railColor` / `percentPosition` / `rounding`；`Button`：`variant` + `color`（13 种预设色） + `iconPlacement`；`Collapse`：`expandIconPlacement` + `size` | 完整 v6 属性别名与视觉增强 |
| Spin / Segmented / Flex / Transfer / Watermark | `Spin.tip`；`Segmented`/`Flex` `vertical`；`Transfer.operations` | `Spin`：`description` + `percent="auto"` + `fullscreen`；`Segmented`/`Flex`：`orientation`；`Transfer`：`actions` + `deselectAll` + `selectionsIcon`；`Watermark`：`onRemove` + `{ text, font }` 分行样式 `content` | 现代化属性，兼容旧写法 |
| FloatButton / BackTop / Dropdown / Tour / Avatar.Group / Input.Search | 独立 `<a-back-top>`；`FloatButton.description`；`Avatar.Group.maxCount` | `<a-float-button-back-top>` + `FloatButton.Group.placement` + `content`；`Dropdown.autoAdjustOverflow`；`Tour.indicatorsRender` + `keyboard`；`Avatar.Group`：`:max="{ count, style, popover }"`；`Input.Search`：`searchIcon` | 独立 `BackTop` 废弃，推荐 `FloatButton.BackTop` |

### 常见 API 迁移前后对比示例

#### 1. `Divider`、`Alert`、`Tag` 与 `Image` v6 升级

```vue
<!-- ❌ Before (4.2.6) -->
<template>
  <a-divider type="horizontal" orientation="left" dashed>分组标题</a-divider>
  <a-alert message="系统通知" close-text="关闭" closable />
  <a-tag :bordered="false" color="blue">Beta</a-tag>
  <a-image
    src="/demo.png"
    :preview="{ visible: previewOpen, onVisibleChange: v => (previewOpen = v) }"
  />
</template>
```

```vue
<!-- ✅ After (4.3.0) -->
<template>
  <a-divider orientation="horizontal" title-placement="start" variant="dashed" size="small">
    分组标题
  </a-divider>
  <a-alert title="系统通知" variant="filled" :closable="{ closeIcon: '关闭' }" />
  <a-tag
    variant="filled"
    color="blue"
    href="https://hiltonkohler21.github.io/ant-design-vue"
    target="_blank"
  >
    Beta
  </a-tag>
  <a-image
    src="/demo.png"
    :preview="{
      open: previewOpen,
      onOpenChange: v => (previewOpen = v),
      mask: { blur: true },
    }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const previewOpen = ref(false);
</script>
```

#### 2. `Form.variant`、`DatePicker`（`multiple` / `needConfirm`）、`InputNumber`、`Radio.Group.block`、`Rate.size`、`Slider` 与 `Table`

```vue
<template>
  <a-form variant="filled" layout="vertical">
    <a-space orientation="vertical" :size="12" style="width: 100%">
      <!-- 自动继承 Form 的 variant="filled" -->
      <a-date-picker v-model:value="dates" multiple max-tag-count="responsive" />
      <a-time-picker v-model:value="time" need-confirm />
      <a-input-number v-model:value="price" prefix="¥" suffix="RMB" change-on-wheel />
      <a-select
        v-model:value="selected"
        popup-class-name="custom-dropdown"
        :popup-match-select-width="false"
        :popup-render="menuNode => h('div', { class: 'wrap' }, [menuNode])"
        :options="options"
      />
      <a-radio-group v-model:value="plan" block option-type="button" :options="planOptions" />
      <a-rate v-model:value="score" size="large" />
      <a-slider
        v-model:value="sliderVal"
        :tooltip="{ open: true, formatter: val => `${val}%` }"
        @change-complete="val => console.log('完成:', val)"
      />
    </a-space>
  </a-form>

  <!-- Table: virtual 虚拟滚动 + column.hidden -->
  <a-table
    virtual
    :scroll="{ y: 360 }"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

const dates = ref<Dayjs[]>([]);
const time = ref<Dayjs>();
const price = ref(99);
const selected = ref<string>();
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'Vite', value: 'vite' },
];
const plan = ref('pro');
const planOptions = [
  { label: '基础版', value: 'starter' },
  { label: '专业版', value: 'pro' },
  { label: '企业版', value: 'enterprise' },
];
const score = ref(4);
const sliderVal = ref(30);

const hideInternalId = ref(true);
const columns: TableColumnsType = [
  { title: '内部 ID', dataIndex: 'id', key: 'id', hidden: hideInternalId.value },
  { title: '名称', dataIndex: 'name', key: 'name' },
];
const rows = [{ id: 1, name: 'Ant Design Vue 4.3.0' }];
</script>
```

#### 3. `Drawer`（`resizable`）、`Modal`（`loading` + `mask.blur`）、`Notification`（`stack`）、`Timeline` / `Breadcrumb` / `Descriptions`（`items`）、`Button`、`Tabs`、`Carousel`、`Spin`

```vue
<template>
  <a-space orientation="vertical" :size="16" style="width: 100%">
    <!-- Button: color（含 13 种预设色）+ variant + iconPlacement -->
    <a-space wrap>
      <a-button color="purple" variant="solid">Purple Solid</a-button>
      <a-button color="cyan" variant="filled">Cyan Filled</a-button>
      <a-button color="danger" variant="outlined" icon-placement="end">Danger</a-button>
      <a-button @click="drawerOpen = true">可拖拽抽屉</a-button>
      <a-button @click="modalOpen = true">加载态弹窗</a-button>
      <a-button @click="openNotice">堆叠通知</a-button>
    </a-space>

    <!-- 配置式 Breadcrumb、Descriptions、Timeline -->
    <a-breadcrumb :items="[{ title: '首页', href: '/' }, { title: '升级 4.3.0' }]" />
    <a-descriptions
      bordered
      :items="[
        { key: '1', label: '版本', children: '4.3.0' },
        { key: '2', label: '主题引擎', children: 'CSS Variables（默认开启）', span: 'filled' },
      ]"
    />
    <a-timeline
      orientation="horizontal"
      variant="filled"
      :items="[
        { title: '4.2.6', content: '传统 hash 模式' },
        { title: '4.3.0', content: '默认 cssVar + v6 API' },
      ]"
    />

    <!-- Tabs、Carousel 进度条指示器、Spin 自动进度 -->
    <a-tabs :items="tabItems" tab-placement="top" destroy-on-hidden />
    <a-carousel :autoplay="{ dotDuration: true }" dot-placement="bottom">
      <div>轮播 1</div>
      <div>轮播 2</div>
    </a-carousel>
    <a-spin description="加载中..." percent="auto" />

    <!-- 可拖拽宽度的 Drawer 与骨架屏加载态 Modal -->
    <a-drawer
      v-model:open="drawerOpen"
      title="属性面板"
      resizable
      :mask="{ blur: true }"
      :after-open-change="open => console.log('Drawer:', open)"
    >
      拖拽抽屉左边缘即可实时调整宽度。
    </a-drawer>

    <a-modal
      v-model:open="modalOpen"
      title="订单详情"
      :loading="modalLoading"
      destroy-on-hidden
      :mask="{ blur: true }"
      :styles="{ body: { padding: '24px' } }"
    >
      弹窗主体内容。
    </a-modal>
  </a-space>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { App, Button } from '@hiltonkohler21/ant-design-vue';

const drawerOpen = ref(false);
const modalOpen = ref(false);
const modalLoading = ref(false);

const tabItems = [
  { key: '1', label: '概览', children: '概览内容' },
  { key: '2', label: '配置', children: '配置内容' },
];

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

1. **检查 `theme.useToken()` 用法**：全局搜索 `${token.` 或对 `token.value.*` 做数学运算 / 传给 Canvas / ECharts 的代码，改为直接传 `token.value.*` 给 CSS，或改用 `realToken.value.*`（也可先使用 `:theme="{ cssVar: false }"` 渐进迁移）。
2. **检查 `popupRender` 参数**：从 `dropdownRender` 迁移至 `popupRender` 时，确认回调函数第一个参数已改为直接接收 `menuNode`。
3. **检查弹层控制属性**：确认 `Modal`/`Drawer`/`Tooltip`/`Popover`/`Dropdown` 与 `Image`（`preview.open`）已使用 `open`，逐步清理旧的 `visible`。
4. **检查控制台警告**：在开发模式打开核心页面，逐步迁移 `Listy`（`data`→`items`、`itemKey`→`rowKey`）、`Select`（`dropdownClassName`→`popupClassName`）、`Divider`（`type`→`orientation`）等废弃提示。
5. **检查样式优先级与 SSR**：若接入了 TailwindCSS v4 或 Nuxt 3 / Vite SSR，请按下方常见问题完成校验。

### 升级常见问题

#### 1. TailwindCSS v4 样式冲突怎么处理？

TailwindCSS v4 使用原生 CSS `@layer`（`theme`, `base`, `components`, `utilities`），而 `@hiltonkohler21/ant-design-vue` 默认使用 `:where(.css-xxx)` 降权选择器。如果你引入了 `@hiltonkohler21/ant-design-vue/dist/reset.css` 或预提取的 `antdv.css`，请显式声明 `@layer` 顺序，避免 Tailwind Preflight 与 Ant Design Vue 互相覆盖：

```css
/* src/assets/main.css */
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
@import '@hiltonkohler21/ant-design-vue/dist/reset.css' layer(base);
/* 若使用 zeroRuntime 预提取静态样式，可将其放入 antd 层： */
/* @import './antdv.css' layer(antd); */
```

若发现 Tailwind 的原子类覆盖了组件基础样式（例如按钮背景透明），还可在根组件包裹 `<a-style-provider hash-priority="high">` 提升组件选择器权重。详情见 [样式兼容](/docs/vue/compatible-style-cn)。

#### 2. Nuxt 3 / Vite SSR 如何避免首屏闪烁（FOUC）？

在 `4.3.0` 默认开启 `cssVar: true` 后，服务端渲染除了调用 `extractStyle(cache)` 提取组件规则外，还需一并调用 `extractCSSVarStyle()` 提取 `:root` CSS 变量声明，确保首屏 HTML 立即拥有完整主题变量：

```ts
import {
  createCache,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,
} from '@hiltonkohler21/ant-design-vue';

// 每次 SSR 请求或预构建提取后：
const componentCss = extractStyle(cache);
const cssVarCss = `<style data-antdv-cssvar>${extractCSSVarStyle()}</style>`;
// 一起注入到 HTML <head> 中
```

完整 Nuxt 3 与 Vite SSR 实战代码请查阅 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

#### 3. 嵌套 `ConfigProvider` 局部主题会不会污染全局 `:root`？

**不会。** 在 `4.3.0` 中，顶层 `<a-config-provider>` 使用 `:root` CSS 变量模式以获得最佳全局换肤性能；当你在页面内部嵌套子级 `<a-config-provider>` 并设置了局部 `token`、`components` 或 `algorithm` 时，`@hiltonkohler21/ant-design-vue` 会**自动为该子树降级隔离为作用域 hash 模式**，防止子主题的变量声明覆盖外层 `:root`。

> 注意：如果嵌套 `<a-config-provider :theme="{ inherit: false }">` 想重置为默认主题而不传 `token`/`algorithm`，建议显式加上 `cssVar: false`（即 `:theme="{ inherit: false, cssVar: false }"`），确保其样式作用域完全隔离。
