# 定制主题

Ant Design Vue 在设计规范和技术架构上支持灵活的样式定制，以满足不同品牌与业务场景的视觉需求，包括全局主色、圆角、字号、暗黑/紧凑模式以及单组件级视觉定制。

在 `4.x` 版本中，我们采用基于 **Design Token + CSS-in-JS + 原生 CSS Variables（4.3.0 起默认开启）** 的现代主题体系：

1. 支持原生 `--ant-*` CSS 变量零开销动态换肤；
2. 支持同一页面多主题共存且组件样式仅生成一份；
3. 支持组件级 Component Token 精细覆写；
4. 支持 `zeroRuntime` 零运行时模式配合预提取的静态 CSS。

## 在 ConfigProvider 中配置主题

我们把影响主题的最小语义单元称为 **Design Token**。在根组件通过 `<a-config-provider :theme="...">` 即可完成全站主题定制。

> 注意：`ConfigProvider` 对 `message.xxx`、`Modal.xxx`、`notification.xxx` 等静态方法不生效（因为它们会动态挂载独立 Vue 实例）。请在根节点包裹 [`<a-app>`](/components/app-cn) 并使用 `App.useApp()`，或使用 `Modal.useModal()` / `message.useMessage()` / `notification.useNotification()` 以继承主题上下文。

### 修改主题变量

通过 `theme.token` 修改 Seed Token，组件库会自动派生出完整的色板、圆角与间距梯度：

```vue
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 4,
      },
    }"
  >
    <a-button type="primary">品牌色按钮</a-button>
  </a-config-provider>
</template>
```

这将会得到一个以 <ColorChunk color="#00b96b"></ColorChunk> 为主色的主题，以 Button 组件为例可以看到相应的变化：

![themed button](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*CbF_RJfKEiwAAAAAAAAAAAAAARQnAQ)

### 使用预设算法

通过 `theme.algorithm` 可以快速切换整体风格。`ant-design-vue` 内置三套预设算法，并支持以数组形式组合使用：

- 默认算法 `theme.defaultAlgorithm`
- 暗黑算法 `theme.darkAlgorithm`
- 紧凑算法 `theme.compactAlgorithm`

```vue
<template>
  <a-config-provider
    :theme="{
      algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }"
  >
    <a-button type="primary">暗黑紧凑主题</a-button>
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'ant-design-vue';
</script>
```

### 修改组件变量（Component Token）与局部算法

除了全局 Design Token，各组件也开放了独立的 Component Token（以及对该组件生效的 Alias Token 覆盖），不同组件之间互不影响：

```vue
<template>
  <a-config-provider
    :theme="{
      components: {
        Radio: {
          colorPrimary: '#00b96b',
        },
        Splitter: {
          splitBarSize: 4,
        },
      },
    }"
  >
    <a-radio>Radio</a-radio>
    <a-checkbox>Checkbox</a-checkbox>
  </a-config-provider>
</template>
```

通过这种方式，仅将 Radio 组件的主色改为 <ColorChunk color="#00b96b"></ColorChunk>，不会影响 Checkbox。

![component token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*EMY0QrHFDjsAAAAAAAAAAAAAARQnAQ)

> **组件级派生算法提示（`components[X].algorithm`）**：默认情况下，`theme.components[Component]` 仅直接覆写指定 Token，不触发 Seed → Map 的算法派生。如果需要让某一部分组件基于新的 Seed Token 触发完整的梯度色派生（对应 React `antd` 中的 `components[X].algorithm` 场景），推荐用嵌套 `<a-config-provider :theme="{ token: { colorPrimary: '#00b96b' }, algorithm: theme.defaultAlgorithm }">` 包裹该组件区域，即可获得完整派生色板且自动隔离局部作用域。

### 禁用动画（`token.motion: false`）

在一些极端性能场景、自动化测试或遵循用户减少动效偏好时，可通过 `token.motion: false` 搭配将时长基数归零来关闭组件过渡动画，同时可选关闭点击波纹：

```vue
<template>
  <a-config-provider
    :theme="{
      token: {
        motion: false,
        motionUnit: 0,
        motionBase: 0,
      },
    }"
    :wave="{ disabled: true }"
  >
    <App />
  </a-config-provider>
</template>
```

## 动态主题与 Token 消费

### 动态切换主题

在 Vue 3 中，只需将 `theme` 绑定为响应式 `ref` / `computed`，修改后页面会自动平滑切换：

```vue
<template>
  <a-config-provider :theme="themeConfig">
    <a-button @click="isDark = !isDark">切换{{ isDark ? '亮色' : '暗黑' }}</a-button>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { theme } from 'ant-design-vue';

const isDark = ref(false);
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));
</script>
```

### 局部主题（嵌套 `ConfigProvider`）

嵌套使用 `<a-config-provider>` 可为页面局部应用不同主题，子主题中未修改的 Token 会继承父主题。在 `4.3.0` 默认 CSS 变量模式下，嵌套且自定义了 `token` / `components` / `algorithm` 的子 `ConfigProvider` 会**自动隔离为作用域 hash 模式**，不会污染全局 `:root` 变量：

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-button type="primary">全局蓝</a-button>
    <a-config-provider :theme="{ token: { colorPrimary: '#00b96b' } }">
      <a-button type="primary">局部绿（自动隔离）</a-button>
    </a-config-provider>
  </a-config-provider>
</template>
```

### 在组件内消费 Design Token：`token` 与 `realToken`（4.3.0 必读）

使用 `theme.useToken()` 可以获取当前主题上下文中的 Design Token：

```vue
<template>
  <div :style="boxStyle">使用当前主题 Token</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token, realToken } = theme.useToken();

// ✅ 直接赋值给 CSS 属性（4.3.0 默认 cssVar 模式下为 var(--ant-*)，已自带单位）
const boxStyle = computed(() => ({
  color: token.value.colorPrimary,
  backgroundColor: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
  padding: `calc(${token.value.padding} * 1.5)`,
}));

// ✅ 若需做 JS 数值运算、拼接 px、颜色运算或 Canvas/SVG/ECharts 绘制，请使用 realToken
const chartPrimaryColor = computed(() => realToken.value.colorPrimary); // "#1677ff"
const radiusNumber = computed(() => realToken.value.borderRadius); // 6
</script>
```

> **⚠️ 4.3.0 避坑提醒**：`4.3.0` 默认开启 `cssVar: true`，此时 `token.value.borderRadius` 是字符串 `'var(--ant-border-radius)'` 而不是数字 `6`。**切勿**写成 `` `${token.value.borderRadius}px` ``（会产出非法 CSS `var(--ant-border-radius)px`）或 `token.value.padding * 2`（会产出 `NaN`）。请直接传 `token.value.borderRadius` 给 CSS，或解构 **`realToken`** 读取真实数值/色值。

### 在 Vue 生命周期外静态获取 Token（静态消费）

当需要在非组件代码（如构建脚本、Canvas 工具函数、Less `modifyVars`）中计算主题 Token 时，可以直接调用预设算法与 `defaultSeed` 派生完整 Map Token（等价于 React `antd` 中的 `theme.getDesignToken(config)`）：

```ts
import { theme } from 'ant-design-vue';
import type { SeedToken, MapToken } from 'ant-design-vue/es/theme/interface';

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm, defaultSeed } = theme;

// 封装等价于 getDesignToken 的纯函数
function getDesignToken(config?: {
  token?: Partial<SeedToken>;
  algorithm?: ((t: SeedToken) => MapToken) | ((t: SeedToken) => MapToken)[];
}) {
  const mergedSeed: SeedToken = { ...defaultSeed, ...config?.token };
  const algorithms = config?.algorithm
    ? Array.isArray(config.algorithm)
      ? config.algorithm
      : [config.algorithm]
    : [defaultAlgorithm];
  return algorithms.reduce<any>((acc, fn) => fn(acc), mergedSeed);
}

// 获取默认或自定义主题 Token
const lightToken = getDesignToken({ token: { colorPrimary: '#00b96b' } });
const darkCompactToken = getDesignToken({
  token: { colorPrimary: '#00b96b' },
  algorithm: [darkAlgorithm, compactAlgorithm],
});
```

如需将 Token 注入到 Less 预处理器，可通过 `less-loader` 的 `modifyVars` 传入；若需兼容旧版 v3 Less 变量名，可查阅 [从 V3 到 V4 迁移指南](/docs/vue/migration-v4-cn)。

## CSS 变量模式与零运行时（4.3.0+）

### CSS 变量模式（默认开启）

自 `4.3.0` 起，`theme.cssVar` 默认为 `true`。组件样式只生成一份并通过 `--ant-*` 变量驱动，3 套主题下总 CSS 体积降低 50.5%、多主题增量降低 86.8%。你也可以自定义 CSS 变量前缀或主题 key：

```vue
<template>
  <a-config-provider
    :theme="{
      cssVar: { prefix: 'my', key: 'brand-theme' },
      token: { colorPrimary: '#00b96b' },
    }"
  >
    <a-button type="primary">自定义 CSS 变量前缀</a-button>
  </a-config-provider>
</template>
```

如需临时回退到旧版 hash 模式，显式传入 `:theme="{ cssVar: false }"` 即可。

### 零运行时模式（`zeroRuntime: true`）

配合构建期静态样式提取（`npm run static-style-extract` → `dist/static-style/antdv.css`），开启 `zeroRuntime: true` 后客户端运行时不再注入任何 `<style>` 标签：

```vue
<template>
  <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
    <App />
  </a-config-provider>
</template>
```

详细提取与 SSR 接入步骤请参考 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

## 三层 Design Token 体系

Ant Design 将 Design Token 划分为三层派生关系：**Seed Token → Map Token → Alias Token**。

![token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*uF3kTrY4InUAAAAAAAAAAAAAARQnAQ)

- **Seed Token（基础变量）**：所有设计意图的起源（如 `colorPrimary`、`borderRadius`、`fontSize`）。修改 Seed Token 会通过 `algorithm` 自动派生梯度变量。
- **Map Token（梯度变量）**：由 Seed Token 经算法派生出的色板梯度、圆角与间距体系（如 `colorPrimaryBg`、`colorPrimaryHover`）。推荐通过 `algorithm` 统一调整，也可在 `theme.token` 中单独覆写。
- **Alias Token（别名变量）**：用于批量控制共性组件样式的语义别名（如 `colorLink`、`colorTextHeading`、`paddingContentHorizontal`）。

## API

### ThemeConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `token` | 修改全局 Design Token（Seed / Map / Alias Token） | `Partial<AliasToken>` | - | `4.0.0` |
| `components` | 修改指定组件的 Component Token 及该组件消费的 Alias Token | `OverrideToken` | - | `4.0.0` |
| `algorithm` | Seed Token 到 Map Token 的派生算法，支持单个或数组组合 | `MappingAlgorithm \| MappingAlgorithm[]` | `theme.defaultAlgorithm` | `4.0.0` |
| `inherit` | 是否继承上层 `ConfigProvider` 配置的主题 | `boolean` | `true` | `4.0.0` |
| `hashed` | 是否为组件样式附加 hash 类名 | `boolean` | `true` | `4.0.0` |
| `cssVar` | CSS 变量模式配置；`4.3.0` 起默认开启，传 `false` 回退 hash 模式 | `boolean \| CssVarConfig` | `true` | `4.3.0` |
| `zeroRuntime` | 零运行时模式，开启后跳过运行时 `<style>` 注入，需配合静态 CSS | `boolean` | `false` | `4.3.0` |

### CssVarConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| `prefix` | 生成的 CSS 变量名前缀（例如 `'ant'` → `--ant-color-primary`） | `string` | `'ant'` | `4.3.0` |
| `key` | 当前主题 CSS 变量缓存标识 | `string` | 自动生成 | `4.3.0` |

### OverrideToken

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `Component`（任意组件名，如 `Button`、`Splitter`） | 修改该组件的 Component Token 或覆盖该组件消费的 Alias Token | `Partial<ComponentToken> & Partial<AliasToken>` | - |

### SeedToken

<TokenTable type="seed"></TokenTable>

### MapToken

> 继承所有 SeedToken 的属性

<TokenTable type="map"></TokenTable>

### AliasToken

> 继承所有 SeedToken 和 MapToken 的属性

<TokenTable type="alias"></TokenTable>

## 调试主题

我们提供了可视化的 [主题编辑器](/theme-editor-cn)，你可以实时调整 Seed / Map / Alias 与 Component Token，并预览亮色/暗黑模式效果。

## 兼容旧版浏览器

请参考 [样式兼容](/docs/vue/compatible-style-cn)。
